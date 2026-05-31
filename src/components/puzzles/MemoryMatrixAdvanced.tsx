'use client';
import React, { useState, useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

export default function MemoryMatrixAdvanced({ onComplete }: Props) {
  const size = 6;
  const targetCount = 12;
  
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [phase, setPhase] = useState<'start' | 'memorize' | 'play' | 'error'>('start');
  
  const { seconds, start, reset } = useCountdown(4, () => setPhase('play'));

  const startGame = () => {
    const indices = Array.from({ length: size * size }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    setActiveTiles(shuffled.slice(0, targetCount));
    setSelected([]);
    setPhase('memorize');
    reset(4);
    start();
  };

  useEffect(() => {
    if (phase === 'play' && selected.length === targetCount) {
      setTimeout(onComplete, 500);
    }
  }, [selected, phase, targetCount, onComplete]);

  const handleTap = (idx: number) => {
    if (phase !== 'play') return;
    if (selected.includes(idx)) return;

    if (activeTiles.includes(idx)) {
      setSelected(prev => [...prev, idx]);
    } else {
      setPhase('error');
      setTimeout(() => setPhase('start'), 1500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Advanced Memory Matrix! Memorize the <b>{targetCount}</b> highlighted tiles in a 6x6 grid.
        </p>
      </div>

      <div className={`card flex-col flex-center mb-lg ${phase === 'error' ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', width: '100%', minHeight: '450px', borderColor: phase === 'error' ? 'var(--danger)' : 'var(--border)' }}>
        
        {phase === 'start' && (
          <button className="btn btn-primary btn-lg" onClick={startGame}>Start Sequence</button>
        )}

        {phase === 'error' && (
          <div className="flex-col flex-center mb-md">
            <h2 style={{ color: 'var(--danger)' }}>Wrong Tile!</h2>
          </div>
        )}

        {phase !== 'start' && (
          <>
            <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {phase === 'memorize' && <span style={{ color: 'var(--warning)' }}>Memorize! ({seconds}s)</span>}
              {phase === 'play' && <span style={{ color: 'var(--accent-primary)' }}>Found: {selected.length} / {targetCount}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '4px' }}>
              {Array.from({ length: size * size }).map((_, i) => {
                const isActive = phase === 'memorize' && activeTiles.includes(i);
                const isFound = phase === 'play' && selected.includes(i);
                
                return (
                  <button
                    key={i}
                    onClick={() => handleTap(i)}
                    style={{
                      width: '45px', height: '45px',
                      background: isActive || isFound ? 'var(--accent-primary)' : 'var(--bg-body)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      cursor: phase === 'play' && !isFound ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive || isFound ? '0 0 10px rgba(124,58,237,0.5)' : 'none'
                    }}
                  />
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
