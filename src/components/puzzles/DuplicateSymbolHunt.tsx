'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

const POOL = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
  '🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝',
  '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️',
  '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🎱','🪀','🏓','🏸','🏒','🏑','🥍'
];

export default function DuplicateSymbolHunt({ onComplete, difficulty = 1 }: Props) {
  const [grid, setGrid] = useState<string[]>([]);
  const [duplicate, setDuplicate] = useState<string>('');
  const [error, setError] = useState(false);
  
  // difficulty 1 -> 4x4 (16), diff 2 -> 5x5 (25), diff 3 -> 6x6 (36)
  const size = 3 + Math.min(difficulty, 3); 
  const totalCells = size * size;

  useEffect(() => {
    // Generate grid
    const shuffledPool = [...POOL].sort(() => Math.random() - 0.5);
    // We need (totalCells - 1) unique symbols
    const selectedUniques = shuffledPool.slice(0, totalCells - 1);
    
    // Pick one of them to be the duplicate
    const dupe = selectedUniques[Math.floor(Math.random() * selectedUniques.length)];
    setDuplicate(dupe);
    
    const finalGrid = [...selectedUniques, dupe].sort(() => Math.random() - 0.5);
    setGrid(finalGrid);
  }, [totalCells]);

  const handleSelect = (symbol: string) => {
    if (symbol === duplicate) {
      setTimeout(onComplete, 400);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          One symbol appears <b>exactly twice</b>. Find it!
        </p>
      </div>

      <div 
        className={`card flex-center ${error ? 'error-shake' : ''}`}
        style={{ 
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '8px'
        }}>
          {grid.map((symbol, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(symbol)}
              style={{
                width: '50px',
                height: '50px',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-body)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
