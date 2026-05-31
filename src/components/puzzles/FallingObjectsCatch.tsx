'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Mole = { id: number; cellIdx: number; isGood: boolean; active: boolean };

export default function FallingObjectsCatch({ onComplete }: Props) {
  const targetScore = 10;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(false);
  const [activeCell, setActiveCell] = useState<Mole | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (score >= targetScore) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(onComplete, 500);
    }
  }, [score, targetScore, onComplete]);

  const startGame = () => {
    setScore(0);
    setError(false);
    setIsPlaying(true);
    spawnMole();
  };

  const spawnMole = () => {
    const nextIdx = Math.floor(Math.random() * 9);
    const isGood = Math.random() > 0.3; // 70% chance of being good 🍎, 30% bad 💣
    
    setActiveCell({ id: Date.now(), cellIdx: nextIdx, isGood, active: true });
    
    // Mole disappears after 800ms
    timerRef.current = setTimeout(() => {
      setActiveCell(null);
      if (isPlaying) {
        setTimeout(spawnMole, 200); // Wait 200ms before spawning next
      }
    }, 800);
  };

  const handleTap = (cellIdx: number) => {
    if (!isPlaying || !activeCell || activeCell.cellIdx !== cellIdx) return;
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (activeCell.isGood) {
      setScore(s => s + 1);
      setActiveCell(null);
      setTimeout(spawnMole, 200);
    } else {
      // Clicked a bomb!
      setIsPlaying(false);
      setError(true);
      setActiveCell(null);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Tap the Apples (🍎) quickly! Avoid the Bombs (💣)!
        </p>
        {isPlaying && <h3 style={{ color: 'var(--accent-primary)' }}>Score: {score} / {targetScore}</h3>}
      </div>

      <div className={`card flex-col flex-center mb-lg ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', width: '100%', minHeight: '300px', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        {!isPlaying && !error && (
          <button className="btn btn-primary btn-lg" onClick={startGame}>START</button>
        )}

        {!isPlaying && error && (
          <div className="flex-col flex-center">
            <div style={{ fontSize: '4rem' }}>💥</div>
            <h2 style={{ color: 'var(--danger)' }}>BOOM!</h2>
            <button className="btn btn-secondary mt-md" onClick={startGame}>Try Again</button>
          </div>
        )}

        {isPlaying && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {Array.from({ length: 9 }).map((_, i) => {
              const mole = activeCell?.cellIdx === i ? activeCell : null;
              
              return (
                <button
                  key={i}
                  onClick={() => handleTap(i)}
                  style={{
                    width: '80px', height: '80px',
                    background: 'var(--bg-body)',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: mole ? 'pointer' : 'default',
                    transform: mole ? 'scale(1)' : 'scale(0.8)',
                    opacity: mole ? 1 : 0.5,
                    transition: 'all 0.1s ease'
                  }}
                >
                  {mole?.isGood ? '🍎' : mole?.isGood === false ? '💣' : ''}
                </button>
              );
            })}
          </div>
        )}

      </div>
      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
