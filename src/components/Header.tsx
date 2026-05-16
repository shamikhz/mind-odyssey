'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, Download, LogOut, Trophy } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useGame } from '@/contexts/GameContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { isInstallable, install } = usePWA();
  const { state, dispatch, showAuthModal, setShowAuthModal } = useGame();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = React.useState(false);
  const [showShop, setShowShop] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = (e.target as any);
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInData.user) {
        dispatch({
          type: 'LOGIN',
          user: {
            id: signInData.user.id,
            name: signInData.user.user_metadata?.full_name || signInData.user.email?.split('@')[0] || 'Player One',
            email: signInData.user.email || ''
          }
        });
        setShowAuthModal(false);
        router.push('/');
        setFormData({ name: '', email: '', password: '' });
        return;
      }

      // If sign in failed, try to sign up (the user might not exist)
      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name || formData.email.split('@')[0],
            }
          }
        });

        if (signUpError) {
          // If sign up fails with "User already registered", it means the password was wrong for the existing user
          if (signUpError.message === 'User already registered') {
            throw new Error('Invalid email or password');
          }
          throw signUpError;
        }

        if (signUpData.user) {
          dispatch({
            type: 'LOGIN',
            user: {
              id: signUpData.user.id,
              name: formData.name || signUpData.user.email?.split('@')[0] || 'Explorer',
              email: signUpData.user.email || ''
            }
          });
          setShowAuthModal(false);
          router.push('/');
          setFormData({ name: '', email: '', password: '' });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: (globalThis as any).location?.origin || ''
      }
    });
    if (error) setError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
    setShowDropdown(false);
  };

  return (
    <header className="top-bar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
      <div className="top-bar-item" style={{ gap: '12px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🧠</span>
          <span style={{ fontWeight: 800, letterSpacing: '0.5px' }} className="gradient-text logo-text">
            Mind Odyssey
          </span>
        </Link>
        {isInstallable && (
          <button className="btn btn-secondary btn-sm mobile-install-btn" onClick={install} style={{ padding: '6px 10px', gap: '4px' }}>
            <Download size={14} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Install</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isInstallable && (
          <button className="btn btn-secondary btn-sm desktop-install-btn" onClick={install} style={{ padding: '8px 12px', gap: '6px' }}>
            <Download size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Install</span>
          </button>
        )}

        {state.user.isLoggedIn ? (
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowDropdown(!showDropdown)} style={{ padding: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, overflow: 'hidden' }}>
                {state.user.avatar ? (
                  <img src={state.user.avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{state.user.name ? state.user.name[0].toUpperCase() : 'P'}</span>
                )}
              </div>
            </button>

            {showDropdown && (
              <div className="card" style={{ position: 'absolute', top: '100%', right: 0, width: '220px', marginTop: '10px', padding: '8px', zIndex: 101, animation: 'slideDown 0.2s ease' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {state.user.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {state.user.email}
                  </p>
                </div>
                {showShop ? (
                  <div style={{ padding: '4px' }}>
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '8px', color: 'var(--accent-primary)' }} onClick={() => setShowShop(false)}>
                      ← Back to Menu
                    </button>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', padding: '0 8px 8px' }}>Select a Hint Pack:</p>
                    <button className="btn btn-secondary btn-sm w-full mb-xs" style={{ justifyContent: 'space-between', padding: '12px' }} onClick={() => { dispatch({ type: 'BUY_HINTS', count: 5 }); setShowDropdown(false); setShowShop(false); }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💡 5 Hints</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>₹10</span>
                    </button>
                    <button className="btn btn-secondary btn-sm w-full mb-xs" style={{ justifyContent: 'space-between', padding: '12px' }} onClick={() => { dispatch({ type: 'BUY_HINTS', count: 20 }); setShowDropdown(false); setShowShop(false); }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💡 20 Hints</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>₹35</span>
                    </button>
                    <button className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'space-between', padding: '12px' }} onClick={() => { dispatch({ type: 'BUY_HINTS', count: 100 }); setShowDropdown(false); setShowShop(false); }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💡 100 Hints</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>₹150</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/profile" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                      <User size={18} /> Profile
                    </Link>
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => { setShowDropdown(false); setShowComingSoon(true); }}>
                      <Trophy size={18} /> Leaderboard
                    </button>
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--warning)' }} onClick={() => setShowShop(true)}>
                      <span style={{ fontSize: '18px' }}>💡</span> Buy Hints
                    </button>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--danger)' }} onClick={handleLogout}>
                      <LogOut size={18} /> Log Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAuthModal(true)}>
            Sign In
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', margin: 'auto' }}>
            <h3 className="mb-sm" style={{ fontSize: '1.4rem' }}>Welcome to the Odyssey</h3>
            <p className="mb-md" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Enter your details to continue your brain training journey.
            </p>

            <form onSubmit={handleAuthSubmit} className="flex-col gap-sm">
              {error && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'left', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Full Name (Optional)</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-sm" style={{ padding: '12px' }} disabled={loading}>
                {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : 'Continue'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
              </div>

              <button type="button" className="btn btn-secondary w-full" onClick={handleGoogleLogin} style={{ justifyContent: 'center', gap: '10px', padding: '10px', fontSize: '0.9rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: '16px' }} />
                Continue with Google
              </button>

            </form>
          </div>
        </div>
      )}
      {/* Coming Soon Alert */}
      {showComingSoon && (
        <div className="modal-overlay" onClick={() => setShowComingSoon(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '320px', width: '90%', margin: 'auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏆</div>
            <h3 className="mb-sm">Coming Soon!</h3>
            <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
              The Global Leaderboard is currently under development. Stay tuned!
            </p>
            <button className="btn btn-primary w-full" onClick={() => setShowComingSoon(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
