'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function ChessKnightPath({ onComplete, difficulty = 1 }: Props) {
  const size = 5;
  const [knightPos, setKnightPos] = useState({ x: 0, y: 0 });
  const [targetPos] = useState({ x: 4, y: 4 });
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (knightPos.x === targetPos.x && knightPos.y === targetPos.y) {
      setTimeout(onComplete, 500);
    }
  }, [knightPos, targetPos, onComplete]);

  const isValidMove = (dx: number, dy: number) => {
    return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
  };

  const handleCellClick = (x: number, y: number) => {
    const dx = x - knightPos.x;
    const dy = y - knightPos.y;
    
    if (isValidMove(dx, dy)) {
      setKnightPos({ x, y });
      setMoves(m => m + 1);
    }
  };

  const getCellColor = (x: number, y: number) => {
    if (x === targetPos.x && y === targetPos.y) return 'rgba(16, 185, 129, 0.4)'; // Target (green)
    const isDark = (x + y) % 2 === 1;
    return isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'; // Chess board pattern
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Move the Knight ♞ (L-shape) to the Target 🎯.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Moves: {moves}</p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '2px',
          border: '2px solid var(--border)'
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
          const x = i % size;
          const y = Math.floor(i / size);
          const isKnight = knightPos.x === x && knightPos.y === y;
          const isTarget = targetPos.x === x && targetPos.y === y;
          
          // Highlight valid moves
          const isValid = isValidMove(x - knightPos.x, y - knightPos.y);

          return (
            <button
              key={i}
              onClick={() => handleCellClick(x, y)}
              style={{
                width: '60px', height: '60px',
                background: getCellColor(x, y),
                border: isValid ? '2px dashed var(--accent-primary)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                cursor: isValid ? 'pointer' : 'default',
                transition: 'background 0.2s ease',
                position: 'relative'
              }}
            >
              {isTarget && !isKnight && <span style={{ opacity: 0.8 }}>🎯</span>}
              {isKnight && (
                <span style={{ position: 'absolute', zIndex: 10, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                  ♞
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button className="btn btn-ghost mt-md" onClick={() => { setKnightPos({ x: 0, y: 0 }); setMoves(0); }}>
        Reset Board
      </button>
    </div>
  );
}
