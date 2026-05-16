'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

export default function ColorMixing({ onComplete }: Props) {
  const [r, setR] = useState(128);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);
  const target = { r: 148, g: 103, b: 189 }; // Purple

  const distance = Math.sqrt((r - target.r) ** 2 + (g - target.g) ** 2 + (b - target.b) ** 2);
  const match = distance < 30;

  const handleCheck = () => {
    if (match) setTimeout(onComplete, 400);
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Mix colors to match the target!</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Target</p>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `rgb(${target.r},${target.g},${target.b})`, border: '3px solid var(--border)' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Your Mix</p>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `rgb(${r},${g},${b})`, border: match ? '3px solid var(--success)' : '3px solid var(--border)', transition: 'all 0.3s' }} />
        </div>
      </div>
      {[{ label: '🔴 Red', value: r, set: setR }, { label: '🟢 Green', value: g, set: setG }, { label: '🔵 Blue', value: b, set: setB }].map(({ label, value, set }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', width: '70px', textAlign: 'left' }}>{label}</span>
          <input type="range" min="0" max="255" value={value} onChange={e => set(Number((e.target as any).value))}
            style={{ flex: 1, accentColor: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.8rem', width: '30px' }}>{value}</span>
        </div>
      ))}
      <button className="btn btn-primary w-full mt-sm" onClick={handleCheck} disabled={!match}>
        {match ? '✅ Perfect Match!' : `Closeness: ${Math.max(0, Math.round(100 - distance))}%`}
      </button>
    </div>
  );
}
