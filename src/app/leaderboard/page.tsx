'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';

interface LeaderboardEntry {
  name: string;
  stars: number;
  levels: number;
}

export default function LeaderboardPage() {
  const { state, getTotalStars, getLevelsCleared } = useGame();

  // Local leaderboard from localStorage
  const [entries] = useState<LeaderboardEntry[]>(() => {
    const current: LeaderboardEntry = {
      name: state.playerName,
      stars: getTotalStars(),
      levels: getLevelsCleared(),
    };
    // Simulated entries for visual richness
    const simulated: LeaderboardEntry[] = [
      { name: 'BrainMaster', stars: 142, levels: 50 },
      { name: 'PuzzleQueen', stars: 138, levels: 49 },
      { name: 'LogicWiz', stars: 125, levels: 47 },
      { name: 'MindBender', stars: 110, levels: 42 },
      { name: 'ThinkTank', stars: 98, levels: 38 },
      { name: 'NeuralNinja', stars: 85, levels: 33 },
      { name: 'BrainStorm', stars: 72, levels: 28 },
      { name: 'PuzzlePro', stars: 60, levels: 23 },
      { name: 'MindMapper', stars: 45, levels: 18 },
      { name: 'ThoughtWave', stars: 30, levels: 12 },
    ];
    const all = [...simulated, current].sort((a, b) => b.stars - a.stars);
    return all;
  });

  const playerRank = entries.findIndex(e => e.name === state.playerName) + 1;

  return (
    <div className="page">
      <div className="page-content" style={{ maxWidth: '600px' }}>
        <Link href="/" className="btn btn-ghost btn-sm mb-md" style={{ display: 'inline-flex' }}>← Back</Link>

        <div className="text-center mb-lg">
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
          <h2><span className="gradient-text">Leaderboard</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your rank: #{playerRank}</p>
        </div>

        {/* Podium for top 3 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px', marginBottom: '32px' }}>
          {[1, 0, 2].map(idx => {
            const entry = entries[idx];
            if (!entry) return null;
            const isPlayer = entry.name === state.playerName;
            const medals = ['🥇', '🥈', '🥉'];
            const heights = [120, 160, 100];
            const actualRank = idx === 1 ? 0 : idx === 0 ? 1 : 2;
            return (
              <div key={idx} className="card text-center" style={{
                padding: '16px 12px', minWidth: '90px',
                height: `${heights[idx]}px`, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                border: isPlayer ? '2px solid var(--accent-primary)' : undefined,
                animation: `slideUp 0.4s ease ${actualRank * 0.15}s both`,
              }}>
                <div style={{ fontSize: '1.5rem' }}>{medals[actualRank]}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>
                  {isPlayer ? '⭐ You' : entry.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {entry.stars} stars
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="card">
          {entries.map((entry, i) => {
            const isPlayer = entry.name === state.playerName;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px', borderRadius: 'var(--radius-sm)',
                background: isPlayer ? 'rgba(124,58,237,0.15)' : i % 2 === 0 ? 'var(--bg-tertiary)' : 'transparent',
                marginBottom: '2px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    #{i + 1}
                  </span>
                  <span style={{ fontWeight: isPlayer ? 700 : 500 }}>
                    {isPlayer ? `${entry.name} (You)` : entry.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--warning)' }}>⭐ {entry.stars}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Lv.{entry.levels}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
