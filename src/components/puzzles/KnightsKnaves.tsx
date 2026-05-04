'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// A says: "B is a Knave". B says: "We are both Knights".
// Solution: A=Knight, B=Knave
export default function KnightsKnaves({ onComplete }: Props) {
  const [answerA, setAnswerA] = useState<string>('');
  const [answerB, setAnswerB] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const check = () => {
    if (answerA === 'Knight' && answerB === 'Knave') {
      setFeedback('correct');
      setTimeout(onComplete, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
      <div className="card" style={{ padding: '20px', marginBottom: '20px', textAlign: 'left', lineHeight: 1.7 }}>
        <p style={{ marginBottom: '8px' }}>🏰 <strong>Knights</strong> always tell the truth. <strong>Knaves</strong> always lie.</p>
        <p style={{ marginBottom: '4px' }}>👤 <strong>Person A says:</strong> &quot;B is a Knave.&quot;</p>
        <p>👤 <strong>Person B says:</strong> &quot;We are both Knights.&quot;</p>
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Person A is:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Knight', 'Knave'].map(opt => (
              <button key={opt} className={`btn btn-sm ${answerA === opt ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAnswerA(opt)}>{opt}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Person B is:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Knight', 'Knave'].map(opt => (
              <button key={opt} className={`btn btn-sm ${answerB === opt ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAnswerB(opt)}>{opt}</button>
            ))}
          </div>
        </div>
      </div>
      <button className="btn btn-primary w-full" onClick={check} disabled={!answerA || !answerB}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Wrong' : 'Submit Answer'}
      </button>
    </div>
  );
}
