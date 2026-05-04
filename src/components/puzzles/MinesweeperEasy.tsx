'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const ROWS = 8, COLS = 8, MINES = 8;

function createBoard() {
  const board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
    if (board[r][c] !== -1) { board[r][c] = -1; placed++; }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c] !== -1) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === -1) count++;
          }
        board[r][c] = count;
      }
  return board;
}

const numColors: Record<number, string> = { 1: '#3b82f6', 2: '#10b981', 3: '#ef4444', 4: '#7c3aed', 5: '#f59e0b', 6: '#06b6d4', 7: '#000', 8: '#666' };

export default function MinesweeperEasy({ onComplete }: Props) {
  const [board] = useState(() => createBoard());
  const [revealed, setRevealed] = useState<boolean[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  const [flagged, setFlagged] = useState<boolean[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  const [gameOver, setGameOver] = useState(false);

  const reveal = (r: number, c: number) => {
    if (gameOver || revealed[r][c] || flagged[r][c]) return;
    const newRevealed = revealed.map(row => [...row]);
    if (board[r][c] === -1) { setGameOver(true); newRevealed[r][c] = true; setRevealed(newRevealed); return; }
    const flood = (r: number, c: number) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || newRevealed[r][c]) return;
      newRevealed[r][c] = true;
      if (board[r][c] === 0) { for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(r+dr, c+dc); }
    };
    flood(r, c);
    setRevealed(newRevealed);
    const safe = ROWS * COLS - MINES;
    const revealedCount = newRevealed.flat().filter(Boolean).length;
    if (revealedCount >= safe) setTimeout(onComplete, 500);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (revealed[r][c] || gameOver) return;
    setFlagged(f => { const n = f.map(row => [...row]); n[r][c] = !n[r][c]; return n; });
  };

  return (
    <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
      {gameOver && <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>💥 Mine hit! Refresh to retry</p>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '1px' }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`}
            className={`mine-cell ${revealed[r][c] ? (cell === -1 ? 'mine' : 'revealed') : ''} ${flagged[r][c] ? 'flagged' : ''}`}
            onClick={() => reveal(r, c)}
            onContextMenu={e => toggleFlag(e, r, c)}>
            {revealed[r][c] ? (cell === -1 ? '💣' : cell > 0 ? cell : '') : flagged[r][c] ? '🚩' : ''}
          </button>
        )))}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '8px' }}>Right-click to flag mines</p>
    </div>
  );
}
