'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

const PADS = [
  { id: 0, color: '#EF4444' }, // Red
  { id: 1, color: '#3B82F6' }, // Blue
  { id: 2, color: '#10B981' }, // Green
  { id: 3, color: '#FACC15' }, // Yellow
];

export default function SimonSaysSpeed({ onComplete }: Props) {
  const sequenceLength = 6;
  const flashDuration = 250; // Very fast
  
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    const newSeq = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setPlayerInput([]);
    setError(false);
    setIsPlaying(true);
    playSequence(newSeq);
  };

  const playSequence = (seq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setActivePad(null);
        return;
      }
      
      setActivePad(seq[i]);
      
      timerRef.current = setTimeout(() => {
        setActivePad(null);
      }, flashDuration - 50);

      i++;
    }, flashDuration);
  };

  const handlePadClick = (id: number) => {
    if (!isPlaying || activePad !== null) return; // Wait for sequence to finish

    // Visual feedback
    setActivePad(id);
    setTimeout(() => setActivePad(null), 100);

    const nextInput = [...playerInput, id];
    setPlayerInput(nextInput);

    // Validate
    const isCorrect = nextInput.every((val, idx) => val === sequence[idx]);
    
    if (!isCorrect) {
      setError(true);
      setIsPlaying(false);
      setTimeout(() => setError(false), 1000);
    } else if (nextInput.length === sequence.length) {
      setIsPlaying(false);
      setTimeout(onComplete, 500);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          High-Speed Memory! Memorize the fast sequence and repeat it.
        </p>
      </div>

      <div className={`card flex-col flex-center mb-lg ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', width: '100%', minHeight: '300px', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        {!isPlaying && !error && sequence.length === 0 && (
          <button className="btn btn-primary btn-lg mb-md" onClick={startGame}>START</button>
        )}

        {!isPlaying && error && (
          <div className="flex-col flex-center mb-md">
            <h2 style={{ color: 'var(--danger)' }}>Wrong! Too fast?</h2>
            <button className="btn btn-secondary mt-md" onClick={startGame}>Try Again</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', opacity: (isPlaying || error) ? 1 : 0.3, pointerEvents: isPlaying ? 'auto' : 'none' }}>
          {PADS.map(pad => (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              style={{
                width: '100px', height: '100px', borderRadius: '16px',
                background: pad.color,
                border: 'none', cursor: 'pointer',
                opacity: activePad === pad.id ? 1 : 0.3,
                transform: activePad === pad.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: activePad === pad.id ? `0 0 30px ${pad.color}` : 'none',
                transition: 'all 0.1s ease'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
