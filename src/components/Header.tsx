'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, Download, LogOut, Trophy } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useGame } from '@/contexts/GameContext';

export default function Header() {
  const { isInstallable, install } = usePWA();
  const { state, dispatch } = useGame();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/register
    let name = formData.name;
    if (authMode === 'login' && !name) {
      name = formData.email.split('@')[0] || 'Player One';
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    const user = { 
      name: name || 'Explorer', 
      email: formData.email || 'player@example.com' 
    };
    dispatch({ type: 'LOGIN', user });
    setShowAuthModal(false);
    router.push('/');
    // Reset
    setFormData({ name: '', email: '', password: '' });
  };

  const handleGoogleLogin = () => {
    dispatch({ type: 'LOGIN', user: { name: 'Player One', email: 'google@example.com' } });
    setShowAuthModal(false);
    router.push('/');
  };

  return (
    <header className="top-bar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
      <div className="top-bar-item">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🧠</span>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }} className="gradient-text">
            Mind Odyssey
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isInstallable && (
          <button className="btn btn-secondary btn-sm" onClick={install} style={{ padding: '8px 12px', gap: '6px' }}>
            <Download size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Install</span>
          </button>
        )}
        
        {state.user.isLoggedIn ? (
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowDropdown(!showDropdown)} style={{ padding: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                {state.user.name ? state.user.name[0].toUpperCase() : 'P'}
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
                <Link href="/profile" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                  <User size={18} /> Profile
                </Link>
                <Link href="/leaderboard" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                  <Trophy size={18} /> Leaderboard
                </Link>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--danger)' }} onClick={() => { dispatch({ type: 'LOGOUT' }); setShowDropdown(false); }}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAuthModal(true)}>
            Login / Register
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', margin: 'auto' }}>
            <h3 className="mb-sm" style={{ fontSize: '1.4rem' }}>{authMode === 'login' ? 'Welcome Back!' : 'Join the Odyssey'}</h3>
            <p className="mb-md" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {authMode === 'login' ? 'Login to continue your brain training journey.' : 'Create an account to track your progress.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="flex-col gap-sm">
              {authMode === 'register' && (
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="input-field" 
                    placeholder="Enter your name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
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
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-sm" style={{ padding: '12px' }}>
                {authMode === 'login' ? 'Login' : 'Create Account'}
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

              <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  {authMode === 'login' ? 'Register Now' : 'Login Here'}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
