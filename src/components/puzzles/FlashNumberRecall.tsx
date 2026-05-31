'use client';
import React, { useState, useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

export default function FlashNumberRecall({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'flash' | 'input'>('start');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [error, setError] = useState(false);
  
  const digitCount = 5 + difficulty; // 6 digits for diff 1
  
  // Timer for the flash phase
  const { seconds, start: startTimer, reset: resetTimer } = useCountdown(3, () => {
    setPhase('input');
  });

  const startGame = () => {
    const newSeq = Array.from({ length: digitCount }, () => Math.floor(Math.random() * 10));
    setSequence(newSeq);
    setUserInput([]);
    setPhase('flash');
    resetTimer(3);
    startTimer();
  };

  const handleInput = (val: number | string) => {
    if (phase !== 'input') return;
    
    if (val === 'DEL') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (val === 'ENTER') {
      if (userInput.length === 0) return;
      const isCorrect = userInput.length === sequence.length && userInput.every((v, i) => v === sequence[i]);
      if (isCorrect) {
        onComplete();
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setUserInput([]); 
        }, 500);
      }
    } else {
      if (userInput.length < sequence.length) {
        setUserInput(prev => [...prev, val as number]);
      }
    }
  };

  if (phase === 'start') {
    return (
      <div className="flex-col flex-center" style={{ padding: '40px' }}>
        <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
          You will see {digitCount} numbers for 3 seconds. Memorize them in order!
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start Memorizing</button>
      </div>
    );
  }

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      
      {/* Display Area */}
      <div 
        className={`card flex-center w-full mb-lg ${error ? 'error-shake' : ''}`}
        style={{ 
          height: '100px', 
          background: error ? 'rgba(239,68,68,0.1)' : 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {phase === 'flash' ? (
          <div style={{ fontSize: '2.5rem', letterSpacing: '8px', fontWeight: 'bold' }}>
            {sequence.join('')}
          </div>
        ) : (
          <div style={{ fontSize: '2.5rem', letterSpacing: '8px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {userInput.length === 0 ? '?' : userInput.join('')}
            <span className="blink" style={{ opacity: 0.5 }}>_</span>
          </div>
        )}
      </div>

      {/* Countdown / Instructions */}
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'flash' ? (
          <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Memorize! Hiding in {seconds}s...</p>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Enter the sequence</p>
        )}
      </div>

      {/* Numpad */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px',
        width: '100%',
        opacity: phase === 'input' ? 1 : 0.5,
        pointerEvents: phase === 'input' ? 'auto' : 'none'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'ENTER'].map((btn) => (
          <button
            key={btn}
            onClick={() => handleInput(btn)}
            className={`btn ${btn === 'DEL' ? 'btn-danger' : btn === 'ENTER' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              fontSize: btn === 'ENTER' ? '1.2rem' : '1.5rem', 
              padding: '20px 0',
              fontWeight: btn === 'ENTER' ? 'bold' : 'normal'
            }}
          >
            {btn === 'ENTER' ? '✓' : btn}
          </button>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
