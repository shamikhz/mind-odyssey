'use client';
import React from 'react';

interface Props { onComplete: () => void; }

export default function DistractionResistance({ onComplete }: Props) {
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</div>
      <h3 style={{ color: 'var(--text-primary)' }}>Level Under Construction</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        This puzzle (Distraction Resistance) is being actively developed in Phase 3.
      </p>
      <button className="btn btn-primary" onClick={() => onComplete()}>
        Skip / Auto-Complete
      </button>
    </div>
  );
}
