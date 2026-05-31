'use client';
import React, { useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

export default function PatternFlashRecall({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'flash' | 'input'>('start');
  const [targetPattern, setTargetPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [error, setError] = useState(false);
  
  const gridSize = 25; // 5x5 grid
  const patternCount = 6 + difficulty * 2; 

  const { seconds, start: startTimer, reset: resetTimer } = useCountdown(4, () => {
    setPhase('input');
  });

  const startGame = () => {
    // Generate random pattern
    const cells = Array.from({ length: gridSize }, (_, i) => i);
    const shuffled = cells.sort(() => Math.random() - 0.5);
    setTargetPattern(shuffled.slice(0, patternCount));
    setUserPattern([]);
    
    setPhase('flash');
    resetTimer(4);
    startTimer();
  };

  const toggleCell = (cellIdx: number) => {
    if (phase !== 'input') return;
    
    if (userPattern.includes(cellIdx)) {
      setUserPattern(prev => prev.filter(c => c !== cellIdx));
    } else {
      setUserPattern(prev => [...prev, cellIdx]);
    }
  };

  const handleSubmit = () => {
    if (userPattern.length !== targetPattern.length) {
      triggerError();
      return;
    }

    // Check if every target cell is in the user's pattern
    const isCorrect = targetPattern.every(c => userPattern.includes(c));
    
    if (isCorrect) {
      onComplete();
    } else {
      triggerError();
    }
  };

  const triggerError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
      setUserPattern([]); // Reset on failure
    }, 500);
  };

  if (phase === 'start') {
    return (
      <div className="flex-col flex-center" style={{ padding: '40px' }}>
        <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
          A pattern will flash for 4 seconds. Memorize the lit squares, then recreate it!
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start Pattern</button>
      </div>
    );
  }

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'flash' ? (
          <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Memorize! ({seconds}s)</p>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>
            Recreate the pattern ({userPattern.length} / {targetPattern.length})
          </p>
        )}
      </div>

      <div 
        className={`card ${error ? 'error-shake' : ''}`}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '4px',
          width: '280px',
          height: '280px',
          padding: '8px',
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {Array.from({ length: gridSize }).map((_, i) => {
          const isTarget = phase === 'flash' && targetPattern.includes(i);
          const isSelected = phase === 'input' && userPattern.includes(i);
          
          let bg = 'var(--bg-body)';
          if (isTarget) bg = 'var(--accent-primary)';
          if (isSelected) bg = 'rgba(124,58,237,0.8)';

          return (
            <button
              key={i}
              onClick={() => toggleCell(i)}
              disabled={phase !== 'input'}
              style={{
                borderRadius: '4px',
                background: bg,
                border: '1px solid var(--border)',
                cursor: phase === 'input' ? 'pointer' : 'default',
                transition: 'background 0.1s ease',
              }}
            />
          );
        })}
      </div>

      {phase === 'input' && (
        <button 
          className="btn btn-primary mt-md" 
          onClick={handleSubmit}
          disabled={userPattern.length === 0}
        >
          Submit Pattern
        </button>
      )}

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
