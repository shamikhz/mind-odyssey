'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface Props { onComplete: () => void; }

function generateMaze(size: number): number[][] {
  const maze = Array(size).fill(null).map(() => Array(size).fill(1));
  function carve(r: number, c: number) {
    maze[r][c] = 0;
    const dirs = [[0,2],[0,-2],[2,0],[-2,0]].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && maze[nr][nc] === 1) {
        maze[r + dr / 2][c + dc / 2] = 0;
        carve(nr, nc);
      }
    }
  }
  carve(1, 1);
  maze[1][0] = 0; maze[size - 2][size - 1] = 0;
  return maze;
}

export default function MazeEasy({ onComplete }: Props) {
  const size = 11;
  const [maze] = useState(() => generateMaze(size));
  const [pos, setPos] = useState({ r: 1, c: 0 });
  const [visited, setVisited] = useState<Set<string>>(new Set(['1,0']));
  const endPos = { r: size - 2, c: size - 1 };

  const move = useCallback((dr: number, dc: number) => {
    setPos(p => {
      const nr = p.r + dr, nc = p.c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && maze[nr][nc] === 0) {
        setVisited(v => new Set([...v, `${nr},${nc}`]));
        if (nr === endPos.r && nc === endPos.c) setTimeout(onComplete, 300);
        return { r: nr, c: nc };
      }
      return p;
    });
  }, [maze, onComplete, endPos.r, endPos.c, size]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(-1, 0);
      else if (e.key === 'ArrowDown') move(1, 0);
      else if (e.key === 'ArrowLeft') move(0, -1);
      else if (e.key === 'ArrowRight') move(0, 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Use arrow keys or buttons to navigate</p>
      <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, marginBottom: '12px' }}>
        {maze.map((row, r) => row.map((cell, c) => {
          const isPlayer = r === pos.r && c === pos.c;
          const isEnd = r === endPos.r && c === endPos.c;
          const isVisited = visited.has(`${r},${c}`);
          return (
            <div key={`${r}-${c}`} className={`maze-cell ${cell === 1 ? 'maze-wall' : isPlayer ? 'maze-player' : isEnd ? 'maze-end' : isVisited ? 'maze-visited' : 'maze-path'}`}
              style={{ width: '100%' }} />
          );
        }))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '4px', justifyContent: 'center' }}>
        <div /><button className="btn btn-sm btn-secondary" onClick={() => move(-1, 0)}>↑</button><div />
        <button className="btn btn-sm btn-secondary" onClick={() => move(0, -1)}>←</button>
        <div />
        <button className="btn btn-sm btn-secondary" onClick={() => move(0, 1)}>→</button>
        <div /><button className="btn btn-sm btn-secondary" onClick={() => move(1, 0)}>↓</button><div />
      </div>
    </div>
  );
}
