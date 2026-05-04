'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

export default function NQueens4({ onComplete }: Props) {
  const size = 4;
  const [queens, setQueens] = useState<number[]>(Array(size).fill(-1));
  const [feedback, setFeedback] = useState<string | null>(null);

  const isConflict = (row: number, col: number) => {
    for (let r = 0; r < size; r++) {
      if (r === row || queens[r] === -1) continue;
      if (queens[r] === col) return true;
      if (Math.abs(queens[r] - col) === Math.abs(r - row)) return true;
    }
    return false;
  };

  const handleClick = (r: number, c: number) => {
    const newQueens = [...queens];
    newQueens[r] = newQueens[r] === c ? -1 : c;
    setQueens(newQueens);

    if (newQueens.every(q => q !== -1)) {
      let valid = true;
      for (let i = 0; i < size && valid; i++)
        for (let j = i + 1; j < size && valid; j++)
          if (newQueens[i] === newQueens[j] || Math.abs(newQueens[i] - newQueens[j]) === Math.abs(i - j)) valid = false;
      if (valid) { setFeedback('correct'); setTimeout(onComplete, 500); }
      else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 800); }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '260px', textAlign: 'center' }}>
      <div className="queen-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {Array.from({ length: size * size }, (_, i) => {
          const r = Math.floor(i / size), c = i % size;
          const hasQueen = queens[r] === c;
          const threatened = !hasQueen && isConflict(r, c);
          return (
            <button key={i} className={`queen-cell ${(r + c) % 2 === 0 ? 'light' : 'dark'} ${threatened ? 'threatened' : ''}`}
              onClick={() => handleClick(r, c)}
              style={{ height: '56px' }}>
              {hasQueen ? '♛' : ''}
            </button>
          );
        })}
      </div>
      {feedback && <p style={{ marginTop: '8px', color: feedback === 'correct' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
        {feedback === 'correct' ? '✅ Perfect!' : '❌ Queens are attacking each other!'}
      </p>}
    </div>
  );
}
