'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

function createPuzzle(): number[] {
  const arr = [1,2,3,4,5,6,7,8,0];
  // Shuffle with solvability check
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure solvable (even inversions)
  let inversions = 0;
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
  if (inversions % 2 !== 0) [arr[0], arr[1]] = [arr[1], arr[0]];
  return arr;
}

export default function SlidingPuzzle({ onComplete }: Props) {
  const [tiles, setTiles] = useState(() => createPuzzle());
  const [moves, setMoves] = useState(0);
  const size = 3;

  const handleClick = (idx: number) => {
    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(idx / size), col = idx % size;
    const emptyRow = Math.floor(emptyIdx / size), emptyCol = emptyIdx % size;
    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) !== 1) return;

    const newTiles = [...tiles];
    [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
    setTiles(newTiles);
    setMoves(m => m + 1);

    const solved = newTiles.every((t, i) => t === (i + 1) % 9);
    if (solved) setTimeout(onComplete, 500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '260px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Moves: {moves}</p>
      <div className="slider-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {tiles.map((tile, i) => (
          <button key={i} className={`slider-tile ${tile === 0 ? 'empty' : ''}`}
            onClick={() => tile !== 0 && handleClick(i)}
            style={{ height: '70px' }}>
            {tile || ''}
          </button>
        ))}
      </div>
    </div>
  );
}
