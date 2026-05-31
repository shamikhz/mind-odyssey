'use client';
import React, { useState, useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

export default function AvoidTheBombs({ onComplete }: Props) {
  const size = 5; // 5x5 grid
  const totalBombs = 5;
  const targetSafe = (size * size) - totalBombs;

  const [bombs, setBombs] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [phase, setPhase] = useState<'start' | 'memorize' | 'play' | 'error'>('start');

  const { seconds, start, reset } = useCountdown(3, () => {
    setPhase('play');
  });

  const startGame = () => {
    // Pick 5 random unique indices
    const indices = Array.from({ length: size * size }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    setBombs(shuffled.slice(0, totalBombs));
    setRevealed([]);
    setPhase('memorize');
    reset(3);
    start();
  };

  useEffect(() => {
    if (phase === 'play' && revealed.length === targetSafe) {
      setTimeout(onComplete, 500);
    }
  }, [revealed, phase, targetSafe, onComplete]);

  const handleTap = (idx: number) => {
    if (phase !== 'play') return;
    if (revealed.includes(idx)) return;

    if (bombs.includes(idx)) {
      setPhase('error');
      setTimeout(() => setPhase('start'), 1500);
    } else {
      setRevealed(prev => [...prev, idx]);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Memorize the bomb locations! Then click all <b>{targetSafe}</b> safe squares.
        </p>
      </div>

      <div className={`card flex-col flex-center mb-lg ${phase === 'error' ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', width: '100%', minHeight: '400px', borderColor: phase === 'error' ? 'var(--danger)' : 'var(--border)' }}>
        
        {phase === 'start' && (
          <button className="btn btn-primary btn-lg" onClick={startGame}>Reveal Bombs</button>
        )}

        {phase === 'error' && (
          <div className="flex-col flex-center mb-md">
            <h2 style={{ color: 'var(--danger)' }}>BOOM! You hit a bomb!</h2>
          </div>
        )}

        {phase !== 'start' && (
          <>
            <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {phase === 'memorize' && <span style={{ color: 'var(--warning)' }}>Memorize! ({seconds}s)</span>}
              {phase === 'play' && <span style={{ color: 'var(--accent-primary)' }}>Safe Found: {revealed.length} / {targetSafe}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '8px' }}>
              {Array.from({ length: size * size }).map((_, i) => {
                const isBomb = bombs.includes(i);
                const isRevealed = revealed.includes(i);
                
                let content = '';
                let bg = 'var(--bg-body)';
                
                if (phase === 'memorize' && isBomb) {
                  content = '💣';
                } else if (phase === 'error' && isBomb) {
                  content = '💣';
                  bg = 'rgba(239, 68, 68, 0.5)';
                } else if (isRevealed) {
                  content = '✓';
                  bg = 'rgba(16, 185, 129, 0.2)';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleTap(i)}
                    style={{
                      width: '50px', height: '50px',
                      background: bg,
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: phase === 'play' && !isRevealed ? 'pointer' : 'default',
                      color: isRevealed ? 'var(--success)' : 'inherit',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </>
        )}

      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
