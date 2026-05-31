'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

// Simplified Pipe logic: each cell has a specific correct rotation
// To win, all pipes must match their correct rotation (accounting for 180deg symmetry on straights)
type PipeType = 'straight' | 'corner' | 'start' | 'end';
type Pipe = { id: number; type: PipeType; correctRot: number; currentRot: number };

export default function RotatePipes({ onComplete, difficulty = 1 }: Props) {
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const size = 4; // 4x4 grid

  useEffect(() => {
    // Generate a fixed 4x4 puzzle that forms a connected path
    // S = Start (0), E = End (15)
    // S - 1 - 2
    //     |   |
    //     5 - 6 - E
    const layout: {id: number, type: PipeType, correct: number}[] = [
      { id: 0, type: 'start', correct: 90 }, // points Right
      { id: 1, type: 'straight', correct: 90 }, // Horizontal
      { id: 2, type: 'corner', correct: 180 }, // ┗ (connects Left and Bottom)
      { id: 3, type: 'straight', correct: 90 }, // Fake
      
      { id: 4, type: 'corner', correct: 0 }, // Fake
      { id: 5, type: 'corner', correct: 90 }, // ┏ (connects Top and Right)
      { id: 6, type: 'corner', correct: 270 }, // ┛ (connects Left and Top)
      { id: 7, type: 'straight', correct: 90 }, // Fake
      
      { id: 8, type: 'straight', correct: 0 }, // Fake
      { id: 9, type: 'corner', correct: 90 }, // Fake
      { id: 10, type: 'straight', correct: 0 }, // Vertical (connects 6 and 14)
      { id: 11, type: 'corner', correct: 180 }, // Fake
      
      { id: 12, type: 'straight', correct: 90 }, // Fake
      { id: 13, type: 'corner', correct: 270 }, // Fake
      { id: 14, type: 'corner', correct: 90 }, // ┏ (connects Top and Right)
      { id: 15, type: 'end', correct: 270 }  // points Left (accepts from 14)
    ];

    // Scramble rotations
    const scrambled = layout.map(p => ({
      ...p,
      correctRot: p.correct,
      currentRot: (p.type === 'start' || p.type === 'end') ? p.correct : Math.floor(Math.random() * 4) * 90
    }));

    setPipes(scrambled);
  }, []);

  const handleRotate = (id: number) => {
    setPipes(prev => {
      const next = prev.map(p => p.id === id && p.type !== 'start' && p.type !== 'end' ? { ...p, currentRot: (p.currentRot + 90) % 360 } : p);
      checkWin(next);
      return next;
    });
  };

  const checkWin = (currentPipes: Pipe[]) => {
    const isWin = currentPipes.every(p => {
      if (p.currentRot === p.correctRot) return true;
      if (p.type === 'straight' && Math.abs(p.currentRot - p.correctRot) === 180) return true;
      return false;
    });

    if (isWin) {
      setTimeout(onComplete, 500);
    }
  };

  const getPipeSymbol = (type: PipeType) => {
    switch (type) {
      case 'straight': return '┃';
      case 'corner': return '┏';
      case 'start': return '⏺';
      case 'end': return '🎯';
      default: return '';
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Click the pipes to rotate them and connect the Start (⏺) to the Target (🎯).
        </p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '4px',
          border: '2px solid var(--border)'
        }}
      >
        {pipes.map((p) => {
          const isFixed = p.type === 'start' || p.type === 'end';
          return (
            <button
              key={p.id}
              onClick={() => handleRotate(p.id)}
              disabled={isFixed}
              style={{
                width: '60px', height: '60px',
                background: 'var(--bg-body)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem',
                color: isFixed ? 'var(--accent-primary)' : 'var(--text-primary)',
                cursor: isFixed ? 'default' : 'pointer',
                transition: 'transform 0.2s ease',
                transform: `rotate(${p.currentRot}deg)`
              }}
            >
              {getPipeSymbol(p.type)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
