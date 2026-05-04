'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

const SIZE = 5;

export default function PatternRecall({ onComplete }: Props) {
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [playerGrid, setPlayerGrid] = useState<boolean[]>(Array(SIZE * SIZE).fill(false));
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const p = Array(SIZE * SIZE).fill(false);
    const count = 7 + Math.floor(Math.random() * 4);
    const indices = Array.from({ length: SIZE * SIZE }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [indices[i], indices[j]] = [indices[j], indices[i]]; }
    indices.slice(0, count).forEach(i => { p[i] = true; });
    setPattern(p);
    setTimeout(() => setPhase('recall'), 3000);
  }, []);

  const toggleCell = (i: number) => {
    if (phase !== 'recall') return;
    setPlayerGrid(g => { const n = [...g]; n[i] = !n[i]; return n; });
  };

  const check = () => {
    if (playerGrid.every((v, i) => v === pattern[i])) {
      setFeedback('correct');
      setTimeout(onComplete, 500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const displayGrid = phase === 'memorize' ? pattern : playerGrid;

  return (
    <div style={{ width: '100%', maxWidth: '280px', textAlign: 'center' }}>
      <p style={{ color: phase === 'memorize' ? 'var(--warning)' : 'var(--text-secondary)', fontWeight: 600, marginBottom: '16px' }}>
        {phase === 'memorize' ? '⏳ Memorize the pattern...' : '🎨 Recreate it!'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: '4px', marginBottom: '16px' }}>
        {displayGrid.map((filled, i) => (
          <button key={i} onClick={() => toggleCell(i)} className="grid-cell"
            style={{
              height: '44px', background: filled ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              cursor: phase === 'recall' ? 'pointer' : 'default', borderRadius: '4px',
            }} />
        ))}
      </div>
      {phase === 'recall' && (
        <button className="btn btn-primary w-full" onClick={check}
          style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
          {feedback === 'correct' ? '✅ Perfect!' : feedback === 'wrong' ? '❌ Try Again' : 'Check Pattern'}
        </button>
      )}
    </div>
  );
}
