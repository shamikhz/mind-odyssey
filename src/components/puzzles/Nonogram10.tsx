'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// 10x10 nonogram - smiley face
const solution = [
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,0,0,0,0,0,0,1,0],
  [1,0,0,1,0,0,1,0,0,1],
  [1,0,0,1,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,0,1,1,1,1,0,0,1],
  [0,1,0,0,0,0,0,0,1,0],
  [0,0,1,1,1,1,1,1,0,0],
];

function getClues(lines: number[][]): number[][] {
  return lines.map(line => {
    const clues: number[] = [];
    let count = 0;
    line.forEach(cell => { if (cell) count++; else if (count) { clues.push(count); count = 0; } });
    if (count) clues.push(count);
    return clues.length ? clues : [0];
  });
}

const rowClues = getClues(solution);
const colClues = getClues(Array.from({ length: 10 }, (_, c) => solution.map(r => r[c])));

export default function Nonogram10({ onComplete }: Props) {
  const [grid, setGrid] = useState(Array(10).fill(null).map(() => Array(10).fill(0)));
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggle = (r: number, c: number) => {
    setGrid(g => { const n = g.map(row => [...row]); n[r][c] = n[r][c] === 1 ? 0 : 1; return n; });
  };

  const check = () => {
    const correct = grid.every((row, r) => row.every((cell, c) => cell === solution[r][c]));
    if (correct) { setFeedback('correct'); setTimeout(onComplete, 500); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 800); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center', overflowX: 'auto' }}>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `50px repeat(10, 30px)`, gap: '1px' }}>
        <div />
        {colClues.map((clue, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            {clue.map((n, j) => <span key={j}>{n}</span>)}
          </div>
        ))}
        {grid.map((row, r) => (
          <React.Fragment key={r}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', paddingRight: '4px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              {rowClues[r].map((n, j) => <span key={j}>{n}</span>)}
            </div>
            {row.map((cell, c) => (
              <button key={c} onClick={() => toggle(r, c)} style={{
                width: '30px', height: '30px', border: '1px solid var(--border)', borderRadius: '2px',
                background: cell === 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', cursor: 'pointer',
              }} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <button className="btn btn-primary w-full mt-md" onClick={check}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Perfect!' : feedback === 'wrong' ? '❌ Try Again' : 'Check'}
      </button>
    </div>
  );
}
