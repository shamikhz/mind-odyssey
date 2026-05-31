'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function PerspectiveShift({ onComplete }: Props) {
  const answer = 'L-Shape';
  const options = [
    { id: 'Square', icon: '🔲' },
    { id: 'L-Shape', icon: '▛' },
    { id: 'Line', icon: '▬' },
    { id: 'T-Shape', icon: '┳' }
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
          A 3D structure is built with 4 blocks: 3 blocks in a line on the ground, and 1 block stacked on the left-most block. <br/><br/>
          What does the structure look like from directly <b>above</b> (Top-Down view)?
        </p>
      </div>

      <div className="card flex-col flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '40px', width: '100%' }}>
        
        {/* Simple 3D abstraction using emojis */}
        <div style={{ fontSize: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 0.8 }}>
          <span style={{ marginLeft: '12px' }}>📦</span>
          <span>📦📦📦</span>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '32px' }}>(Front View)</p>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleGuess(opt.id)}
            className={`btn flex-col flex-center ${errorId === opt.id ? 'error-shake' : ''}`}
            style={{
              padding: '16px', fontSize: '1.2rem', gap: '8px',
              background: errorId === opt.id ? 'var(--danger)' : 'var(--bg-card)',
              color: 'white',
              border: '2px solid var(--border)'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{opt.icon}</span>
            <span>{opt.id}</span>
          </button>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
