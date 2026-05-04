'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function TowerOfHanoi5({ onComplete }: Props) {
  const [pegs, setPegs] = useState<number[][]>([[5, 4, 3, 2, 1], [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const handlePegClick = (pegIdx: number) => {
    if (selectedPeg === null) {
      if (pegs[pegIdx].length > 0) setSelectedPeg(pegIdx);
    } else {
      if (selectedPeg === pegIdx) { setSelectedPeg(null); return; }
      const from = pegs[selectedPeg];
      const to = pegs[pegIdx];
      const disk = from[from.length - 1];
      if (to.length > 0 && to[to.length - 1] < disk) { setSelectedPeg(null); return; }
      const newPegs = pegs.map(p => [...p]);
      newPegs[selectedPeg] = from.slice(0, -1);
      newPegs[pegIdx] = [...to, disk];
      setPegs(newPegs);
      setMoves(m => m + 1);
      setSelectedPeg(null);
      if (newPegs[2].length === 5) setTimeout(onComplete, 500);
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Moves: {moves} (Minimum: 31)</p>
      <div className="hanoi-container">
        {pegs.map((peg, pi) => (
          <div key={pi} className="hanoi-peg" onClick={() => handlePegClick(pi)}
            style={{ cursor: 'pointer', border: selectedPeg === pi ? '2px solid var(--accent-primary)' : '2px solid transparent', borderRadius: 'var(--radius-md)', padding: '8px', minHeight: '180px' }}>
            {peg.map((disk, di) => (
              <div key={di} className="hanoi-disk" style={{ width: `${disk * 20 + 15}px`, background: COLORS[disk - 1] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
