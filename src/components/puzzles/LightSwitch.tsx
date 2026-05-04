'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Each switch toggles specific lights. Goal: all lights ON
const toggleMap = [[0, 1], [1, 2], [0, 2, 3], [2, 3]];
const solution = [true, true, true, true];

export default function LightSwitch({ onComplete }: Props) {
  const [lights, setLights] = useState([false, false, false, false]);

  const toggle = (switchIdx: number) => {
    setLights(prev => {
      const next = [...prev];
      toggleMap[switchIdx].forEach(i => { next[i] = !next[i]; });
      if (next.every(Boolean)) setTimeout(onComplete, 500);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Turn ALL lights ON</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
        {lights.map((on, i) => (
          <div key={i} style={{
            width: '50px', height: '50px', borderRadius: '50%',
            background: on ? '#f59e0b' : 'var(--bg-tertiary)',
            boxShadow: on ? '0 0 20px rgba(245,158,11,0.6)' : 'none',
            border: '2px solid var(--border)',
            transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
          }}>
            {on ? '💡' : '⚫'}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {toggleMap.map((targets, i) => (
          <button key={i} className="btn btn-secondary" onClick={() => toggle(i)}>
            Switch {i + 1}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
              Toggles: {targets.map(t => t + 1).join(', ')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
