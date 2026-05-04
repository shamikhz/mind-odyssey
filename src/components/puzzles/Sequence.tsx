'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

export default function Sequence({ onComplete }: Props) {
  const sequence = [2, 5, 8, 11, 14];
  const options = [16, 17, 15, 19];
  const answer = 17;
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);

  const handleSelect = (val: number) => {
    setSelected(val);
    if (val === answer) {
      setTimeout(onComplete, 600);
    } else {
      setWrong(true);
      setTimeout(() => { setWrong(false); setSelected(null); }, 800);
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>What comes next?</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        {sequence.map((n, i) => (
          <div key={i} style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.1rem',
          }}>{n}</div>
        ))}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '2px dashed var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-primary)',
        }}>?</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '250px', margin: '0 auto' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => handleSelect(opt)} className="btn btn-secondary" style={{
            background: selected === opt
              ? opt === answer ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'
              : undefined,
            animation: selected === opt && opt !== answer && wrong ? 'shake 0.3s' : undefined,
          }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
