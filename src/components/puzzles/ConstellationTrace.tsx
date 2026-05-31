'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function ConstellationTrace({ onComplete }: Props) {
  const size = 5; // 5x5 star grid
  
  // The "Big Dipper" roughly in a 5x5
  const targetConstellation = [
    {x: 0, y: 0},
    {x: 1, y: 1},
    {x: 2, y: 2},
    {x: 3, y: 3},
    {x: 4, y: 2},
    {x: 4, y: 4},
    {x: 3, y: 4}
  ];

  const [selectedStars, setSelectedStars] = useState<{x: number, y: number}[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (selectedStars.length === targetConstellation.length) {
      // Check if they match regardless of order
      const isCorrect = targetConstellation.every(t => 
        selectedStars.some(s => s.x === t.x && s.y === t.y)
      );

      if (isCorrect) {
        setTimeout(onComplete, 500);
      } else {
        setError(true);
        setTimeout(() => { setError(false); setSelectedStars([]); }, 800);
      }
    }
  }, [selectedStars, onComplete, targetConstellation]);

  const handleStarClick = (x: number, y: number) => {
    const isSelected = selectedStars.some(s => s.x === x && s.y === y);
    if (isSelected) {
      setSelectedStars(prev => prev.filter(s => !(s.x === x && s.y === y)));
    } else {
      setSelectedStars(prev => [...prev, {x, y}]);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Trace the Big Dipper constellation by selecting the correct {targetConstellation.length} stars!
        </p>
      </div>

      <div 
        className={`card flex-center ${error ? 'error-shake' : ''}`}
        style={{ 
          background: 'var(--bg-card)', 
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '16px',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
          const x = i % size;
          const y = Math.floor(i / size);
          const isSelected = selectedStars.some(s => s.x === x && s.y === y);
          
          return (
            <button
              key={i}
              onClick={() => handleStarClick(x, y)}
              style={{
                width: '40px', height: '40px',
                background: 'none', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', cursor: 'pointer',
                filter: isSelected ? 'drop-shadow(0 0 10px white)' : 'opacity(0.3)',
                transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
            >
              ✨
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '24px', color: 'var(--text-tertiary)' }}>
        Selected: {selectedStars.length} / {targetConstellation.length}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
