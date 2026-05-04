'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

const GRID_SIZE = 4;
const ITEMS = ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧', '⬛', '⬜', '🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫', '⚪'];

export default function SpotChange({ onComplete }: Props) {
  const [grid] = useState(() => ITEMS.slice(0, GRID_SIZE * GRID_SIZE));
  const [changedIdx, setChangedIdx] = useState<number>(-1);
  const [phase, setPhase] = useState<'study' | 'changed'>('study');
  const [displayGrid, setDisplayGrid] = useState<string[]>(grid);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const idx = Math.floor(Math.random() * grid.length);
      setChangedIdx(idx);
      const remaining = ITEMS.filter(i => !grid.includes(i));
      const newItem = remaining[Math.floor(Math.random() * remaining.length)] || '❓';
      const newGrid = [...grid];
      newGrid[idx] = newItem;
      setDisplayGrid(newGrid);
      setPhase('changed');
    }, 4000);
    return () => clearTimeout(timer);
  }, [grid]);

  const handleClick = (idx: number) => {
    if (phase !== 'changed') return;
    if (idx === changedIdx) { setFeedback('correct'); setTimeout(onComplete, 500); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 600); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
      <p style={{ color: phase === 'study' ? 'var(--warning)' : 'var(--text-secondary)', fontWeight: 600, marginBottom: '16px' }}>
        {phase === 'study' ? '⏳ Study the grid...' : '👆 What changed?'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: '6px' }}>
        {displayGrid.map((item, i) => (
          <button key={i} onClick={() => handleClick(i)}
            style={{
              fontSize: '1.8rem', padding: '8px', background: 'var(--bg-tertiary)',
              borderRadius: '8px', border: feedback === 'correct' && i === changedIdx ? '2px solid var(--success)' : '1px solid var(--border)',
              cursor: phase === 'changed' ? 'pointer' : 'default',
              animation: feedback === 'wrong' ? 'shake 0.3s' : undefined,
            }}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
