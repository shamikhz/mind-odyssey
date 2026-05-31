'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function OrigamiFold({ onComplete }: Props) {
  const answer = '4 holes (Square)';
  const options = [
    '1 hole (Center)',
    '2 holes (Middle)',
    '4 holes (Square)',
    '4 holes (Diamond)'
  ];

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
          A square piece of paper is folded in half horizontally, then folded in half vertically. <br/>
          A single hole is punched directly in the center of the folded square. <br/><br/>
          When completely unfolded, what does the paper look like?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%', marginTop: '24px' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleGuess(opt)}
            className={`btn ${errorId === opt ? 'error-shake' : ''}`}
            style={{
              padding: '20px', fontSize: '1.2rem',
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
