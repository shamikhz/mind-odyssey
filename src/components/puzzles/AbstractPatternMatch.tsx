'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function AbstractPatternMatch({ onComplete }: Props) {
  const answer = '⬛';
  const options = ['⬛', '⬜', '🔲', '🔳'];

  const [errorId, setErrorId] = useState<string | null>(null);

  const handleGuess = (val: string) => {
    if (val === answer) {
      setTimeout(onComplete, 500);
    } else {
      setErrorId(val);
      setTimeout(() => setErrorId(null), 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Identify the rule and select the next shape in the sequence.
        </p>
      </div>

      <div className="card flex-col flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '40px', width: '100%' }}>
        <div style={{ fontSize: '3rem', display: 'flex', gap: '16px' }}>
          <span>⬛</span>
          <span>⬜</span>
          <span>⬛</span>
          <span>⬜</span>
          <span style={{ color: 'var(--accent-primary)' }}>?</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleGuess(opt)}
            className={`btn flex-center ${errorId === opt ? 'error-shake' : ''}`}
            style={{
              padding: '16px', fontSize: '2rem',
              background: errorId === opt ? 'var(--danger)' : 'var(--bg-card)',
              color: 'white',
              border: '2px solid var(--border)'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
