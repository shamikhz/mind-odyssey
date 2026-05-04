'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Two grids with 3 differences
const baseGrid = ['🌳','🏠','☀️','🌷','🐦','🌈','💧','⛰️','🌸'];
const diffGrid = ['🌳','🏠','🌙','🌷','🦋','🌈','💧','⛰️','🌺'];
// Differences at index 2 (☀️→🌙), 4 (🐦→🦋), 8 (🌸→🌺)
const diffIndices = [2, 4, 8];

export default function SpotDifference({ onComplete }: Props) {
  const [found, setFound] = useState<number[]>([]);

  const handleClick = (idx: number) => {
    if (diffIndices.includes(idx) && !found.includes(idx)) {
      const nf = [...found, idx];
      setFound(nf);
      if (nf.length === 3) setTimeout(onComplete, 500);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Found: {found.length}/3 differences</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[{ grid: baseGrid, label: 'Original' }, { grid: diffGrid, label: 'Changed' }].map(({ grid, label }, gi) => (
          <div key={gi}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {grid.map((item, i) => (
                <button key={i} onClick={() => gi === 1 && handleClick(i)}
                  style={{
                    fontSize: '1.8rem', width: '52px', height: '52px',
                    background: found.includes(i) ? 'rgba(16,185,129,0.2)' : 'var(--bg-tertiary)',
                    border: found.includes(i) ? '2px solid var(--success)' : '1px solid var(--border)',
                    borderRadius: '8px', cursor: gi === 1 ? 'pointer' : 'default',
                  }}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
