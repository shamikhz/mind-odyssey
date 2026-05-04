'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

function createPuzzle(): number[] {
  const arr = Array.from({length: 15}, (_, i) => i + 1).concat([0]);
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  let inversions = 0;
  for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
  const emptyRow = Math.floor(arr.indexOf(0) / 4);
  if ((inversions + emptyRow) % 2 !== 0) { const a = arr[0] === 0 ? 1 : 0; const b = arr[1] === 0 ? 2 : 1; [arr[a], arr[b]] = [arr[b], arr[a]]; }
  return arr;
}

export default function SlidingPuzzle4({ onComplete }: Props) {
  const [tiles, setTiles] = useState(() => createPuzzle());
  const [moves, setMoves] = useState(0);

  const handleClick = (idx: number) => {
    const emptyIdx = tiles.indexOf(0);
    const r = Math.floor(idx / 4), c = idx % 4, er = Math.floor(emptyIdx / 4), ec = emptyIdx % 4;
    if (Math.abs(r - er) + Math.abs(c - ec) !== 1) return;
    const n = [...tiles]; [n[idx], n[emptyIdx]] = [n[emptyIdx], n[idx]];
    setTiles(n); setMoves(m => m + 1);
    if (n.every((t, i) => t === (i + 1) % 16)) setTimeout(onComplete, 500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '280px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Moves: {moves}</p>
      <div className="slider-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {tiles.map((tile, i) => (
          <button key={i} className={`slider-tile ${tile === 0 ? 'empty' : ''}`}
            onClick={() => tile !== 0 && handleClick(i)} style={{ height: '60px', fontSize: '1rem' }}>
            {tile || ''}
          </button>
        ))}
      </div>
    </div>
  );
}
