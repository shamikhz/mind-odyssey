'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

const POOL = ['🍎', '🚀', '🦊', '🎸', '🍔', '⚡', '🏆', '🎈', '💎', '🌞'];

type Card = { id: number; symbol: string; isFlipped: boolean; isMatched: boolean };

export default function MemoryFlipAdvanced({ onComplete, difficulty = 1 }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const pairCount = 3 + difficulty; // 4 pairs for diff 1 -> 8 cards

  useEffect(() => {
    const selected = [...POOL].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({ id: idx, symbol, isFlipped: false, isMatched: false }));
    setCards(deck);
  }, [pairCount]);

  const handleCardClick = (id: number) => {
    if (isProcessing) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedIds, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1);
      const c2 = cards.find(c => c.id === id2); // Note: c2 is from the old state, but symbol hasn't changed

      // Actually get the current symbol since cards state might be slightly behind
      // But symbol doesn't change on flip, so this is safe
      const sym1 = c1?.symbol;
      const sym2 = cards.find(c => c.id === id2)?.symbol;

      if (sym1 === sym2) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, isMatched: true } : c));
          setFlippedIds([]);
          setIsProcessing(false);
          
          // Check win
          setCards(latestCards => {
            if (latestCards.every(c => c.isMatched || newFlipped.includes(c.id))) {
              setTimeout(onComplete, 400);
            }
            return latestCards;
          });
        }, 500);
      } else {
        // Mismatch - Error and Swap Advanced Mechanic
        setError(true);
        setTimeout(() => {
          setError(false);
          setCards(prev => {
            let nextState = prev.map(c => newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c);
            
            // ADVANCED MECHANIC: Swap two random un-matched face-down cards
            const unMatched = nextState.filter(c => !c.isMatched && !c.isFlipped);
            if (unMatched.length >= 2) {
              const idx1 = Math.floor(Math.random() * unMatched.length);
              let idx2 = Math.floor(Math.random() * unMatched.length);
              while (idx1 === idx2) idx2 = Math.floor(Math.random() * unMatched.length);
              
              const idA = unMatched[idx1].id;
              const idB = unMatched[idx2].id;
              
              // Swap their symbols in the array
              const symA = nextState.find(c => c.id === idA)!.symbol;
              const symB = nextState.find(c => c.id === idB)!.symbol;
              
              nextState = nextState.map(c => {
                if (c.id === idA) return { ...c, symbol: symB };
                if (c.id === idB) return { ...c, symbol: symA };
                return c;
              });
            }
            return nextState;
          });
          setFlippedIds([]);
          setIsProcessing(false);
        }, 800);
      }
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Match the pairs. <br/>
          <span style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>⚠️ Beware: Cards shuffle on incorrect guesses!</span>
        </p>
      </div>

      <div 
        className={`card flex-center ${error ? 'error-shake' : ''}`}
        style={{ 
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(4, 1fr)`,
          gap: '12px'
        }}>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              layout // automatically animates position if re-ordered, though we are just swapping symbols, so it will animate the symbol flip
              onClick={() => handleCardClick(card.id)}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '60px',
                height: '80px',
                background: card.isFlipped || card.isMatched ? 'var(--bg-body)' : 'var(--accent-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: card.isMatched ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: card.isMatched ? 0.3 : 1,
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              } as any}
            >
              <span style={{ 
                fontSize: '2rem', 
                transform: 'rotateY(180deg)',
                opacity: card.isFlipped || card.isMatched ? 1 : 0 
              }}>
                {card.symbol}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
