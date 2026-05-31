'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Item = '🐺' | '🐐' | '🥬';

export default function WolfGoatCabbage({ onComplete }: Props) {
  const [leftSide, setLeftSide] = useState<Item[]>(['🐺', '🐐', '🥬']);
  const [rightSide, setRightSide] = useState<Item[]>([]);
  const [boatSide, setBoatSide] = useState<'left' | 'right'>('left');
  const [inBoat, setInBoat] = useState<Item | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rightSide.length === 3) {
      setTimeout(onComplete, 500);
    }
  }, [rightSide, onComplete]);

  const checkRules = (sideItems: Item[], boatIsHere: boolean) => {
    if (boatIsHere) return true; // Farmer is here, all safe
    if (sideItems.includes('🐺') && sideItems.includes('🐐')) return "Wolf ate the Goat! 🐺🍖";
    if (sideItems.includes('🐐') && sideItems.includes('🥬')) return "Goat ate the Cabbage! 🐐🥬";
    return true;
  };

  const moveBoat = () => {
    // Validate rules after moving boat away from current side
    const currentSideItems = boatSide === 'left' ? leftSide : rightSide;
    const ruleCheck = checkRules(currentSideItems, false); // boat is leaving

    if (typeof ruleCheck === 'string') {
      setError(ruleCheck);
      setTimeout(() => { setError(''); reset(); }, 2500);
      return;
    }

    setBoatSide(prev => prev === 'left' ? 'right' : 'left');
  };

  const loadBoat = (item: Item, fromSide: 'left' | 'right') => {
    if (boatSide !== fromSide) return;
    if (inBoat) return; // Boat full

    if (fromSide === 'left') {
      setLeftSide(leftSide.filter(i => i !== item));
    } else {
      setRightSide(rightSide.filter(i => i !== item));
    }
    setInBoat(item);
  };

  const unloadBoat = () => {
    if (!inBoat) return;
    if (boatSide === 'left') {
      setLeftSide([...leftSide, inBoat]);
    } else {
      setRightSide([...rightSide, inBoat]);
    }
    setInBoat(null);
  };

  const reset = () => {
    setLeftSide(['🐺', '🐐', '🥬']);
    setRightSide([]);
    setBoatSide('left');
    setInBoat(null);
    setError('');
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Move all items to the right side.<br/>
          Boat holds <b>1 item</b>. Never leave Wolf + Goat, or Goat + Cabbage alone!
        </p>
      </div>

      <div className="card" style={{ background: 'var(--bg-card)', width: '100%', position: 'relative', height: '250px', display: 'flex', alignItems: 'center' }}>
        
        {error && (
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'var(--danger)', color: 'white', padding: '8px 16px', borderRadius: '8px', zIndex: 10, fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        {/* River */}
        <div style={{ position: 'absolute', left: '120px', right: '120px', top: 0, bottom: 0, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center' }}>
           {/* Boat */}
           <div style={{ 
              position: 'absolute', 
              left: boatSide === 'left' ? '10px' : 'calc(100% - 110px)',
              transition: 'left 0.8s ease-in-out',
              width: '100px', height: '80px', 
              background: '#8B4513', borderRadius: '0 0 40px 40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0px -10px 0px rgba(0,0,0,0.2)'
           }}>
             <div style={{ fontSize: '2rem', minHeight: '40px', cursor: 'pointer' }} onClick={unloadBoat}>
               {inBoat || ''}
             </div>
             <button onClick={moveBoat} style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.8)' }}>
               🚣 ROW
             </button>
           </div>
        </div>

        {/* Left Bank */}
        <div style={{ width: '120px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 2, background: 'rgba(34, 197, 94, 0.1)' }}>
          {leftSide.map((item, i) => (
            <button key={i} className="btn btn-secondary" style={{ fontSize: '2rem', padding: '8px', background: 'var(--bg-body)' }} onClick={() => loadBoat(item, 'left')}>
              {item}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Right Bank */}
        <div style={{ width: '120px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 2, background: 'rgba(34, 197, 94, 0.1)' }}>
          {rightSide.map((item, i) => (
            <button key={i} className="btn btn-secondary" style={{ fontSize: '2rem', padding: '8px', background: 'var(--bg-body)' }} onClick={() => loadBoat(item, 'right')}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-ghost mt-md" onClick={reset}>Reset Puzzle</button>
    </div>
  );
}
