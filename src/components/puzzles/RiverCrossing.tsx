'use client';
import React, { useState, useCallback } from 'react';

interface Props { onComplete: () => void; }

type Entity = 'farmer' | 'fox' | 'chicken' | 'grain';
type Side = 'left' | 'right';
const icons: Record<Entity, string> = { farmer: '👨‍🌾', fox: '🦊', chicken: '🐔', grain: '🌾' };

function isDangerous(entities: Entity[]): boolean {
  const noFarmer = !entities.includes('farmer');
  if (noFarmer && entities.includes('fox') && entities.includes('chicken')) return true;
  if (noFarmer && entities.includes('chicken') && entities.includes('grain')) return true;
  return false;
}

export default function RiverCrossing({ onComplete }: Props) {
  const [left, setLeft] = useState<Entity[]>(['farmer', 'fox', 'chicken', 'grain']);
  const [right, setRight] = useState<Entity[]>([]);
  const [boat, setBoat] = useState<Entity[]>([]);
  const [boatSide, setBoatSide] = useState<Side>('left');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const resetGame = useCallback(() => {
    setLeft(['farmer', 'fox', 'chicken', 'grain']);
    setRight([]);
    setBoat([]);
    setBoatSide('left');
    setMessage('');
    setGameOver(false);
  }, []);

  const getBank = (side: Side) => side === 'left' ? left : right;

  const handleEntityClick = (entity: Entity) => {
    if (gameOver) return;
    const bank = getBank(boatSide);
    if (bank.includes(entity)) {
      if (entity !== 'farmer' && !boat.includes('farmer') && !bank.includes('farmer')) return;
      if (boat.length >= 2) return;
      if (boatSide === 'left') setLeft(l => l.filter(e => e !== entity));
      else setRight(r => r.filter(e => e !== entity));
      setBoat(b => [...b, entity]);
    } else if (boat.includes(entity)) {
      setBoat(b => b.filter(e => e !== entity));
      if (boatSide === 'left') setLeft(l => [...l, entity]);
      else setRight(r => [...r, entity]);
    }
  };

  const crossRiver = useCallback(() => {
    if (!boat.includes('farmer') || gameOver) return;
    const newSide: Side = boatSide === 'left' ? 'right' : 'left';
    const fromBank = boatSide === 'left' ? left : right;

    if (isDangerous(fromBank)) {
      setMessage('💀 Something got eaten! Try again.');
      setGameOver(true);
      return;
    }

    if (newSide === 'left') setLeft(l => [...l, ...boat]);
    else setRight(r => [...r, ...boat]);
    setBoat([]);
    setBoatSide(newSide);

    const newRight = newSide === 'right' ? [...right, ...boat] : right;
    if (newRight.length === 4) setTimeout(onComplete, 500);
  }, [boat, boatSide, left, right, gameOver, onComplete]);

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      {message && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>{message}</div>
          {gameOver && (
            <button className="btn btn-primary btn-sm" onClick={resetGame}>
              Try Again
            </button>
          )}
        </div>
      )}
      <div className="crossing-scene">
        <div className="crossing-bank">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>LEFT BANK</div>
          {left.map(e => (
            <span key={e} className="crossing-entity" onClick={() => handleEntityClick(e)} role="button" tabIndex={0}>{icons[e]}</span>
          ))}
          {left.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Empty</span>}
        </div>

        <div className="crossing-river">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            {boat.map(e => (
              <span key={e} className="crossing-entity" onClick={() => handleEntityClick(e)} style={{ fontSize: '1.5rem' }}>{icons[e]}</span>
            ))}
            <button className="crossing-boat" onClick={crossRiver} title="Cross river" disabled={!boat.includes('farmer')}>⛵</button>
            <div style={{ fontSize: '0.6rem', color: 'white', opacity: 0.7 }}>{boatSide === 'left' ? '→' : '←'}</div>
          </div>
        </div>

        <div className="crossing-bank">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>RIGHT BANK</div>
          {right.map(e => (
            <span key={e} className="crossing-entity" onClick={() => handleEntityClick(e)} role="button" tabIndex={0}>{icons[e]}</span>
          ))}
          {right.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Empty</span>}
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
        Click entities to load/unload boat. Click ⛵ to cross. Farmer must always be in the boat.
      </p>
    </div>
  );
}
