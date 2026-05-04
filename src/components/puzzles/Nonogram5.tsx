'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// 5x5 nonogram - heart shape
const solution = [
  [0,1,0,1,0],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
];
const rowClues = [[1,1],[5],[5],[3],[1]];
const colClues = [[0,1,3],[0,4],[1,5],[0,4],[0,1,3]].map(c => c.filter(n => n > 0));

export default function Nonogram5({ onComplete }: Props) {
  const [grid, setGrid] = useState(Array(5).fill(null).map(() => Array(5).fill(0)));
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
    <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `60px repeat(5, 44px)`, gap: '2px' }}>
        <div />
        {colClues.map((clue, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', padding: '2px' }}>
            {clue.map((n, j) => <span key={j}>{n}</span>)}
          </div>
        ))}
        {grid.map((row, r) => (
          <React.Fragment key={r}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', paddingRight: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {rowClues[r].map((n, j) => <span key={j}>{n}</span>)}
            </div>
            {row.map((cell, c) => (
              <button key={c} onClick={() => toggle(r, c)}
                className="grid-cell"
                style={{
                  width: '44px', height: '44px',
                  background: cell === 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                }} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <button className="btn btn-primary w-full mt-md" onClick={check}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Perfect!' : feedback === 'wrong' ? '❌ Try Again' : 'Check Solution'}
      </button>
    </div>
  );
}
