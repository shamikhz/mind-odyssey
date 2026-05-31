'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

type Domino = { id: number; top: number; bottom: number };

export default function DominoChain({ onComplete }: Props) {
  const [dominoes, setDominoes] = useState<Domino[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const chain: Domino[] = [
      { id: 1, top: 1, bottom: 3 },
      { id: 2, top: 3, bottom: 5 },
      { id: 3, top: 5, bottom: 2 },
      { id: 4, top: 2, bottom: 4 },
      { id: 5, top: 4, bottom: 6 },
    ];
    // Scramble the dominoes
    setDominoes(chain.sort(() => Math.random() - 0.5));
  }, []);

  const handleClick = (id: number) => {
    if (selectedId === null) {
      setSelectedId(id);
    } else {
      if (selectedId === id) {
        setSelectedId(null);
        return;
      }
      
      // Swap
      setDominoes(prev => {
        const next = [...prev];
        const idx1 = next.findIndex(d => d.id === selectedId);
        const idx2 = next.findIndex(d => d.id === id);
        
        const temp = next[idx1];
        next[idx1] = next[idx2];
        next[idx2] = temp;
        
        checkWin(next);
        return next;
      });
      setSelectedId(null);
    }
  };

  const checkWin = (currentChain: Domino[]) => {
    let isValid = true;
    for (let i = 0; i < currentChain.length - 1; i++) {
      if (currentChain[i].bottom !== currentChain[i+1].top) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      setTimeout(onComplete, 500);
    }
  };

  const renderDots = (num: number) => {
    // Simple visual for domino dots
    return <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{num}</div>;
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Swap dominoes to form a valid chain. <br/>
          The bottom number must match the top number of the next domino!
        </p>
      </div>

      <div 
        style={{ 
          display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center',
          padding: '24px', background: 'var(--bg-card)', borderRadius: '16px'
        }}
      >
        {dominoes.map(d => (
          <motion.div
            key={d.id}
            layout
            onClick={() => handleClick(d.id)}
            style={{
              width: '60px', height: '120px',
              background: 'white', color: 'black',
              borderRadius: '8px',
              display: 'flex', flexDirection: 'column',
              boxShadow: selectedId === d.id ? '0 0 0 4px var(--accent-primary)' : '0 4px 6px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              overflow: 'hidden'
            } as any}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid black' }}>
              {renderDots(d.top)}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {renderDots(d.bottom)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
