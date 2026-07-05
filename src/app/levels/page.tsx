'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { levels } from '@/data/levels';
import type { PuzzleCategory } from '@/types/game';

const categories: { key: PuzzleCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '🌟' },
  { key: 'logic', label: 'Logic', icon: '🧠' },
  { key: 'memory', label: 'Memory', icon: '🎯' },
  { key: 'creativity', label: 'Creativity', icon: '🎨' },
  { key: 'strategy', label: 'Strategy', icon: '🏆' },
];

export default function LevelsPage() {
  const { state, getStarsForLevel, isLevelUnlocked, isLevelCompleted, getTotalStars, getLevelsCleared } = useGame();
  const [filter, setFilter] = useState<PuzzleCategory | 'all'>('all');

  const filtered = filter === 'all' ? levels : levels.filter(l => l.category === filter);
  const totalStars = getTotalStars();
  const maxStars = levels.length * 3;

  return (
    <div className="page">
      <div className="page-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: '8px', display: 'inline-flex' }}>← Back</Link>
            <h2><span className="gradient-text">Level Select</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {getLevelsCleared()}/{levels.length} cleared · {totalStars}/{maxStars} ⭐
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>💡 {state.hintsRemaining}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-md">
          <div className="progress-fill" style={{ width: `${(getLevelsCleared() / levels.length) * 100}%` }} />
        </div>

        {/* Filter Tabs (Hidden) */}

        {/* Level Grid */}
        <div className="level-grid">
          {filtered.map(level => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);
            const stars = getStarsForLevel(level.id);
            const status = completed ? 'completed' : unlocked ? 'unlocked' : 'locked';

            return unlocked ? (
              <Link key={level.id} href={`/play/${level.id}`}>
                <button className={`level-btn ${status}`} title={level.name}>
                  {level.id}
                  {completed && (
                    <span className="stars-indicator">
                      {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                    </span>
                  )}
                </button>
              </Link>
            ) : (
              <button key={level.id} className={`level-btn ${status}`} title="Locked" disabled>
                🔒
              </button>
            );
          })}
        </div>



      </div>
    </div>
  );
}
