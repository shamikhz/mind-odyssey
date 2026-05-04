'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Props { onComplete: () => void; }

const COLORS = [
  { name: 'red', bg: '#ef4444' },
  { name: 'blue', bg: '#3b82f6' },
  { name: 'green', bg: '#10b981' },
  { name: 'yellow', bg: '#f59e0b' },
];

export default function SimonSays({ onComplete }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const targetRounds = 5;
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const playSequence = useCallback((seq: number[]) => {
    setIsPlaying(true);
    seq.forEach((color, i) => {
      setTimeout(() => {
        setActiveColor(color);
        setTimeout(() => setActiveColor(null), 400);
      }, i * 700);
    });
    setTimeout(() => setIsPlaying(false), seq.length * 700 + 200);
  }, []);

  const startNewRound = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, newColor];
    setSequence(newSeq);
    setPlayerInput([]);
    setRound(r => r + 1);
    setTimeout(() => playSequence(newSeq), 500);
  }, [sequence, playSequence]);

  const handleColorClick = (colorIdx: number) => {
    if (isPlaying) return;
    const newInput = [...playerInput, colorIdx];
    setPlayerInput(newInput);
    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 200);

    const currentPos = newInput.length - 1;
    if (newInput[currentPos] !== sequence[currentPos]) {
      // Wrong - restart this round
      setPlayerInput([]);
      setTimeout(() => playSequence(sequence), 500);
      return;
    }

    if (newInput.length === sequence.length) {
      if (round >= targetRounds) {
        setTimeout(onComplete, 500);
      } else {
        setTimeout(startNewRound, 800);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    const first = Math.floor(Math.random() * 4);
    setSequence([first]);
    setRound(1);
    setTimeout(() => playSequence([first]), 500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
        {!gameStarted ? 'Press Start!' : isPlaying ? 'Watch...' : `Round ${round}/${targetRounds} — Your turn!`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {COLORS.map((color, i) => (
          <button key={i} onClick={() => !isPlaying && gameStarted && handleColorClick(i)}
            style={{
              height: '80px', borderRadius: 'var(--radius-md)', border: 'none',
              background: color.bg, opacity: activeColor === i ? 1 : 0.4,
              transform: activeColor === i ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.15s ease', cursor: isPlaying ? 'default' : 'pointer',
              boxShadow: activeColor === i ? `0 0 20px ${color.bg}` : 'none',
            }}
          />
        ))}
      </div>
      {!gameStarted && (
        <button className="btn btn-primary" onClick={startGame}>▶ Start</button>
      )}
    </div>
  );
}
