'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Person = { id: string; time: number; emoji: string };

const PEOPLE: Person[] = [
  { id: 'A', time: 1, emoji: '🏃' },
  { id: 'B', time: 2, emoji: '🚶' },
  { id: 'C', time: 5, emoji: '👴' },
  { id: 'D', time: 10, emoji: '🐢' }
];

export default function BridgeCrossing({ onComplete, difficulty = 1 }: Props) {
  const [leftSide, setLeftSide] = useState<Person[]>(PEOPLE);
  const [rightSide, setRightSide] = useState<Person[]>([]);
  const [torchSide, setTorchSide] = useState<'left' | 'right'>('left');
  const [selected, setSelected] = useState<Person[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState('');
  
  const MAX_TIME = 17;

  useEffect(() => {
    if (rightSide.length === 4 && timeElapsed <= MAX_TIME) {
      setTimeout(onComplete, 500);
    }
  }, [rightSide, timeElapsed, onComplete]);

  const toggleSelect = (person: Person) => {
    if (selected.find(p => p.id === person.id)) {
      setSelected(selected.filter(p => p.id !== person.id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, person]);
      }
    }
  };

  const move = () => {
    if (selected.length === 0 || selected.length > 2) return;
    
    // Check if the selected people are on the same side as the torch
    const allOnLeft = selected.every(p => leftSide.find(l => l.id === p.id));
    const allOnRight = selected.every(p => rightSide.find(r => r.id === p.id));
    
    if (torchSide === 'left' && !allOnLeft) {
      setError("Torch is on the left. You must select people from the left.");
      setTimeout(() => setError(''), 2000);
      return;
    }
    if (torchSide === 'right' && !allOnRight) {
      setError("Torch is on the right. You must select people from the right.");
      setTimeout(() => setError(''), 2000);
      return;
    }

    const timeTaken = Math.max(...selected.map(p => p.time));
    const newTime = timeElapsed + timeTaken;
    
    if (newTime > MAX_TIME) {
      setError("Time limit exceeded! Resetting...");
      setTimeout(() => {
        setError('');
        reset();
      }, 2000);
      setTimeElapsed(newTime);
      return;
    }

    if (torchSide === 'left') {
      setLeftSide(leftSide.filter(l => !selected.find(s => s.id === l.id)));
      setRightSide([...rightSide, ...selected]);
      setTorchSide('right');
    } else {
      setRightSide(rightSide.filter(r => !selected.find(s => s.id === r.id)));
      setLeftSide([...leftSide, ...selected]);
      setTorchSide('left');
    }
    
    setTimeElapsed(newTime);
    setSelected([]);
  };

  const reset = () => {
    setLeftSide(PEOPLE);
    setRightSide([]);
    setTorchSide('left');
    setSelected([]);
    setTimeElapsed(0);
    setError('');
  };

  const renderSide = (side: 'left' | 'right', people: Person[]) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
      <h4 style={{ color: 'var(--text-secondary)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {side.toUpperCase()} {torchSide === side && <span style={{fontSize: '1.2rem'}}>🔦</span>}
      </h4>
      {people.map(p => {
        const isSelected = selected.find(s => s.id === p.id);
        const canSelect = torchSide === side;
        return (
          <button
            key={p.id}
            onClick={() => toggleSelect(p)}
            disabled={!canSelect && !isSelected}
            className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              display: 'flex', justifyContent: 'space-between', padding: '8px 16px',
              opacity: (!canSelect && !isSelected) ? 0.5 : 1
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
            <span style={{ fontWeight: 'bold' }}>{p.time}m</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Move everyone across the bridge. Max 2 people per trip. The torch 🔦 must go with them.<br/>
          Trip time = time of the <b>slowest</b> person. Max time: <b>{MAX_TIME}m</b>
        </p>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeElapsed > MAX_TIME ? 'var(--danger)' : 'var(--accent-primary)', marginTop: '8px' }}>
          Elapsed: {timeElapsed}m
        </p>
      </div>

      <div className="card flex-center" style={{ background: 'var(--bg-card)', width: '100%', gap: '24px' }}>
        
        {error && (
          <div style={{ position: 'absolute', top: 20, background: 'var(--danger)', color: 'white', padding: '8px 16px', borderRadius: '8px', zIndex: 10 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', width: '100%', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {renderSide('left', leftSide)}
          
          <div className="flex-col flex-center" style={{ width: '100px', marginTop: '40px' }}>
            <div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.05)', borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               🌉
            </div>
            <button 
              className="btn btn-primary mt-md" 
              onClick={move}
              disabled={selected.length === 0}
            >
              GO ➡
            </button>
          </div>

          {renderSide('right', rightSide)}
        </div>
      </div>
      
      <button className="btn btn-ghost mt-md" onClick={reset}>Reset Puzzle</button>
    </div>
  );
}
