'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { getLevelById, levels } from '@/data/levels';
import { useTimer } from '@/hooks/useGameHooks';
import confetti from 'canvas-confetti';

// Lazy-loaded puzzle components
const puzzleComponents: Record<string, React.LazyExoticComponent<React.ComponentType<PuzzleComponentProps>>> = {
  'odd-one-out': lazy(() => import('@/components/puzzles/OddOneOut')),
  'sequence': lazy(() => import('@/components/puzzles/Sequence')),
  'true-false': lazy(() => import('@/components/puzzles/TrueFalse')),
  'syllogism': lazy(() => import('@/components/puzzles/Syllogism')),
  'river-crossing': lazy(() => import('@/components/puzzles/RiverCrossing')),
  'tower-of-hanoi': lazy(() => import('@/components/puzzles/TowerOfHanoi')),
  'logic-grid': lazy(() => import('@/components/puzzles/LogicGrid')),
  'balancing-scale': lazy(() => import('@/components/puzzles/BalancingScale')),
  'light-switch': lazy(() => import('@/components/puzzles/LightSwitch')),
  'knights-knaves': lazy(() => import('@/components/puzzles/KnightsKnaves')),
  'tower-of-hanoi-5': lazy(() => import('@/components/puzzles/TowerOfHanoi5')),
  'einstein-riddle': lazy(() => import('@/components/puzzles/EinsteinRiddle')),
  'memory-match-4': lazy(() => import('@/components/puzzles/MemoryMatch')),
  'simon-says': lazy(() => import('@/components/puzzles/SimonSays')),
  'remember-order': lazy(() => import('@/components/puzzles/RememberOrder')),
  'memory-match-8': lazy(() => import('@/components/puzzles/MemoryMatch8')),
  'spot-change': lazy(() => import('@/components/puzzles/SpotChange')),
  'number-recall': lazy(() => import('@/components/puzzles/NumberRecall')),
  'pattern-recall': lazy(() => import('@/components/puzzles/PatternRecall')),
  'word-chain': lazy(() => import('@/components/puzzles/WordChain')),
  'memory-match-12': lazy(() => import('@/components/puzzles/MemoryMatch12')),
  'sequential-memory': lazy(() => import('@/components/puzzles/SequentialMemory')),
  'face-name': lazy(() => import('@/components/puzzles/FaceName')),
  'memory-palace': lazy(() => import('@/components/puzzles/MemoryPalace')),
  'spot-difference-easy': lazy(() => import('@/components/puzzles/SpotDifference')),
  'color-mixing': lazy(() => import('@/components/puzzles/ColorMixing')),
  'tangram-easy': lazy(() => import('@/components/puzzles/TangramEasy')),
  'anagram': lazy(() => import('@/components/puzzles/Anagram')),
  'rebus': lazy(() => import('@/components/puzzles/Rebus')),
  'connect-dots': lazy(() => import('@/components/puzzles/ConnectDots')),
  'cryptogram': lazy(() => import('@/components/puzzles/Cryptogram')),
  'nonogram-5': lazy(() => import('@/components/puzzles/Nonogram5')),
  'spot-difference-hard': lazy(() => import('@/components/puzzles/SpotDifferenceHard')),
  'tangram-hard': lazy(() => import('@/components/puzzles/TangramHard')),
  'nonogram-10': lazy(() => import('@/components/puzzles/Nonogram10')),
  'lateral-thinking': lazy(() => import('@/components/puzzles/LateralThinking')),
  'maze-easy': lazy(() => import('@/components/puzzles/MazeEasy')),
  'sliding-3': lazy(() => import('@/components/puzzles/SlidingPuzzle')),
  'minesweeper-easy': lazy(() => import('@/components/puzzles/MinesweeperEasy')),
  'water-jug': lazy(() => import('@/components/puzzles/WaterJug')),
  'pathfinder': lazy(() => import('@/components/puzzles/PathFinder')),
  'nqueens-4': lazy(() => import('@/components/puzzles/NQueens4')),
  'sliding-4': lazy(() => import('@/components/puzzles/SlidingPuzzle4')),
  'sudoku-easy': lazy(() => import('@/components/puzzles/SudokuEasy')),
  'maze-hard': lazy(() => import('@/components/puzzles/MazeHard')),
  'minesweeper-hard': lazy(() => import('@/components/puzzles/MinesweeperHard')),
  'nqueens-8': lazy(() => import('@/components/puzzles/NQueens8')),
  'sudoku-hard': lazy(() => import('@/components/puzzles/SudokuHard')),
  'hybrid-challenge': lazy(() => import('@/components/puzzles/HybridChallenge')),
  'final-challenge': lazy(() => import('@/components/puzzles/FinalChallenge')),
};

