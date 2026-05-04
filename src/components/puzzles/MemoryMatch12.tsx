'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }
const syms = ['🌟','🎯','🔮','⚡','🎲','🧩','💎','🌈','🎨','🏆','🎭','🎪'];
function createCards() {
  const cards = [...syms, ...syms].map((s, i) => ({ id: i, symbol: s, matched: false }));
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}

export default function MemoryMatch12({ onComplete }: Props) {
  const [cards, setCards] = useState(() => createCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const handleFlip = (id: number) => {
    if (locked || flipped.includes(id) || cards[id].matched) return;
    const nf = [...flipped, id];
    setFlipped(nf);
    if (nf.length === 2) {
      setLocked(true);
      const [a, b] = nf;
      if (cards[a].symbol === cards[b].symbol) {
        setCards(p => p.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
        setFlipped([]); setLocked(false);
        if (cards.every((c, i) => c.matched || i === a || i === b)) setTimeout(onComplete, 500);
      } else { setTimeout(() => { setFlipped([]); setLocked(false); }, 800); }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <div className="memory-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {cards.map(card => {
          const isF = flipped.includes(card.id) || card.matched;
          return (
            <div key={card.id} className={`memory-card ${isF ? 'flipped' : ''}`}
              onClick={() => handleFlip(card.id)} style={{ height: '55px' }}>
              <div className="memory-card-face memory-card-back" style={{ fontSize: '1rem' }}>❓</div>
              <div className="memory-card-face memory-card-front" style={{ fontSize: '1.2rem' }}>{card.matched ? '✅' : card.symbol}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
