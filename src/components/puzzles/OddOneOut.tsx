'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const items = [
  { id: 1, shape: '⬟', label: 'Pentagon' },
  { id: 2, shape: '⬡', label: 'Hexagon' },
  { id: 3, shape: '●', label: 'Circle' },
  { id: 4, shape: '⬠', label: 'Pentagon' },
];

export default function OddOneOut({ onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);

  const handleSelect = (id: number) => {
    setSelected(id);
    if (id === 3) {
      setTimeout(onComplete, 600);
    } else {
      setWrong(true);
      setTimeout(() => { setWrong(false); setSelected(null); }, 800);
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Which one doesn&apos;t belong?</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '300px', margin: '0 auto' }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`card ${selected === item.id ? (item.id === 3 ? 'correct-pick' : '') : ''}`}
            style={{
              fontSize: '2.5rem', padding: '24px', cursor: 'pointer',
              background: selected === item.id
                ? item.id === 3 ? 'rgba(16,185,129,0.2)' : wrong ? 'rgba(239,68,68,0.2)' : 'var(--bg-card)'
                : 'var(--bg-card)',
              border: selected === item.id
                ? item.id === 3 ? '2px solid var(--success)' : '2px solid var(--danger)'
                : '1px solid var(--border)',
              animation: selected === item.id && item.id !== 3 && wrong ? 'shake 0.3s ease' : undefined,
            }}
          >
            {item.shape}
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
