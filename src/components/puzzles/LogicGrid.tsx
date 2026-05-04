'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Simple 3x3 logic grid: Match person to pet and color
const solution: Record<string, Record<string, string>> = {
  'Alice': { pet: 'Cat', color: 'Red' },
  'Bob': { pet: 'Dog', color: 'Blue' },
  'Carol': { pet: 'Fish', color: 'Green' },
};
const people = ['Alice', 'Bob', 'Carol'];
const pets = ['Cat', 'Dog', 'Fish'];
const colors = ['Red', 'Blue', 'Green'];

export default function LogicGrid({ onComplete }: Props) {
  const [grid, setGrid] = useState<Record<string, Record<string, string>>>({
    Alice: { pet: '', color: '' }, Bob: { pet: '', color: '' }, Carol: { pet: '', color: '' },
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (person: string, field: string, value: string) => {
    setGrid(g => ({ ...g, [person]: { ...g[person], [field]: value } }));
  };

  const checkSolution = () => {
    const correct = people.every(p => grid[p].pet === solution[p].pet && grid[p].color === solution[p].color);
    if (correct) { setFeedback('correct'); setTimeout(onComplete, 600); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 1200); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px' }}>
      <div className="card" style={{ padding: '16px', marginBottom: '16px', fontSize: '0.85rem', lineHeight: 1.7 }}>
        <p>📌 Alice does not have a Dog.</p>
        <p>📌 The person with the Cat likes Red.</p>
        <p>📌 Bob&apos;s favorite color is Blue.</p>
        <p>📌 Carol has a Fish.</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-muted)' }}>Person</th>
              <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Pet</th>
              <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Color</th>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <tr key={person} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>{person}</td>
                <td style={{ padding: '8px' }}>
                  <select value={grid[person].pet} onChange={e => handleChange(person, 'pet', e.target.value)}
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 8px', width: '100%' }}>
                    <option value="">--</option>
                    {pets.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td style={{ padding: '8px' }}>
                  <select value={grid[person].color} onChange={e => handleChange(person, 'color', e.target.value)}
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 8px', width: '100%' }}>
                    <option value="">--</option>
                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary w-full mt-md" onClick={checkSolution}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined, background: feedback === 'correct' ? 'var(--success)' : undefined }}>
        {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Try Again' : 'Check Solution'}
      </button>
    </div>
  );
}
