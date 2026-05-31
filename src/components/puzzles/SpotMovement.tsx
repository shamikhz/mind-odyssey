'use client';
import React, { useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

const POOL = ['🍎', '🚀', '🦊', '🎸', '🍔', '⚡', '🏆', '🎈', '💎', '🌞'];

export default function SpotMovement({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'memorize' | 'hide' | 'guess'>('start');
  const [items, setItems] = useState<{id: number, symbol: string}[]>([]);
  const [movedId, setMovedId] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const gridSize = 9;

  const { seconds, start: startTimer, reset: resetTimer } = useCountdown(3, () => {
    setPhase('hide');
    setTimeout(() => setPhase('guess'), 600);
  });

  const startGame = () => {
    const symbols = [...POOL].sort(() => Math.random() - 0.5).slice(0, gridSize);
    const newItems = symbols.map((symbol, idx) => ({ id: idx, symbol }));
    
    setItems(newItems);
    setMovedId(Math.floor(Math.random() * gridSize)); // Select one to "move" later
    
    setPhase('memorize');
    resetTimer(3);
    startTimer();
  };

  const handleGuess = (id: number) => {
    if (phase !== 'guess') return;

    if (id === movedId) {
      setTimeout(onComplete, 400);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  if (phase === 'start') {
    return (
      <div className="flex-col flex-center" style={{ padding: '40px' }}>
        <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
          Memorize the grid. The screen will flash, and <b>one object will shift slightly</b>. Find it!
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start</button>
      </div>
    );
  }

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'memorize' && <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Memorize! ({seconds}s)</p>}
        {phase === 'hide' && <p style={{ color: 'var(--bg-body)' }}>...</p>}
        {phase === 'guess' && <p style={{ color: 'var(--text-secondary)' }}>Which object shifted?</p>}
      </div>

      <div 
        className={`card ${error ? 'error-shake' : ''}`}
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          width: '280px',
          height: '280px',
          padding: '24px',
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {items.map((item) => {
          const isHidden = phase === 'hide';
          // Apply a subtle movement to the chosen object during the guess phase
          const hasMoved = phase === 'guess' && item.id === movedId;
          const transformStr = hasMoved ? 'translateY(-15px) rotate(5deg)' : 'translateY(0) rotate(0deg)';

          return (
            <button
              key={item.id}
              onClick={() => handleGuess(item.id)}
              disabled={phase !== 'guess'}
              style={{
                fontSize: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                opacity: isHidden ? 0 : 1,
                cursor: phase === 'guess' ? 'pointer' : 'default',
                transform: transformStr,
                transition: isHidden ? 'none' : 'transform 0.1s ease', // Snap during hide, smooth otherwise
              }}
            >
              {item.symbol}
            </button>
          );
        })}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
