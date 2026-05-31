'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

type Car = {
  id: number;
  x: number;
  y: number;
  len: number;
  dir: 'h' | 'v';
  isRed: boolean;
};

export default function TrafficJam({ onComplete }: Props) {
  const size = 5; // 5x5 grid
  const [cars, setCars] = useState<Car[]>([
    { id: 1, x: 1, y: 2, len: 2, dir: 'h', isRed: true }, // The target car
    { id: 2, x: 3, y: 1, len: 3, dir: 'v', isRed: false }, // Blocking car
    { id: 3, x: 0, y: 0, len: 2, dir: 'h', isRed: false }, 
    { id: 4, x: 1, y: 3, len: 2, dir: 'v', isRed: false },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const redCar = cars.find(c => c.isRed);
    // Exit is at the right edge of row 2 (x = 3, because len is 2, so it occupies 3 and 4)
    if (redCar && redCar.x === size - redCar.len) {
      setTimeout(onComplete, 500);
    }
  }, [cars, onComplete]);

  const isOccupied = (x: number, y: number, ignoreId?: number) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return true;
    for (const c of cars) {
      if (c.id === ignoreId) continue;
      if (c.dir === 'h' && y === c.y && x >= c.x && x < c.x + c.len) return true;
      if (c.dir === 'v' && x === c.x && y >= c.y && y < c.y + c.len) return true;
    }
    return false;
  };

  const handleCellClick = (x: number, y: number) => {
    // If clicking a car, select it
    let clickedCar = null;
    for (const c of cars) {
      if (c.dir === 'h' && y === c.y && x >= c.x && x < c.x + c.len) clickedCar = c.id;
      if (c.dir === 'v' && x === c.x && y >= c.y && y < c.y + c.len) clickedCar = c.id;
    }

    if (clickedCar) {
      setSelectedId(clickedCar);
      return;
    }

    // If clicking empty space and a car is selected, try to move
    if (!selectedId) return;
    const car = cars.find(c => c.id === selectedId);
    if (!car) return;

    // Only allow moving 1 step forward or backward in its axis
    if (car.dir === 'h') {
      if (y !== car.y) return;
      if (x === car.x - 1 && !isOccupied(car.x - 1, car.y, car.id)) {
        setCars(prev => prev.map(c => c.id === car.id ? { ...c, x: c.x - 1 } : c));
      } else if (x === car.x + car.len && !isOccupied(car.x + car.len, car.y, car.id)) {
        setCars(prev => prev.map(c => c.id === car.id ? { ...c, x: c.x + 1 } : c));
      }
    } else {
      if (x !== car.x) return;
      if (y === car.y - 1 && !isOccupied(car.x, car.y - 1, car.id)) {
        setCars(prev => prev.map(c => c.id === car.id ? { ...c, y: c.y - 1 } : c));
      } else if (y === car.y + car.len && !isOccupied(car.x, car.y + car.len, car.id)) {
        setCars(prev => prev.map(c => c.id === car.id ? { ...c, y: c.y + 1 } : c));
      }
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Click a car to select it, then click an adjacent empty space to slide it. <br/>
          Get the <b style={{color: 'var(--danger)'}}>Red Car</b> to the exit on the right!
        </p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '4px',
          border: '2px solid var(--border)',
          position: 'relative'
        }}
      >
        {/* Render grid cells for click targets */}
        {Array.from({ length: size * size }).map((_, i) => {
          const x = i % size;
          const y = Math.floor(i / size);
          const isExit = x === size - 1 && y === 2;
          return (
            <div
              key={`cell-${i}`}
              onClick={() => handleCellClick(x, y)}
              style={{
                width: '60px', height: '60px',
                background: isExit ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-body)',
                border: isExit ? '2px dashed var(--danger)' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}
            />
          );
        })}

        {/* Render Cars */}
        {cars.map(c => {
          return (
            <motion.div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              animate={{ 
                x: c.x * 64, // 60px cell + 4px gap
                y: c.y * 64 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'absolute',
                top: 12, left: 12,
                width: c.dir === 'h' ? c.len * 60 + (c.len - 1) * 4 : 60,
                height: c.dir === 'v' ? c.len * 60 + (c.len - 1) * 4 : 60,
                background: c.isRed ? 'var(--danger)' : 'var(--accent-primary)',
                borderRadius: '8px',
                border: selectedId === c.id ? '3px solid white' : '2px solid rgba(0,0,0,0.5)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
            >
              {c.isRed && <span style={{ fontSize: '1.5rem' }}>🚗</span>}
              {!c.isRed && <span style={{ fontSize: '1.5rem' }}>🚙</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
