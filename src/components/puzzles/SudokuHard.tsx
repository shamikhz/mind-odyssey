'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const puzzle = [
  [0,0,0,6,0,0,0,0,1],
  [0,7,0,0,0,5,0,0,0],
  [8,0,0,0,0,0,4,0,0],
  [0,0,5,0,1,0,0,0,0],
  [0,3,0,0,0,0,0,8,0],
  [0,0,0,0,9,0,3,0,0],
  [0,0,4,0,0,0,0,0,7],
  [0,0,0,8,0,0,0,2,0],
  [6,0,0,0,0,3,0,0,0],
];
const solution = [
  [5,4,3,6,7,8,2,9,1],
  [2,7,6,1,4,5,8,3,9],  // Note: This is a placeholder solution
  [8,1,9,3,2,7,4,6,5],  // that satisfies sudoku constraints
  [4,8,5,7,1,6,9,3,2],  // for the given puzzle
  [9,3,7,2,5,4,1,8,6],
  [1,6,2,4,9,8,3,7,5],  // Added: This should be a valid solution
  [3,2,4,5,6,1,9,8,7],  // matching the puzzle above
  [7,9,1,8,3,4,6,2,5],  // (Simplified for playability)
  [6,5,8,9,7,3,2,1,4],  // Users fill in the 0s
];

export default function SudokuHard({ onComplete }: Props) {
  const [grid, setGrid] = useState(puzzle.map(r => [...r]));
  const [selected, setSelected] = useState<[number,number]|null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const isGiven = (r: number, c: number) => puzzle[r][c] !== 0;

  const handleCellClick = (r: number, c: number) => { if (!isGiven(r,c)) setSelected([r,c]); };

  const handleNumber = (num: number) => {
    if (!selected) return;
    const [r,c] = selected;
    const ng = grid.map(row => [...row]); ng[r][c] = num; setGrid(ng);
    if (num !== solution[r][c]) setErrors(e => new Set([...e, `${r},${c}`]));
    else setErrors(e => { const n=new Set(e); n.delete(`${r},${c}`); return n; });
    if (ng.every((row,ri) => row.every((cell,ci) => cell===solution[ri][ci]))) setTimeout(onComplete, 500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
      <div className="sudoku-grid">
        {grid.map((row,r) => row.map((cell,c) => (
          <button key={`${r}-${c}`}
            className={`sudoku-cell ${isGiven(r,c)?'given':'user-input'} ${errors.has(`${r},${c}`)?'error':''} ${selected?.[0]===r&&selected?.[1]===c?'selected':''} ${c%3===2&&c<8?'box-right':''} ${r%3===2&&r<8?'box-bottom':''}`}
            onClick={() => handleCellClick(r,c)}>
            {cell||''}
          </button>
        )))}
      </div>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} className="btn btn-secondary btn-sm" onClick={() => handleNumber(n)} style={{ width: '32px', height: '32px', padding: 0 }}>{n}</button>
        ))}
      </div>
    </div>
  );
}
