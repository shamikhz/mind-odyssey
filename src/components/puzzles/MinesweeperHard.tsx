'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const ROWS = 10, COLS = 10, MINES = 15;

function createBoard() {
  const board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random()*ROWS), c = Math.floor(Math.random()*COLS);
    if (board[r][c] !== -1) { board[r][c] = -1; placed++; }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c] !== -1) {
        let count = 0;
        for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) {
          const nr=r+dr, nc=c+dc;
          if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&board[nr][nc]===-1) count++;
        }
        board[r][c] = count;
      }
  return board;
}

export default function MinesweeperHard({ onComplete }: Props) {
  const [board] = useState(() => createBoard());
  const [revealed, setRevealed] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  const [flagged, setFlagged] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  const [gameOver, setGameOver] = useState(false);

  const reveal = (r: number, c: number) => {
    if (gameOver||revealed[r][c]||flagged[r][c]) return;
    const nr = revealed.map(row => [...row]);
    if (board[r][c]===-1) { setGameOver(true); nr[r][c]=true; setRevealed(nr); return; }
    const flood = (r: number, c: number) => {
      if (r<0||r>=ROWS||c<0||c>=COLS||nr[r][c]) return;
      nr[r][c]=true;
      if (board[r][c]===0) for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) flood(r+dr,c+dc);
    };
    flood(r, c); setRevealed(nr);
    if (nr.flat().filter(Boolean).length >= ROWS*COLS-MINES) setTimeout(onComplete, 500);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (revealed[r][c]||gameOver) return;
    setFlagged(f => { const n=f.map(row=>[...row]); n[r][c]=!n[r][c]; return n; });
  };

  return (
    <div style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
      {gameOver && <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>💥 Mine hit!</p>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '1px' }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`}
            className={`mine-cell ${revealed[r][c]?(cell===-1?'mine':'revealed'):''} ${flagged[r][c]?'flagged':''}`}
            onClick={() => reveal(r,c)} onContextMenu={e => toggleFlag(e,r,c)}
            style={{ fontSize: '0.65rem', minWidth: '24px' }}>
            {revealed[r][c]?(cell===-1?'💣':cell>0?cell:''):flagged[r][c]?'🚩':''}
          </button>
        )))}
      </div>
    </div>
  );
}
