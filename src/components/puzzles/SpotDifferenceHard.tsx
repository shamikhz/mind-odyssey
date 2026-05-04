'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const base = ['🌲','🏡','☁️','🌻','🦅','🌈','💧','⛰️','🌸','🐝','🌊','🍄','🦌','🌙','🍀','⭐'];
const diff = ['🌲','🏡','🌤️','🌻','🦜','🌈','💧','🏔️','🌸','🐝','🌊','🍄','🦊','🌙','🍂','⭐'];
const diffIndices = [2,4,7,12,14]; // 5 of 7 needed - let's use all 5 plus 2 more
const allDiffs = [2,4,7,12,14];

export default function SpotDifferenceHard({ onComplete }: Props) {
  const [found, setFound] = useState<number[]>([]);
  const target = allDiffs.length;

  const handleClick = (idx: number) => {
    if (allDiffs.includes(idx) && !found.includes(idx)) {
      const nf = [...found, idx];
      setFound(nf);
      if (nf.length >= target) setTimeout(onComplete, 500);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Found: {found.length}/{target}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[{ grid: base, label: 'Original' }, { grid: diff, label: 'Changed' }].map(({ grid, label }, gi) => (
          <div key={gi}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
              {grid.map((item, i) => (
                <button key={i} onClick={() => gi === 1 && handleClick(i)}
                  style={{
                    fontSize: '1.4rem', width: '42px', height: '42px',
                    background: found.includes(i) ? 'rgba(16,185,129,0.2)' : 'var(--bg-tertiary)',
                    border: found.includes(i) ? '2px solid var(--success)' : '1px solid var(--border)',
                    borderRadius: '6px', cursor: gi === 1 ? 'pointer' : 'default',
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
