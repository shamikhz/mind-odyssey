'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

type ObjectData = { id: number; icon: string; currentCell: number; originalCell: number; };

const ICONS = ['🍎', '🚀', '💎', '⭐', '🎈', '🦊'];

export default function MovingObjectMemory({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'memorize' | 'shuffling' | 'guess'>('start');
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [error, setError] = useState(false);
  
  const gridSize = 9; // 3x3 grid
  const objCount = 3; 

  const { seconds, start: startTimer, reset: resetTimer } = useCountdown(3, () => {
    startShuffle();
  });

  const startGame = () => {
    // Pick random unique cells
    const cells = Array.from({ length: gridSize }, (_, i) => i);
    cells.sort(() => Math.random() - 0.5);
    
    const newObjects = Array.from({ length: objCount }).map((_, i) => ({
      id: i,
      icon: ICONS[i],
      originalCell: cells[i],
      currentCell: cells[i]
    }));
    
    setObjects(newObjects);
    setSelectedCells([]);
    setPhase('memorize');
    resetTimer(3);
    startTimer();
  };

  const startShuffle = () => {
    setPhase('shuffling');
    let shuffles = 0;
    const maxShuffles = 4;
    
    const interval = setInterval(() => {
      shuffles++;
      setObjects(prev => {
        // Move each object to an adjacent or random empty cell
        const currentOccupied = prev.map(p => p.currentCell);
        return prev.map(obj => {
          let newCell = obj.currentCell;
          // Simple random walk
          const emptyCells = Array.from({length: gridSize}, (_, i) => i).filter(c => !currentOccupied.includes(c));
          if (emptyCells.length > 0) {
            newCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          }
          return { ...obj, currentCell: newCell };
        });
      });
      
      if (shuffles >= maxShuffles) {
        clearInterval(interval);
        setTimeout(() => setPhase('guess'), 600);
      }
    }, 800);
  };

  const handleCellClick = (cellIndex: number) => {
    if (phase !== 'guess') return;
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells(prev => prev.filter(c => c !== cellIndex));
      return;
    }

    const newSelected = [...selectedCells, cellIndex];
    setSelectedCells(newSelected);

    if (newSelected.length === objCount) {
      // Validate
      const originalPositions = objects.map(o => o.originalCell);
      const isCorrect = newSelected.every(c => originalPositions.includes(c));
      
      if (isCorrect) {
        setTimeout(onComplete, 500);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setSelectedCells([]);
        }, 800);
      }
    }
  };

  if (phase === 'start') {
    return (
      <div className="flex-col flex-center" style={{ padding: '40px' }}>
        <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
          Memorize the starting positions of the objects. They will move around. 
          After they stop, click the grid cells where they <b>originally started</b>.
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start</button>
      </div>
    );
  }

  // Calculate grid layout for Framer Motion positions
  const getPosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { x: col * 80, y: row * 80 };
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'memorize' && <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Memorize starting positions! ({seconds}s)</p>}
        {phase === 'shuffling' && <p style={{ color: 'var(--text-secondary)' }}>Keep tracking them...</p>}
        {phase === 'guess' && <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Select the {objCount} starting cells!</p>}
      </div>

      <div 
        className={`card ${error ? 'error-shake' : ''}`}
        style={{ 
          position: 'relative', 
          width: '240px', 
          height: '240px', 
          padding: 0,
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {/* Draw Grid Background */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%', height: '100%' }}>
          {Array.from({ length: gridSize }).map((_, i) => (
            <div 
              key={i} 
              onClick={() => handleCellClick(i)}
              style={{ 
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: phase === 'guess' ? 'pointer' : 'default',
                background: selectedCells.includes(i) ? 'rgba(124,58,237,0.3)' : 'transparent',
                transition: 'background 0.2s ease'
              }} 
            />
          ))}
        </div>

        {/* Animated Objects */}
        {objects.map(obj => (
          <motion.div
            key={obj.id}
            initial={false}
            animate={{ 
              x: getPosition(obj.currentCell).x, 
              y: getPosition(obj.currentCell).y,
              opacity: phase === 'guess' ? 0.3 : 1, // Fade them out during guess phase to not confuse
              scale: phase === 'guess' ? 0.5 : 1
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '80px', height: '80px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
              pointerEvents: 'none'
            }}
          >
            {obj.icon}
          </motion.div>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
