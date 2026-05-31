'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function LogicGridFinal({ onComplete }: Props) {
  const size = 5;
  
  // Create a solvable "Lights Out" board
  const [grid, setGrid] = useState<boolean[][]>(() => {
    // Start solved (all false), then simulate 7 random clicks to scramble it
    let g = Array.from({length: size}, () => Array(size).fill(false));
    
    const toggle = (r: number, c: number, board: boolean[][]) => {
      board[r][c] = !board[r][c];
      if (r > 0) board[r-1][c] = !board[r-1][c];
      if (r < size-1) board[r+1][c] = !board[r+1][c];
      if (c > 0) board[r][c-1] = !board[r][c-1];
      if (c < size-1) board[r][c+1] = !board[r][c+1];
    };

    // A fixed solvable scramble to ensure consistency
    const moves = [[0,1], [2,2], [4,3], [1,0], [3,4], [2,1]];
    moves.forEach(([r, c]) => toggle(r, c, g));
    
    return g;
  });

  useEffect(() => {
    // Check win condition: all false
    const isWin = grid.every(row => row.every(cell => !cell));
    if (isWin) {
      setTimeout(onComplete, 800);
    }
  }, [grid, onComplete]);

  const handleTap = (r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = !next[r][c];
      if (r > 0) next[r-1][c] = !next[r-1][c];
      if (r < size-1) next[r+1][c] = !next[r+1][c];
      if (c > 0) next[r][c-1] = !next[r][c-1];
      if (c < size-1) next[r][c+1] = !next[r][c+1];
      return next;
    });
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Lights Out! Tapping a tile toggles it and its adjacent neighbors. Turn ALL lights OFF!
        </p>
      </div>

      <div className="card flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '24px', width: '100%' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '6px' }}>
          {grid.map((row, r) => (
            row.map((isActive, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleTap(r, c)}
                style={{
                  width: '50px', height: '50px',
                  background: isActive ? 'var(--accent-primary)' : 'var(--bg-body)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                  boxShadow: isActive ? '0 0 15px rgba(124,58,237,0.8)' : 'none'
                }}
              />
            ))
          ))}
        </div>

      </div>

    </div>
  );
}
