'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function SequenceAdvanced({ onComplete }: Props) {
  // Sequence: 2, 6, 12, 20, 30, ?
  // n^2 + n -> 1^2+1=2, 2^2+2=6, 3^2+3=12, 4^2+4=20, 5^2+5=30, 6^2+6=42
  const sequence = [2, 6, 12, 20, 30];
  const answer = 42;
  const options = [36, 40, 42, 48].sort(() => Math.random() - 0.5);

  const [errorId, setErrorId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGuess = (val: number) => {
    if (success) return;
    
    if (val === answer) {
      setSuccess(true);
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
          Analyze the pattern and find the next number in the sequence.
        </p>
      </div>

      <div className="card flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '24px', width: '100%' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {sequence.map((n, i) => (
            <div key={i} style={{ fontSize: '2rem', fontWeight: 'bold' }}>{n},</div>
          ))}
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: success ? 'var(--success)' : 'var(--accent-primary)' }}>
            {success ? answer : '?'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleGuess(opt)}
            className={`btn ${errorId === opt ? 'error-shake' : ''}`}
            style={{
              padding: '16px', fontSize: '1.5rem',
              background: success && opt === answer ? 'var(--success)' : errorId === opt ? 'var(--danger)' : 'var(--bg-card)',
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
