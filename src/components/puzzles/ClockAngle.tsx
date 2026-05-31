'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function ClockAngle({ onComplete }: Props) {
  const timeStr = "03:30";
  const answer = 75; // |(3*30 + 30*0.5) - (30*6)| = |105 - 180| = 75

  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // No more auto-checking useEffect. We will use an explicit ENTER button.

  const handleCheck = () => {
    if (input.length === 0) return;
    if (parseInt(input) === answer) {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => { setError(false); setInput(''); }, 800);
    }
  };

  const handleNumpad = (num: string) => {
    if (num === 'DEL') {
      setInput(prev => prev.slice(0, -1));
    } else if (num === 'ENTER') {
      handleCheck();
    } else {
      setInput(prev => (prev + num).slice(0, 3));
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Calculate the interior angle (in degrees) between the hour and minute hands at exactly <b>{timeStr}</b>.
        </p>
      </div>

      <div className={`card flex-col flex-center ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '32px', borderColor: error ? 'var(--danger)' : 'var(--border)', width: '100%' }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
          {timeStr}
        </div>
        <div style={{ marginTop: '24px', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '100px', height: '60px', background: 'var(--bg-body)', border: '2px solid var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {input}
          </div>
          <span style={{ color: 'var(--text-secondary)' }}>°</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '24px', width: '250px' }}>
        {[1,2,3,4,5,6,7,8,9,'DEL',0,'ENTER'].map(btn => (
          <button 
            key={btn}
            onClick={() => handleNumpad(btn.toString())}
            className={`btn ${btn === 'DEL' ? 'btn-danger' : btn === 'ENTER' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '16px', fontSize: btn === 'ENTER' ? '1rem' : '1.2rem', fontWeight: btn === 'ENTER' ? 'bold' : 'normal' }}
          >
            {btn === 'ENTER' ? '✓' : btn}
          </button>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
