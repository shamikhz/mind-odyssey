'use client';
import React, { useState, useEffect, useMemo } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Direction = 'N' | 'E' | 'S' | 'W';
type Mirror = '/' | '\\' | null;

export default function LaserReflection({ onComplete }: Props) {
  const size = 5;
  const startPos = { x: 0, y: 0, dir: 'E' as Direction };
  const targetPos = { x: 4, y: 4 };

  const [mirrors, setMirrors] = useState<Record<string, Mirror>>({
    '2,0': '\\',
    '2,4': '/',
    '4,0': '/',
    '0,4': '\\',
  });

  const toggleMirror = (x: number, y: number) => {
    const key = `${x},${y}`;
    if (x === startPos.x && y === startPos.y) return;
    if (x === targetPos.x && y === targetPos.y) return;

    setMirrors(prev => {
      const current = prev[key];
      let next: Mirror = null;
      if (current === null || current === undefined) next = '/';
      else if (current === '/') next = '\\';
      else next = null;
      
      return { ...prev, [key]: next };
    });
  };

  // Calculate Laser Path
  const path = useMemo(() => {
    let currX = startPos.x;
    let currY = startPos.y;
    let currDir = startPos.dir;
    
    const visited = new Set<string>();
    const route: {x: number, y: number}[] = [{ x: currX, y: currY }];
    
    let isLoop = false;

    while (true) {
      const stateKey = `${currX},${currY},${currDir}`;
      if (visited.has(stateKey)) { isLoop = true; break; }
      visited.add(stateKey);

      if (currX === targetPos.x && currY === targetPos.y) break; // Hit target!

      // Move one step
      let nextX = currX;
      let nextY = currY;
      if (currDir === 'N') nextY -= 1;
      if (currDir === 'S') nextY += 1;
      if (currDir === 'E') nextX += 1;
      if (currDir === 'W') nextX -= 1;

      // Out of bounds
      if (nextX < 0 || nextX >= size || nextY < 0 || nextY >= size) break;

      currX = nextX;
      currY = nextY;
      route.push({ x: currX, y: currY });

      // Check mirror reflection
      const m = mirrors[`${currX},${currY}`];
      if (m === '/') {
        if (currDir === 'N') currDir = 'E';
        else if (currDir === 'E') currDir = 'N';
        else if (currDir === 'S') currDir = 'W';
        else if (currDir === 'W') currDir = 'S';
      } else if (m === '\\') {
        if (currDir === 'N') currDir = 'W';
        else if (currDir === 'W') currDir = 'N';
        else if (currDir === 'S') currDir = 'E';
        else if (currDir === 'E') currDir = 'S';
      }
    }
    
    return { route, isLoop };
  }, [mirrors]);

  useEffect(() => {
    const lastPoint = path.route[path.route.length - 1];
    if (lastPoint && lastPoint.x === targetPos.x && lastPoint.y === targetPos.y) {
      setTimeout(onComplete, 500);
    }
  }, [path, onComplete]);

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Click cells to place mirrors (<span style={{color: 'var(--accent-primary)'}}>/</span> or <span style={{color: 'var(--accent-primary)'}}>\</span>). <br/>
          Reflect the laser to hit the Target!
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
          position: 'relative'
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
          const x = i % size;
          const y = Math.floor(i / size);
          const isStart = x === startPos.x && y === startPos.y;
          const isTarget = x === targetPos.x && y === targetPos.y;
          const mirror = mirrors[`${x},${y}`];
          
          const inPath = path.route.find(p => p.x === x && p.y === y);

          let bg = 'var(--bg-body)';
          if (inPath) bg = 'rgba(239, 68, 68, 0.2)';
          if (isStart) bg = 'rgba(239, 68, 68, 0.4)';
          if (isTarget) bg = inPath ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.2)';

          return (
            <button
              key={i}
              onClick={() => toggleMirror(x, y)}
              style={{
                width: '60px', height: '60px',
                background: bg,
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                color: 'var(--accent-primary)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              {isStart && '☀️'}
              {isTarget && '🎯'}
              {!isStart && !isTarget && mirror}
            </button>
          );
        })}
      </div>
    </div>
  );
}
