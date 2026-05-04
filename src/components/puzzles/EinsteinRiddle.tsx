'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Simplified Einstein's Riddle: 3 houses
const clues = [
  "The Norwegian lives in the first house.",
  "The person in the red house owns a cat.",
  "The British person lives in the green house.",
  "The green house is the third house.",
  "The Norwegian owns a dog.",
];
// Solution: House1=Norwegian/Blue/Dog, House2=?/Red/Cat, House3=British/Green/Fish
const solution = {
  h1: { nation: 'Norwegian', color: 'Blue', pet: 'Dog' },
  h2: { nation: 'Swedish', color: 'Red', pet: 'Cat' },
  h3: { nation: 'British', color: 'Green', pet: 'Fish' },
};

export default function EinsteinRiddle({ onComplete }: Props) {
  const [grid, setGrid] = useState({
    h1: { nation: '', color: '', pet: '' },
    h2: { nation: '', color: '', pet: '' },
    h3: { nation: '', color: '', pet: '' },
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const nations = ['Norwegian', 'British', 'Swedish'];
  const colors = ['Red', 'Blue', 'Green'];
  const pets = ['Dog', 'Cat', 'Fish'];

  const handleChange = (house: string, field: string, value: string) => {
    setGrid(g => ({ ...g, [house]: { ...g[house as keyof typeof g], [field]: value } }));
  };

  const check = () => {
    const correct = (['h1', 'h2', 'h3'] as const).every(h =>
      grid[h].nation === solution[h].nation && grid[h].color === solution[h].color && grid[h].pet === solution[h].pet
    );
    if (correct) { setFeedback('correct'); setTimeout(onComplete, 600); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 1200); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <div className="card" style={{ padding: '14px', marginBottom: '16px', fontSize: '0.8rem', lineHeight: 1.7 }}>
        {clues.map((c, i) => <p key={i}>📌 {c}</p>)}
        <p style={{ fontWeight: 600, marginTop: '8px' }}>❓ Who owns the Fish?</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '6px' }}>House</th>
              <th style={{ padding: '6px' }}>Nation</th>
              <th style={{ padding: '6px' }}>Color</th>
              <th style={{ padding: '6px' }}>Pet</th>
            </tr>
          </thead>
          <tbody>
            {(['h1', 'h2', 'h3'] as const).map((h, i) => (
              <tr key={h}>
                <td style={{ padding: '6px', fontWeight: 600 }}>🏠 {i + 1}</td>
                {[{ opts: nations, field: 'nation' }, { opts: colors, field: 'color' }, { opts: pets, field: 'pet' }].map(({ opts, field }) => (
                  <td key={field} style={{ padding: '4px' }}>
                    <select value={grid[h][field as keyof typeof grid.h1]} onChange={e => handleChange(h, field, e.target.value)}
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px', width: '100%', fontSize: '0.8rem' }}>
                      <option value="">--</option>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary w-full mt-md" onClick={check}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Try Again' : 'Check Solution'}
      </button>
    </div>
  );
}
