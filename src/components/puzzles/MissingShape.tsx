'use client';
import React, { useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

const ALL_SHAPES = ['⭐', '🟢', '🟥', '🔺', '🔷', '🌙', '☀️', '☁️', '⚡', '⛄', '☂️', '🎈', '🎲', '🎵'];

export default function MissingShape({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'memorize' | 'hide' | 'guess'>('start');
  const [shapes, setShapes] = useState<string[]>([]);
  const [missingShape, setMissingShape] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const shapeCount = 5 + difficulty; // 6 shapes for diff 1

  const { seconds, start: startTimer, reset: resetTimer } = useCountdown(3, () => {
    setPhase('hide');
    setTimeout(() => setPhase('guess'), 500);
  });

  const startGame = () => {
    // Pick random unique shapes
    const shuffled = [...ALL_SHAPES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, shapeCount);
    
    // Pick which one will go missing
    const missing = selected[Math.floor(Math.random() * selected.length)];
    
    // Generate options (the missing one + 3 random ones not in the selected set)
    const unused = shuffled.slice(shapeCount);
    const fakeOptions = unused.slice(0, 3);
    const allOptions = [missing, ...fakeOptions].sort(() => Math.random() - 0.5);

    setShapes(selected);
    setMissingShape(missing);
    setOptions(allOptions);
    
    setPhase('memorize');
    resetTimer(3);
    startTimer();
  };

  const handleGuess = (guess: string) => {
    if (phase !== 'guess') return;

    if (guess === missingShape) {
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
          Memorize the shapes. One will disappear. Identify the missing shape!
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start</button>
      </div>
    );
  }

  // The shapes shown during guess phase (all except the missing one)
  const displayedShapes = phase === 'memorize' ? shapes : shapes.filter(s => s !== missingShape);

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'memorize' && <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Memorize! ({seconds}s)</p>}
        {phase === 'hide' && <p style={{ color: 'var(--bg-body)' }}>...</p>}
        {phase === 'guess' && <p style={{ color: 'var(--text-secondary)' }}>Which shape is missing?</p>}
      </div>

      {/* Grid of Shapes */}
      <div 
        className={`card ${error ? 'error-shake' : ''}`}
        style={{ 
          width: '100%', 
          minHeight: '200px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {phase !== 'hide' && displayedShapes.map((shape, i) => (
          <div key={i} style={{ fontSize: '3rem', width: '60px', textAlign: 'center' }}>
            {shape}
          </div>
        ))}
        {/* Fill the empty slot space to prevent layout shift if desired, but flex wrap handles it nicely */}
      </div>

      {/* Guess Options */}
      {phase === 'guess' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '24px', width: '100%' }}>
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleGuess(opt)}
              className="btn btn-secondary"
              style={{ fontSize: '2rem', padding: '12px 0' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
