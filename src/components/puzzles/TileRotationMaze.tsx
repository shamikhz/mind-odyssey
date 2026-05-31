'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

// A tile has walls: N, E, S, W (true = wall, false = open)
type Tile = { id: number; walls: [boolean, boolean, boolean, boolean]; currentRot: number; correctRot: number };

export default function TileRotationMaze({ onComplete }: Props) {
  const size = 3;
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    // A simple 3x3 maze path:
    // (0,0) Start -> (0,1) -> (1,1) -> (1,2) -> (2,2) End
    const layout: { id: number, walls: [boolean, boolean, boolean, boolean], rot: number }[] = [
      { id: 0, walls: [true, false, false, true], rot: 0 }, // open E, S
      { id: 1, walls: [true, true, false, false], rot: 0 }, // open S, W
      { id: 2, walls: [true, true, true, true], rot: 0 },   // dead (all walls)
      
      { id: 3, walls: [true, true, true, true], rot: 0 },   // dead
      { id: 4, walls: [false, false, false, true], rot: 0 }, // open N, E, S
      { id: 5, walls: [true, true, false, false], rot: 0 },  // open S, W
      
      { id: 6, walls: [true, true, true, true], rot: 0 },   // dead
      { id: 7, walls: [true, true, true, true], rot: 0 },   // dead
      { id: 8, walls: [false, true, true, true], rot: 0 },  // open N (End)
    ];

    const scrambled = layout.map(t => ({
      ...t,
      correctRot: 0, // In this simplified version, we just check if it matches the hardcoded solution
      currentRot: (t.id === 0 || t.id === 8) ? 0 : Math.floor(Math.random() * 4) * 90 // scramble
    }));

    setTiles(scrambled);
  }, []);

  const handleRotate = (id: number) => {
    if (id === 0 || id === 8) return; // Start and End are fixed

    setTiles(prev => {
      const next = prev.map(t => t.id === id ? { ...t, currentRot: (t.currentRot + 90) % 360 } : t);
      checkWin(next);
      return next;
    });
  };

  const checkWin = (currentTiles: Tile[]) => {
    // To simplify pathfinding for this mini-game, we just check if all critical path tiles are at rotation 0.
    // Critical path: 0, 1, 4, 5, 8
    const criticalIds = [1, 4, 5];
    const isWin = criticalIds.every(id => {
      const t = currentTiles.find(x => x.id === id);
      return t?.currentRot === 0;
    });

    if (isWin) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Click tiles to rotate them and open a clear path from Start (Top-Left) to End (Bottom-Right).
        </p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '4px',
          border: '2px solid var(--border)',
        }}
      >
        {tiles.map((t) => {
          const isFixed = t.id === 0 || t.id === 8;
          
          return (
            <button
              key={t.id}
              onClick={() => handleRotate(t.id)}
              disabled={isFixed}
              style={{
                width: '80px', height: '80px',
                background: 'var(--bg-body)',
                // Rotate the entire container to rotate the walls
                transform: `rotate(${t.currentRot}deg)`,
                transition: 'transform 0.2s ease',
                position: 'relative',
                cursor: isFixed ? 'default' : 'pointer',
                
                // Draw walls using CSS borders
                borderTop: t.walls[0] ? '4px solid var(--border)' : '4px solid transparent',
                borderRight: t.walls[1] ? '4px solid var(--border)' : '4px solid transparent',
                borderBottom: t.walls[2] ? '4px solid var(--border)' : '4px solid transparent',
                borderLeft: t.walls[3] ? '4px solid var(--border)' : '4px solid transparent',
              }}
            >
              {/* Counter-rotate the text so it stays upright! */}
              <div style={{ transform: `rotate(-${t.currentRot}deg)`, fontSize: '2rem' }}>
                {t.id === 0 && '☀️'}
                {t.id === 8 && '🎯'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
