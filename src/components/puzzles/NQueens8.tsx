'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

export default function NQueens8({ onComplete }: Props) {
  const size = 8;
  const [queens, setQueens] = useState<number[]>(Array(size).fill(-1));
  const [feedback, setFeedback] = useState<string|null>(null);

  const isConflict = (row: number, col: number) => {
    for (let r = 0; r < size; r++) {
      if (r===row||queens[r]===-1) continue;
      if (queens[r]===col||Math.abs(queens[r]-col)===Math.abs(r-row)) return true;
    }
    return false;
  };

  const handleClick = (r: number, c: number) => {
    const nq = [...queens]; nq[r] = nq[r]===c ? -1 : c; setQueens(nq);
    if (nq.every(q => q!==-1)) {
      let valid = true;
      for (let i=0;i<size&&valid;i++) for (let j=i+1;j<size&&valid;j++)
        if (nq[i]===nq[j]||Math.abs(nq[i]-nq[j])===Math.abs(i-j)) valid=false;
      if (valid) { setFeedback('correct'); setTimeout(onComplete, 500); }
      else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 800); }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
      <div className="queen-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {Array.from({length: size*size}, (_, i) => {
          const r=Math.floor(i/size), c=i%size;
          const hasQueen = queens[r]===c;
          return (
            <button key={i} className={`queen-cell ${(r+c)%2===0?'light':'dark'} ${!hasQueen&&isConflict(r,c)?'threatened':''}`}
              onClick={() => handleClick(r,c)} style={{ height: '38px', fontSize: '1.1rem' }}>
              {hasQueen ? '♛' : ''}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Placed: {queens.filter(q=>q!==-1).length}/8</p>
    </div>
  );
}