export interface PuzzleComponentProps {
  onComplete: () => void;
  onReset: () => void;
  difficulty: number;
}

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = Number(params.id);
  const level = getLevelById(levelId);
  const { state, dispatch, isLevelUnlocked } = useGame();
  const timer = useTimer();

  const [completed, setCompleted] = useState(false);
  const [stars, setStars] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [hintsUsedThisLevel, setHintsUsedThisLevel] = useState(0);
  const [shownHints, setShownHints] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (level && !completed) timer.start();
    return () => timer.stop();
  }, [level, completed]);

  // Redirect if level doesn't exist or is locked
  useEffect(() => {
    if (!level || !isLevelUnlocked(levelId)) {
      router.push('/levels');
    }
  }, [level, levelId, isLevelUnlocked, router]);

  const calculateStars = useCallback((timeTaken: number): number => {
    if (!level) return 1;
    if (hintsUsedThisLevel === 0 && timeTaken <= level.parTime) return 3;
    if (hintsUsedThisLevel <= 1 && timeTaken <= level.parTime * 1.5) return 2;
    return 1;
  }, [level, hintsUsedThisLevel]);

  const handleComplete = useCallback(() => {
    timer.stop();
    const earned = calculateStars(timer.seconds);
    setStars(earned);
    setCompleted(true);
    dispatch({
      type: 'COMPLETE_LEVEL',
      levelId,
      stars: earned,
      time: timer.seconds,
      hintsUsed: hintsUsedThisLevel,
    });
    // Confetti!
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'] });
    setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } }), 300);
  }, [timer, calculateStars, dispatch, levelId, hintsUsedThisLevel]);

  const handleUseHint = () => {
    if (state.hintsRemaining <= 0 || !level || hintIndex >= level.hints.length) return;
    dispatch({ type: 'USE_HINT' });
    const hint = level.hints[hintIndex];
    setCurrentHint(hint);
    setShownHints(prev => [...prev, hint]);
    setHintIndex(prev => prev + 1);
    setHintsUsedThisLevel(prev => prev + 1);
    setShowHintModal(false);
  };

  const handleWatchAd = () => {
    setShowAdModal(true);
    setAdCountdown(5);
    const interval = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          dispatch({ type: 'ADD_HINT' });
          setShowAdModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    timer.reset();
    timer.start();
    setCompleted(false);
    setStars(0);
    setCurrentHint(null);
    setHintIndex(0);
    setHintsUsedThisLevel(0);
    setShownHints([]);
    setResetKey(prev => prev + 1);
  };

  const handleShare = async () => {
    const text = `🧠 Mind Odyssey - Level ${levelId}: ${level?.name}\n${'⭐'.repeat(stars)} in ${timer.format(timer.seconds)}\nCan you beat my score?`;
    const nav = (globalThis as any).navigator;
    
    if (nav && nav.share) {
      try { await nav.share({ title: 'Mind Odyssey', text }); } catch {}
    } else if (nav && nav.clipboard) {
      await nav.clipboard.writeText(text);
      (globalThis as any).alert('Result copied to clipboard!');
    }
  };

  if (!level) return null;

  const PuzzleComponent = puzzleComponents[level.puzzleKey];
  const hasNextLevel = levelId < 50;
  const categoryIcon = level.category === 'logic' ? '🧠' : level.category === 'memory' ? '🎯' : level.category === 'creativity' ? '🎨' : '🏆';

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div className="top-bar">
        <Link href="/levels" className="btn btn-ghost btn-sm">← Back</Link>
        <div className="top-bar-item">
          <span>{categoryIcon}</span>
          <span style={{ fontWeight: 700 }}>Lv.{levelId}</span>
        </div>
        <div className="top-bar-item">
          <span>💡</span>
          <span>{state.hintsRemaining}</span>
        </div>
        <div className="top-bar-item">
          <span>⏱️</span>
          <span style={{ fontFamily: 'monospace' }}>{timer.formatted}</span>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="text-center">
          <h3 style={{ marginBottom: '4px' }}>{level.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{level.instruction}</p>
        </div>

        {/* Active Hints */}
        {shownHints.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            {shownHints.map((h, i) => (
              <p key={i} style={{ color: 'var(--warning)', fontSize: '0.85rem', marginBottom: i < shownHints.length - 1 ? '4px' : 0 }}>
                💡 Hint {i + 1}: {h}
              </p>
            ))}
          </div>
        )}

        <div className="puzzle-area" style={{ flex: 1 }}>
          <Suspense fallback={<div className="loading-spinner" />}>
            {PuzzleComponent && (
              <PuzzleComponent key={resetKey} onComplete={handleComplete} onReset={handleReset} difficulty={level.difficulty} />
            )}
          </Suspense>
        </div>
      </div>

      {/* Bottom Bar */}
      {!completed && (
        <div className="flex-col">
          {/* Adsterra Footer Banner Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid var(--border)' }}>
            <div style={{ width: '320px', height: '50px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ADSTERRA BANNER (320x50)
            </div>
          </div>
          <div className="bottom-bar">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowHintModal(true)} disabled={state.hintsRemaining <= 0}>
              💡 Hint ({state.hintsRemaining})
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleWatchAd}>
              📺 Ad (+1💡)
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      {/* ─── Hint Modal ─── */}
      {showHintModal && (
        <div className="modal-overlay" onClick={() => setShowHintModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💡</div>
            <h3 className="mb-sm">Need a Hint?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              This hint costs 1 point. You have {state.hintsRemaining} remaining.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleUseHint} disabled={state.hintsRemaining <= 0 || hintIndex >= level.hints.length}>
                Use Hint (-1💡)
              </button>
              <button className="btn btn-secondary" onClick={() => { setShowHintModal(false); handleWatchAd(); }}>
                Watch Ad (+1💡)
              </button>
              <button className="btn btn-ghost" onClick={() => setShowHintModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Ad Modal ─── */}
      {showAdModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: 0, overflow: 'hidden', position: 'relative', maxWidth: '300px' }}>
            {/* Ad Container */}
            <div style={{ width: '300px', height: '250px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
              <div className="flex-col gap-sm">
                <div style={{ fontSize: '2rem' }}>📺</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adsterra Ad Displaying...</p>
              </div>
            </div>

            {/* Top Right Countdown Overlay */}
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px', 
              background: 'rgba(0,0,0,0.7)', 
              backdropFilter: 'blur(4px)',
              color: 'white', 
              borderRadius: '50%', 
              width: '38px', 
              height: '38px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 10
            }}>
              {adCountdown}
            </div>

            {/* Reward Progress Bar (Optional, thin at bottom) */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${((5 - adCountdown) / 5) * 100}%`, transition: 'width 1s linear' }} />
            </div>
          </div>
        </div>
      )}

      {/* ─── Level Complete Modal ─── */}
      {completed && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ fontSize: '3rem', marginBottom: '8px', animation: 'starPop 0.5s ease' }}>🎉</div>
            <h2 className="mb-sm"><span className="gradient-text">Level Complete!</span></h2>

            <div style={{ fontSize: '2rem', margin: '12px 0' }}>
              {[1, 2, 3].map(i => (
                <span key={i} className={`star ${i <= stars ? 'filled animate' : 'empty'}`}
                  style={{ animationDelay: `${i * 0.2}s`, fontSize: '2rem' }}>
                  {i <= stars ? '★' : '☆'}
                </span>
              ))}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
              ⏱️ Time: {timer.format(timer.seconds)} · 💡 Hints Used: {hintsUsedThisLevel}
            </p>

            {/* Personality Insight */}
            <div style={{
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 'var(--radius-md)', padding: '14px', margin: '16px 0',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '6px' }}>
                🧬 PERSONALITY INSIGHT
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {level.insight}
              </p>
            </div>

            {/* Level Complete Adsterra Banner (Rectangular like a button) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '100%', maxWidth: '320px', height: '50px', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ADSTERRA BANNER (320x50)
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hasNextLevel && (
                <button className="btn btn-primary w-full" onClick={() => router.push(`/play/${levelId + 1}`)}>
                  Next Level →
                </button>
              )}
              <button className="btn btn-secondary w-full" onClick={handleShare}>
                📤 Share Result
              </button>
              <Link href="/levels" className="btn btn-ghost w-full">🗺️ Level Select</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
