'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

export default function MagicSquare({ onComplete }: Props) {
  const [grid, setGrid] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    // Scramble numbers 1-9
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    setGrid(nums);
  }, []);

  const handleClick = (idx: number) => {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null);
        return;
      }
      
      // Swap
      setGrid(prev => {
        const next = [...prev];
        const temp = next[selectedIdx];
        next[selectedIdx] = next[idx];
        next[idx] = temp;
        
        checkWin(next);
        return next;
      });
      setSelectedIdx(null);
    }
  };

  const checkWin = (g: number[]) => {
    const r1 = g[0] + g[1] + g[2];
    const r2 = g[3] + g[4] + g[5];
    const r3 = g[6] + g[7] + g[8];
    const c1 = g[0] + g[3] + g[6];
    const c2 = g[1] + g[4] + g[7];
    const c3 = g[2] + g[5] + g[8];
    const d1 = g[0] + g[4] + g[8];
    const d2 = g[2] + g[4] + g[6];

    if (r1 === 15 && r2 === 15 && r3 === 15 && c1 === 15 && c2 === 15 && c3 === 15 && d1 === 15 && d2 === 15) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Swap the numbers so that every row, column, and diagonal adds up to <b>15</b>!
        </p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          border: '2px solid var(--border)'
        }}
      >
        {grid.map((num, idx) => (
          <motion.button
            key={num}
            layout
            onClick={() => handleClick(idx)}
            style={{
              width: '80px', height: '80px',
              background: 'var(--bg-body)',
              border: selectedIdx === idx ? '3px solid var(--accent-primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 'bold',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              boxShadow: selectedIdx === idx ? '0 0 15px var(--accent-primary)' : 'none'
            }}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
