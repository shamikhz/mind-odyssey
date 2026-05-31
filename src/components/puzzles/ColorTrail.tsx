'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function ColorTrail({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'flashing' | 'input'>('start');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const gridSize = 16; // 4x4 grid
  const seqLength = 4 + difficulty;

  const startGame = () => {
    // Generate a random path (adjacent cells if possible, but for simplicity, random unique cells)
    const newSeq: number[] = [];
    let current = Math.floor(Math.random() * gridSize);
    newSeq.push(current);

    // Simple path generator
    for (let i = 1; i < seqLength; i++) {
      const neighbors = [];
      const row = Math.floor(current / 4);
      const col = current % 4;
      if (row > 0) neighbors.push(current - 4);
      if (row < 3) neighbors.push(current + 4);
      if (col > 0) neighbors.push(current - 1);
      if (col < 3) neighbors.push(current + 1);
      
      const unvisited = neighbors.filter(n => !newSeq.includes(n));
      if (unvisited.length > 0) {
        current = unvisited[Math.floor(Math.random() * unvisited.length)];
      } else {
        // If boxed in, pick random unvisited cell
        const allUnvisited = Array.from({length: gridSize}, (_, idx) => idx).filter(idx => !newSeq.includes(idx));
        current = allUnvisited[Math.floor(Math.random() * allUnvisited.length)];
      }
      newSeq.push(current);
    }

    setSequence(newSeq);
    setUserInput([]);
    setPhase('flashing');
    
    // Play the sequence
    let delay = 500;
    newSeq.forEach((cellIdx, index) => {
      setTimeout(() => {
        setActiveCell(cellIdx);
        setTimeout(() => setActiveCell(null), 400); // highlight duration
        
        if (index === newSeq.length - 1) {
          setTimeout(() => setPhase('input'), 600);
        }
      }, delay);
      delay += 700;
    });
  };

  const handleCellClick = (cellIdx: number) => {
    if (phase !== 'input') return;

    // Optional visual feedback for click
    setActiveCell(cellIdx);
    setTimeout(() => setActiveCell(null), 150);

    const nextIndex = userInput.length;
    if (sequence[nextIndex] === cellIdx) {
      const newInput = [...userInput, cellIdx];
      setUserInput(newInput);
      if (newInput.length === sequence.length) {
        setTimeout(onComplete, 400);
      }
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setUserInput([]); // Reset sequence on mistake
      }, 500);
    }
  };

  if (phase === 'start') {
    return (
      <div className="flex-col flex-center" style={{ padding: '40px' }}>
        <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
          Watch the path light up, then retrace it exactly!
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start Path</button>
      </div>
    );
  }

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'flashing' ? (
          <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Watch the path...</p>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Retrace the path ({userInput.length}/{sequence.length})</p>
        )}
      </div>

      <div 
        className={`card ${error ? 'error-shake' : ''}`}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px',
          width: '280px',
          height: '280px',
          padding: '12px',
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {Array.from({ length: gridSize }).map((_, i) => {
          const isUserInputted = phase === 'input' && userInput.includes(i);
          const isFlashing = phase === 'flashing' && activeCell === i;
          const isClickedNow = phase === 'input' && activeCell === i;

          let bg = 'var(--bg-body)';
          if (isFlashing) bg = 'var(--accent-primary)';
          else if (isUserInputted) bg = 'rgba(124,58,237,0.4)'; // Light purple for already selected
          if (isClickedNow) bg = 'var(--accent-primary)';

          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'input' || userInput.includes(i)}
              style={{
                borderRadius: '8px',
                background: bg,
                border: '1px solid var(--border)',
                cursor: phase === 'input' && !userInput.includes(i) ? 'pointer' : 'default',
                transition: 'background 0.1s ease',
              }}
            />
          );
        })}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
