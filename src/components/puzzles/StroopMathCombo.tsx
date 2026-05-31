'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function StroopMathCombo({ onComplete }: Props) {
  // Word says "RED". Printed in BLUE.
  // Equation: 12 - 4 = 8.
  // Target button: The one that is BLUE and contains the number 8.

  const [error, setError] = useState(false);

  const options = [
    { color: '#EF4444', text: '12' }, // Red 12
    { color: '#3B82F6', text: '8' },  // Blue 8 (CORRECT)
    { color: '#10B981', text: '8' },  // Green 8
    { color: '#EF4444', text: '8' },  // Red 8
  ].sort(() => Math.random() - 0.5);

  const handleGuess = (color: string, text: string) => {
    if (color === '#3B82F6' && text === '8') {
      setTimeout(onComplete, 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Brain Overload! Select the button that matches the <b>Ink Color</b> of the word, AND contains the <b>answer</b> to the equation!
        </p>
      </div>

      <div className={`card flex-col flex-center mb-lg ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '40px', width: '100%', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          
          <div style={{ fontSize: '4rem', fontWeight: '900', color: '#3B82F6', textShadow: '2px 2px 0 #000' }}>
            RED
          </div>

          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            12 - 4 = ?
          </div>

        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleGuess(opt.color, opt.text)}
            className="btn"
            style={{
              padding: '16px', fontSize: '2rem', fontWeight: 'bold',
              background: opt.color,
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
