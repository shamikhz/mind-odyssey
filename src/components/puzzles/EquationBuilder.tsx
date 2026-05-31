'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function EquationBuilder({ onComplete }: Props) {
  // Equation: 12 _ 4 _ 2 = 1
  // Valid solution: 12 / 4 - 2 = 3 - 2 = 1. Or 12 - 4 * 2 = 12 - 8 = 4 (no).
  const target = 1;
  const numbers = [12, 4, 2];
  
  const [ops, setOps] = useState<string[]>(['', '']);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ops[0] && ops[1]) {
      // Evaluate
      // JS eval is safe here because we control the inputs strictly, but let's do manual eval for safety
      let res = 0;
      
      // Handle standard precedence: * and / first
      let n1 = numbers[0], n2 = numbers[1], n3 = numbers[2];
      let op1 = ops[0], op2 = ops[1];

      // Simplified math evaluator for exactly 2 operators
      let intermediate = 0;
      if (op2 === '*' || op2 === '/') {
        intermediate = op2 === '*' ? n2 * n3 : n2 / n3;
        res = op1 === '+' ? n1 + intermediate : op1 === '-' ? n1 - intermediate : op1 === '*' ? n1 * intermediate : n1 / intermediate;
      } else {
        intermediate = op1 === '+' ? n1 + n2 : op1 === '-' ? n1 - n2 : op1 === '*' ? n1 * n2 : n1 / n2;
        res = op2 === '+' ? intermediate + n3 : op2 === '-' ? intermediate - n3 : op2 === '*' ? intermediate * n3 : intermediate / n3;
      }

      if (res === target) {
        setTimeout(onComplete, 500);
      } else {
        setError(true);
        setTimeout(() => { setError(false); setOps(['', '']); }, 800);
      }
    }
  }, [ops, onComplete]);

  const selectOp = (op: string) => {
    if (activeSlot === null) return;
    setOps(prev => {
      const next = [...prev];
      next[activeSlot] = op;
      return next;
    });
    setActiveSlot(null);
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Fill in the missing operators to make the equation true! <br/>
          (Standard order of operations applies)
        </p>
      </div>

      <div 
        className={`card flex-center ${error ? 'error-shake' : ''}`}
        style={{ 
          background: 'var(--bg-card)', 
          padding: '24px',
          display: 'flex', gap: '16px', alignItems: 'center',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{numbers[0]}</span>
        
        <button 
          onClick={() => setActiveSlot(0)}
          style={{
            width: '50px', height: '50px', fontSize: '1.5rem',
            border: activeSlot === 0 ? '2px solid var(--accent-primary)' : '2px dashed var(--border)',
            background: 'var(--bg-body)', color: 'var(--accent-primary)',
            borderRadius: '8px', cursor: 'pointer'
          }}
        >
          {ops[0] || '?'}
        </button>

        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{numbers[1]}</span>

        <button 
          onClick={() => setActiveSlot(1)}
          style={{
            width: '50px', height: '50px', fontSize: '1.5rem',
            border: activeSlot === 1 ? '2px solid var(--accent-primary)' : '2px dashed var(--border)',
            background: 'var(--bg-body)', color: 'var(--accent-primary)',
            borderRadius: '8px', cursor: 'pointer'
          }}
        >
          {ops[1] || '?'}
        </button>

        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{numbers[2]}</span>

        <span style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 12px' }}>=</span>

        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{target}</span>
      </div>

      {activeSlot !== null && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {['+', '-', '×', '÷'].map((symbol) => {
            const op = symbol === '×' ? '*' : symbol === '÷' ? '/' : symbol;
            return (
              <button
                key={op}
                onClick={() => selectOp(op)}
                className="btn btn-secondary"
                style={{ fontSize: '2rem', width: '60px', height: '60px' }}
              >
                {symbol}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
