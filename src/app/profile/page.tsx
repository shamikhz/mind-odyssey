'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { personalityInsights } from '@/data/personalityInsights';

const skillCategories = [
  { key: 'logic', label: 'Logic', icon: '🧠', color: '#a78bfa' },
  { key: 'memory', label: 'Memory', icon: '🎯', color: '#22d3ee' },
  { key: 'creativity', label: 'Creativity', icon: '🎨', color: '#fbbf24' },
  { key: 'strategy', label: 'Strategy', icon: '🏆', color: '#34d399' },
];

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function ProfilePage() {
  const { state, getLevelsCleared, getTotalStars, getCategoryScore, dispatch } = useGame();
  const [editName, setEditName] = useState(state.playerName);
  const [avatar, setAvatar] = useState(state.user?.avatar || '');
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync with global state if it changes
  React.useEffect(() => {
    setEditName(state.playerName);
    setAvatar(state.user?.avatar || '');
  }, [state.playerName, state.user?.avatar]);

  const handleReset = async () => {
    setLoading(true);
    try {
      // Just reset local state
      dispatch({ type: 'RESET_PROGRESS' });
      setShowReset(false);
    } catch (err: any) {
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      dispatch({ type: 'UPDATE_PROFILE', updates: { name: editName, avatar } });
      dispatch({ type: 'SET_PLAYER_NAME', name: editName });
      setShowUpdateSuccess(true);
      setTimeout(() => setShowUpdateSuccess(false), 3000);
    } catch (err: any) {
      (globalThis as any).alert('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as any).files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64
        (globalThis as any).alert('Image size should be less than 1MB');
        return;
      }
      const reader = new (globalThis as any).FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page" style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center', gap: '24px', maxWidth: '100vw', overflowX: 'hidden' }}>
      <div className="page-content" style={{ maxWidth: '900px', flex: 1, padding: '0 16px' }}>
        <Link href="/" className="btn btn-ghost btn-sm mb-md" style={{ display: 'inline-flex' }}>← Back</Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

          {/* Left Column: Stats */}
          <div className="flex-col gap-lg">
            <div className="card text-center" style={{ padding: '32px' }}>
              <div
                onClick={() => (fileInputRef.current as any)?.click()}
                style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'var(--accent-gradient)', margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 800, color: 'white',
                  cursor: 'pointer', overflow: 'hidden', position: 'relative',
                  border: '4px solid var(--bg-tertiary)',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{state.playerName ? state.playerName[0].toUpperCase() : 'P'}</span>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', fontSize: '0.65rem', padding: '4px 0', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Change
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <h2><span className="gradient-text">{state.playerName}</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Explorer</p>
            </div>

            <div className="card">
              <h3 className="mb-md">🧠 Skill Breakdown</h3>
              {skillCategories.map(cat => {
                const score = getCategoryScore(cat.key);
                return (
                  <div key={cat.key} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{cat.icon} {cat.label}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 className="mb-md">📊 Lifetime Stats</h3>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.5rem' }}>{getLevelsCleared()}</div>
                  <div className="stat-label">Levels</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.5rem' }}>{getTotalStars()}</div>
                  <div className="stat-label">Stars</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.5rem' }}>{state.hintsRemaining}</div>
                  <div className="stat-label">Hints</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.2rem' }}>{formatTime(state.totalTimePlayed)}</div>
                  <div className="stat-label">Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Cognitive */}
          <div className="flex-col gap-lg">
            <div className="card">
              <h3 className="mb-md">⚙️ Settings</h3>
              <form onSubmit={handleUpdateProfile} className="flex-col gap-md">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName((e.target as any).value)}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-sm" disabled={loading}>
                  {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : 'Update Profile'}
                </button>
                {showUpdateSuccess && <p style={{ color: 'var(--success)', fontSize: '0.85rem', textAlign: 'center' }}>✅ Profile updated!</p>}
              </form>
            </div>

            <div className="card">
              <h3 className="mb-md">🧬 Detailed Cognitive Profile</h3>
              {getLevelsCleared() > 0 ? (
                (() => {
                  const categoriesData = skillCategories.map(cat => ({
                    ...cat,
                    score: getCategoryScore(cat.key)
                  }));
                  // Prevent empty array reduce errors
                  const highestCategory = categoriesData.reduce((prev, current) => (prev.score > current.score) ? prev : current) || categoriesData[0];
                  const lowestCategory = categoriesData.reduce((prev, current) => (prev.score < current.score) ? prev : current) || categoriesData[0];

                  return (
                    <div className="flex-col gap-md">
                      <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          1. Core Strength {highestCategory.icon}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          Your primary cognitive dominance lies in <strong>{highestCategory.label}</strong>. You demonstrate exceptional aptitude in handling puzzles that require this skill, making it your foundational problem-solving tool.
                        </p>
                      </div>

                      <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                        <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          2. Progress Insight 📈
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {(() => {
                            const cleared = getLevelsCleared();
                            for (let i = cleared; i >= 1; i--) {
                              if (personalityInsights[i]) return personalityInsights[i];
                            }
                            return "Keep playing to unlock your cognitive profile.";
                          })()}
                        </p>
                      </div>

                      <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                        <h4 style={{ color: 'var(--warning)', marginBottom: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          3. Growth Area {lowestCategory.icon}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          To achieve a perfectly balanced mind, focus on improving your <strong>{lowestCategory.label}</strong>. Challenging yourself with these specific puzzles will yield the highest cognitive growth and brain plasticity.
                        </p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Solve your first puzzle to begin your detailed cognitive analysis.
                </p>
              )}
            </div>

            <div className="flex-col gap-md" style={{ marginTop: 'auto' }}>
              <button className="btn btn-danger w-full" onClick={() => setShowReset(true)}>
                🗑️ Reset All Progress
              </button>
            </div>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showReset && (
          <div className="modal-overlay" onClick={() => setShowReset(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
              <h3 className="mb-sm">Reset All Progress?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                This will erase all your levels, stars, and stats. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setShowReset(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleReset}>Yes, Reset</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
