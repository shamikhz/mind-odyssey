'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const plain = "THE QUICK BROWN FOX";
const key: Record<string, string> = {};
const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const shifted = 'DEFGHIJKLMNOPQRSTUVWXYZABC'; // Caesar +3
alpha.split('').forEach((l, i) => { key[l] = shifted[i]; });
const cipher = plain.split('').map(c => key[c] || c).join('');

export default function Cryptogram({ onComplete }: Props) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const check = () => {
    if (input.toUpperCase().trim() === plain) {
      setFeedback('correct');
      setTimeout(onComplete, 500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Decode the cipher (each letter is shifted by 3):</p>
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', letterSpacing: '3px', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
          {cipher}
        </div>
      </div>
      <input type="text" value={input} onChange={e => setInput((e.target as any).value)}
        onKeyDown={e => e.key === 'Enter' && check()}
        placeholder="Type the decoded message..."
        style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'center', width: '100%', outline: 'none', textTransform: 'uppercase' }}
        autoFocus />
      <button className="btn btn-primary w-full mt-md" onClick={check}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Decoded!' : feedback === 'wrong' ? '❌ Try Again' : 'Decode'}
      </button>
    </div>
  );
}
