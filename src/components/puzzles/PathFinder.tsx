'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const grid = [
  [1,3,1,2,5],
  [2,1,4,1,2],
  [5,2,1,3,1],
  [1,4,2,1,3],
  [3,1,1,2,1],
];

export default function PathFinder({ onComplete }: Props) {
  const [path, setPath] = useState<[number,number][]>([[0,0]]);
  const [totalCost, setTotalCost] = useState(grid[0][0]);
  const end: [number,number] = [4,4];

  const isAdjacent = (r: number, c: number) => {
    const last = path[path.length - 1];
    return Math.abs(r - last[0]) + Math.abs(c - last[1]) === 1;
  };

  const handleClick = (r: number, c: number) => {
    if (!isAdjacent(r, c) || path.some(([pr,pc]) => pr === r && pc === c)) return;
    const newPath = [...path, [r,c] as [number,number]];
    const newCost = totalCost + grid[r][c];
    setPath(newPath);
    setTotalCost(newCost);
    if (r === end[0] && c === end[1]) setTimeout(onComplete, 500);
  };

  const isOnPath = (r: number, c: number) => path.some(([pr,pc]) => pr === r && pc === c);

  return (
    <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
        Cost: {totalCost} · Navigate 🟢→🔴
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        {grid.map((row, r) => row.map((cost, c) => {
          const isStart = r === 0 && c === 0;
          const isEnd = r === end[0] && c === end[1];
          const onPath = isOnPath(r, c);
          return (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
              style={{
                width: '52px', height: '52px', borderRadius: '8px',
                background: isStart ? 'var(--success)' : isEnd ? 'var(--danger)' : onPath ? 'rgba(124,58,237,0.3)' : 'var(--bg-tertiary)',
                border: isAdjacent(r, c) && !onPath ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem',
                cursor: isAdjacent(r, c) ? 'pointer' : 'default',
              }}>
              {cost}
            </button>
          );
        }))}
      </div>
    </div>
  );
}
