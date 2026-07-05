'use client';

export const runtime = 'edge';

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

  'flash-number-recall': lazy(() => import('@/components/puzzles/FlashNumberRecall')),
  'moving-object-memory': lazy(() => import('@/components/puzzles/MovingObjectMemory')),
  'sound-sequence-recall': lazy(() => import('@/components/puzzles/SoundSequenceRecall')),
  'color-trail': lazy(() => import('@/components/puzzles/ColorTrail')),
  'missing-shape': lazy(() => import('@/components/puzzles/MissingShape')),
  'duplicate-symbol-hunt': lazy(() => import('@/components/puzzles/DuplicateSymbolHunt')),
  'shadow-matching': lazy(() => import('@/components/puzzles/ShadowMatching')),
  'memory-flip-advanced': lazy(() => import('@/components/puzzles/MemoryFlipAdvanced')),
  'spot-movement': lazy(() => import('@/components/puzzles/SpotMovement')),
  'pattern-flash-recall': lazy(() => import('@/components/puzzles/PatternFlashRecall')),
  'water-jug-hard': lazy(() => import('@/components/puzzles/WaterJugHard')),
  'bridge-crossing': lazy(() => import('@/components/puzzles/BridgeCrossing')),
  'wolf-goat-cabbage': lazy(() => import('@/components/puzzles/WolfGoatCabbage')),
  'chess-knight-path': lazy(() => import('@/components/puzzles/ChessKnightPath')),
  'rotate-pipes': lazy(() => import('@/components/puzzles/RotatePipes')),
  'traffic-jam': lazy(() => import('@/components/puzzles/TrafficJam')),
  'laser-reflection': lazy(() => import('@/components/puzzles/LaserReflection')),
  'tile-rotation-maze': lazy(() => import('@/components/puzzles/TileRotationMaze')),
  'domino-chain': lazy(() => import('@/components/puzzles/DominoChain')),
  'weight-balance-hard': lazy(() => import('@/components/puzzles/WeightBalanceHard')),
  'magic-square': lazy(() => import('@/components/puzzles/MagicSquare')),
  'equation-builder': lazy(() => import('@/components/puzzles/EquationBuilder')),
  'number-pyramid': lazy(() => import('@/components/puzzles/NumberPyramid')),
  'prime-number-filter': lazy(() => import('@/components/puzzles/PrimeNumberFilter')),
  'sequence-advanced': lazy(() => import('@/components/puzzles/SequenceAdvanced')),
  'fraction-puzzle': lazy(() => import('@/components/puzzles/FractionPizza')),
  'time-calculation': lazy(() => import('@/components/puzzles/ClockAngle')),
  'binary-conversion': lazy(() => import('@/components/puzzles/BinaryConversion')),
  'sudoku-irregular': lazy(() => import('@/components/puzzles/SudokuMini')),
  'multiplication-grid': lazy(() => import('@/components/puzzles/VennDiagramLogic')),
  'tangram-animal': lazy(() => import('@/components/puzzles/ColorMixing')),
  'mirror-symmetry': lazy(() => import('@/components/puzzles/ShadowRotation')),
  'cube-rotation': lazy(() => import('@/components/puzzles/TangramAnimal')),
  'perspective-puzzle': lazy(() => import('@/components/puzzles/SoundFrequencyMatch')),
  'shape-folding': lazy(() => import('@/components/puzzles/Hidden3DShape')),
  'optical-illusion': lazy(() => import('@/components/puzzles/ReflectionSymmetry')),
  'perspective-maze': lazy(() => import('@/components/puzzles/PerspectiveShift')),
  'build-structure': lazy(() => import('@/components/puzzles/OrigamiFold')),
  'silhouette-guess': lazy(() => import('@/components/puzzles/ConstellationTrace')),
  'negative-space': lazy(() => import('@/components/puzzles/AbstractPatternMatch')),
  'countdown-focus': lazy(() => import('@/components/puzzles/FastClicker')),
  'color-word-conflict': lazy(() => import('@/components/puzzles/FallingObjectsCatch')),
  'multi-task-puzzle': lazy(() => import('@/components/puzzles/ColorStroopTest')),
  'distraction-resistance': lazy(() => import('@/components/puzzles/AvoidTheBombs')),
  'fast-sorting': lazy(() => import('@/components/puzzles/SimonSaysSpeed')),
  'reaction-timing': lazy(() => import('@/components/puzzles/MemoryMatrixAdvanced')),
  'focus-beam': lazy(() => import('@/components/puzzles/MathMarathon')),
  'symbol-tracking': lazy(() => import('@/components/puzzles/LogicGridFinal')),
  'hidden-rule': lazy(() => import('@/components/puzzles/StroopMathCombo')),
  'final-combo-100': lazy(() => import('@/components/puzzles/UltimateChallenge')),
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

  const handleComplete = useCallback((eOrStars?: number | any) => {
    timer.stop();
    const earned = typeof eOrStars === 'number' ? eOrStars : calculateStars(timer.seconds);
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



  const handleReset = () => {
    timer.reset();
    timer.start();
    setCompleted(false);
    setStars(0);
    // Intentionally NOT clearing hints here! If a user unlocks a hint, 
    // it should persist even if they reset the puzzle to try again.
    setResetKey(prev => prev + 1);
  };

  const handleShare = async () => {
    const text = `🧠 Mind Odyssey - Level ${levelId}: ${level?.name}\n${'⭐'.repeat(stars || 0)} in ${timer.format(timer.seconds)}\nCan you beat my score?`;
    const nav = (globalThis as any).navigator;
    
    try {
      if (nav && nav.share && (globalThis as any).isSecureContext) {
        await nav.share({ title: 'Mind Odyssey', text });
      } else if (nav && nav.clipboard && (globalThis as any).isSecureContext) {
        await nav.clipboard.writeText(text);
        (globalThis as any).alert('Result copied to clipboard!');
      } else {
        // Fallback for non-secure contexts (e.g. testing on LAN without HTTPS)
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        (globalThis as any).alert('Result copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (!level) return null;

  const PuzzleComponent = puzzleComponents[level.puzzleKey];
  const hasNextLevel = levelId < 100;
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
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)' }}>
            <h4 style={{ color: 'var(--warning)', marginBottom: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>💡</span> Unlocked Hints
            </h4>
            <div className="flex-col gap-sm">
              {shownHints.map((h, i) => (
                <div key={i} style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--warning)' }}>Hint {i + 1}:</strong> {h}
                </div>
              ))}
            </div>
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

          <div className="bottom-bar">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowHintModal(true)} disabled={hintIndex >= level.hints.length}>
              💡 Hint ({state.hintsRemaining})
            </button>

            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              🔄 Reset
            </button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleComplete(0)}>
              ⏭️ Skip
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
            {hintIndex >= level.hints.length ? (
              <p style={{ color: 'var(--success)', marginBottom: '20px' }}>
                You have already unlocked all available hints for this level!
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                This hint costs 1 point. You have {state.hintsRemaining} remaining.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleUseHint} disabled={state.hintsRemaining <= 0 || hintIndex >= level.hints.length}>
                Use Hint (-1💡)
              </button>

              <button className="btn btn-ghost" onClick={() => setShowHintModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}



      {/* ─── Level Complete Modal ─── */}
      {completed && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '4px', animation: 'starPop 0.5s ease', lineHeight: 1 }}>🎉</div>
            <h2 className="mb-sm" style={{ fontSize: '1.5rem', margin: '4px 0' }}><span className="gradient-text">Level Complete!</span></h2>

            <div style={{ fontSize: '1.75rem', margin: '8px 0' }}>
              {[1, 2, 3].map(i => (
                <span key={i} className={`star ${i <= stars ? 'filled animate' : 'empty'}`}
                  style={{ animationDelay: `${i * 0.2}s`, fontSize: '2rem' }}>
                  {i <= stars ? '★' : '☆'}
                </span>
              ))}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>
              ⏱️ Time: {timer.format(timer.seconds)} · 💡 Hints Used: {hintsUsedThisLevel}
            </p>

            {/* Personality Insight */}
            <div style={{
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 'var(--radius-md)', padding: '10px', margin: '10px 0',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '4px' }}>
                🧬 PERSONALITY INSIGHT
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {level.insight}
              </p>
            </div>



            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
