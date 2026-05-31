'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function SudokuMini({ onComplete }: Props) {
  // 4x4 Grid
  const solution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
  ];

  const prefilled = [
    [true, false, false, true],
    [false, true, false, false],
    [false, false, true, false],
    [true, false, false, true]
  ];

  const [grid, setGrid] = useState<number[][]>(() => {
    const initial = [
      [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
    ];
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        if (prefilled[r][c]) initial[r][c] = solution[r][c];
      }
    }
    return initial;
  });

  const [activeCell, setActiveCell] = useState<{r: number, c: number} | null>(null);

  useEffect(() => {
    // Check if fully correct
    let isCorrect = true;
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        if (grid[r][c] !== solution[r][c]) isCorrect = false;
      }
    }
    if (isCorrect) {
      setTimeout(onComplete, 500);
    }
  }, [grid, onComplete]);

  const handleInput = (val: number) => {
    if (!activeCell) return;
    const { r, c } = activeCell;
    if (prefilled[r][c]) return;

    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Fill the 4x4 grid. <br/> Every row, column, and 2x2 box must contain <b>1, 2, 3, 4</b> exactly once.
        </p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
          border: '4px solid var(--border)' // Thick outer border
        }}
      >
        {grid.map((row, r) => (
          row.map((val, c) => {
            const isFixed = prefilled[r][c];
            const isActive = activeCell?.r === r && activeCell?.c === c;
            
            // Add thicker borders for the 2x2 quadrants
            const borderRight = c === 1 ? '3px solid var(--border)' : '1px solid rgba(255,255,255,0.05)';
            const borderBottom = r === 1 ? '3px solid var(--border)' : '1px solid rgba(255,255,255,0.05)';

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => !isFixed && setActiveCell({r, c})}
                style={{
                  width: '60px', height: '60px',
                  background: isActive ? 'rgba(124,58,237,0.3)' : 'var(--bg-body)',
                  borderRight, borderBottom,
                  borderTop: 'none', borderLeft: 'none',
                  fontSize: '2rem', fontWeight: 'bold',
                  color: isFixed ? 'var(--text-primary)' : 'var(--accent-primary)',
                  cursor: isFixed ? 'default' : 'pointer',
                  outline: isActive ? '2px solid var(--accent-primary)' : 'none',
                  outlineOffset: '-2px'
                }}
              >
                {val === 0 ? '' : val}
              </button>
            );
          })
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        {[1, 2, 3, 4].map(num => (
          <button 
            key={num}
            onClick={() => handleInput(num)}
            disabled={!activeCell}
            className="btn btn-secondary"
            style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleInput(0)}
          disabled={!activeCell}
          className="btn btn-danger"
          style={{ width: '60px', height: '60px', fontSize: '1rem' }}
        >
          CLR
        </button>
      </div>

    </div>
  );
}
