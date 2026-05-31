'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function ReflectionSymmetry({ onComplete }: Props) {
  const size = 4;
  
  // Left half (fixed pattern)
  const leftPattern = [
    [false, true, false, false],
    [false, true, true, false],
    [false, false, true, true],
    [true, false, false, false]
  ];

  // Right half (player input)
  const [rightGrid, setRightGrid] = useState<boolean[][]>([
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ]);

  useEffect(() => {
    // Check if rightGrid is a perfect horizontal reflection of leftPattern
    let isCorrect = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const mirroredCol = (size - 1) - c;
        if (rightGrid[r][c] !== leftPattern[r][mirroredCol]) {
          isCorrect = false;
        }
      }
    }
    
    // Check if they actually clicked something (not just empty grid, though our target isn't empty)
    const hasCells = rightGrid.some(row => row.some(cell => cell));
    
    if (isCorrect && hasCells) {
      setTimeout(onComplete, 500);
    }
  }, [rightGrid, onComplete]);

  const toggleRightCell = (r: number, c: number) => {
    setRightGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = !next[r][c];
      return next;
    });
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Draw the perfect mirror reflection on the right side!
        </p>
      </div>

      <div className="card flex-center" style={{ background: 'var(--bg-card)', padding: '24px', width: '100%' }}>
        
        <div style={{ display: 'flex', gap: '4px', background: 'var(--border)', padding: '4px', borderRadius: '8px' }}>
          
          {/* Left Grid (Read Only) */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '2px', background: 'var(--border)' }}>
            {leftPattern.map((row, r) => (
              row.map((isActive, c) => (
                <div
                  key={`L-${r}-${c}`}
                  style={{
                    width: '40px', height: '40px',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-body)',
                    transition: 'background 0.2s ease',
                  }}
                />
              ))
            ))}
          </div>

          <div style={{ width: '4px', background: 'rgba(255,255,255,0.2)' }} /> {/* Mirror Line */}

          {/* Right Grid (Interactive) */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '2px', background: 'var(--border)' }}>
            {rightGrid.map((row, r) => (
              row.map((isActive, c) => (
                <button
                  key={`R-${r}-${c}`}
                  onClick={() => toggleRightCell(r, c)}
                  style={{
                    width: '40px', height: '40px',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-body)',
                    border: 'none', cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                />
              ))
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
