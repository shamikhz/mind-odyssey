'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

const symbols = ['🌟', '🎯', '🔮', '⚡'];

function createCards(pairs: number) {
  const syms = symbols.slice(0, pairs);
  const cards = [...syms, ...syms].map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }));
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}

export default function MemoryMatch({ onComplete }: Props) {
  const [cards, setCards] = useState(() => createCards(4));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const handleFlip = (id: number) => {
    if (locked || flipped.includes(id) || cards[id].matched) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      const [a, b] = newFlipped;
      if (cards[a].symbol === cards[b].symbol) {
        setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
        setFlipped([]);
        setLocked(false);
        const allMatched = cards.every((c, i) => c.matched || i === a || i === b);
        if (allMatched) setTimeout(onComplete, 500);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 800);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '300px' }}>
      <div className="memory-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <div key={card.id} className={`memory-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleFlip(card.id)} style={{ height: '70px' }}>
              <div className="memory-card-face memory-card-back">❓</div>
              <div className="memory-card-face memory-card-front">
                {card.matched ? '✅' : card.symbol}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
