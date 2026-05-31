'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function Hidden3DShape({ onComplete }: Props) {
  const answer = 'Cube';
  const options = ['Cube', 'Pyramid', 'Sphere', 'Cylinder'];
  
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
          What 3D shape does this 2D net fold into?
        </p>
      </div>

      <div className="card flex-col flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '40px', width: '100%' }}>
        
        {/* Cube Net using Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 30px)', gridTemplateRows: 'repeat(3, 30px)', gap: '2px' }}>
          <div /> <div style={{ background: 'var(--accent-primary)' }}/> <div /> <div />
          <div style={{ background: 'var(--accent-primary)' }}/> <div style={{ background: 'var(--accent-primary)' }}/> <div style={{ background: 'var(--accent-primary)' }}/> <div style={{ background: 'var(--accent-primary)' }}/>
          <div /> <div style={{ background: 'var(--accent-primary)' }}/> <div /> <div />
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleGuess(opt)}
            className={`btn ${errorId === opt ? 'error-shake' : ''}`}
            style={{
              padding: '16px', fontSize: '1.2rem',
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
