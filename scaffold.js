const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const puzzlesDir = path.join(srcDir, 'components', 'puzzles');
const levelsFile = path.join(srcDir, 'data', 'levels.ts');
const insightsFile = path.join(srcDir, 'data', 'personalityInsights.ts');
const pageFile = path.join(srcDir, 'app', 'play', '[id]', 'page.tsx');

const newLevelsData = [
  // Memory & Observation
  { id: 51, name: "Flash Number Recall", desc: "Show 6 numbers for 3 seconds → user recalls order.", cat: "memory", key: "flash-number-recall", comp: "FlashNumberRecall" },
  { id: 52, name: "Moving Object Memory", desc: "3 objects move around → remember original positions.", cat: "memory", key: "moving-object-memory", comp: "MovingObjectMemory" },
  { id: 53, name: "Sound Sequence Recall", desc: "Play tones → repeat same order.", cat: "memory", key: "sound-sequence-recall", comp: "SoundSequenceRecall" },
  { id: 54, name: "Color Trail", desc: "Path flashes briefly → user redraws it.", cat: "memory", key: "color-trail", comp: "ColorTrail" },
  { id: 55, name: "Missing Shape", desc: "One shape disappears → identify missing one.", cat: "memory", key: "missing-shape", comp: "MissingShape" },
  { id: 56, name: "Duplicate Symbol Hunt", desc: "Find repeated icon in crowded grid.", cat: "memory", key: "duplicate-symbol-hunt", comp: "DuplicateSymbolHunt" },
  { id: 57, name: "Shadow Matching", desc: "Match objects to correct shadows.", cat: "memory", key: "shadow-matching", comp: "ShadowMatching" },
  { id: 58, name: "Memory Flip Advanced", desc: "Match animated cards instead of static.", cat: "memory", key: "memory-flip-advanced", comp: "MemoryFlipAdvanced" },
  { id: 59, name: "Spot the Movement", desc: "Find which object slightly moves.", cat: "memory", key: "spot-movement", comp: "SpotMovement" },
  { id: 60, name: "Pattern Flash Recall", desc: "Pattern shown for 5 seconds → recreate.", cat: "memory", key: "pattern-flash-recall", comp: "PatternFlashRecall" },

  // Logic & Strategy
  { id: 61, name: "Water Jug Puzzle", desc: "Measure exact liters using two containers.", cat: "logic", key: "water-jug-hard", comp: "WaterJugHard" },
  { id: 62, name: "Bridge Crossing Puzzle", desc: "People cross bridge with one torch.", cat: "logic", key: "bridge-crossing", comp: "BridgeCrossing" },
  { id: 63, name: "Wolf-Goat-Cabbage Variant", desc: "Different objects and constraints.", cat: "logic", key: "wolf-goat-cabbage", comp: "WolfGoatCabbage" },
  { id: 64, name: "Chess Knight Path", desc: "Move knight to target in minimum moves.", cat: "logic", key: "chess-knight-path", comp: "ChessKnightPath" },
  { id: 65, name: "Rotate Pipes Puzzle", desc: "Rotate pipes to connect water flow.", cat: "logic", key: "rotate-pipes", comp: "RotatePipes" },
  { id: 66, name: "Traffic Jam Puzzle", desc: "Move vehicles to free exit car.", cat: "logic", key: "traffic-jam", comp: "TrafficJam" },
  { id: 67, name: "Laser Reflection Puzzle", desc: "Use mirrors to hit target.", cat: "logic", key: "laser-reflection", comp: "LaserReflection" },
  { id: 68, name: "Tile Rotation Maze", desc: "Rotate maze pieces to create path.", cat: "logic", key: "tile-rotation-maze", comp: "TileRotationMaze" },
  { id: 69, name: "Domino Chain Logic", desc: "Arrange dominoes to satisfy rules.", cat: "logic", key: "domino-chain", comp: "DominoChain" },
  { id: 70, name: "Weight Balance Puzzle", desc: "Balance scale using unknown weights.", cat: "logic", key: "weight-balance-hard", comp: "WeightBalanceHard" },

  // Mathematical Thinking
  { id: 71, name: "Magic Square", desc: "Arrange numbers to equal sums.", cat: "logic", key: "magic-square", comp: "MagicSquare" },
  { id: 72, name: "Equation Builder", desc: "Drag operators to solve equation.", cat: "logic", key: "equation-builder", comp: "EquationBuilder" },
  { id: 73, name: "Number Pyramid", desc: "Fill blanks using addition logic.", cat: "logic", key: "number-pyramid", comp: "NumberPyramid" },
  { id: 74, name: "Prime Number Filter", desc: "Tap all prime numbers quickly.", cat: "logic", key: "prime-number-filter", comp: "PrimeNumberFilter" },
  { id: 75, name: "Sequence Prediction Advanced", desc: "Complex mathematical progression.", cat: "logic", key: "sequence-advanced", comp: "SequenceAdvanced" },
  { id: 76, name: "Fraction Puzzle", desc: "Match visual fractions correctly.", cat: "logic", key: "fraction-puzzle", comp: "FractionPuzzle" },
  { id: 77, name: "Time Calculation Puzzle", desc: "Calculate elapsed time scenarios.", cat: "logic", key: "time-calculation", comp: "TimeCalculation" },
  { id: 78, name: "Binary Conversion Mini Game", desc: "Convert decimal to binary visually.", cat: "logic", key: "binary-conversion", comp: "BinaryConversion" },
  { id: 79, name: "Sudoku Variant", desc: "Irregular Sudoku regions.", cat: "logic", key: "sudoku-irregular", comp: "SudokuIrregular" },
  { id: 80, name: "Multiplication Grid Challenge", desc: "Complete grid under time pressure.", cat: "logic", key: "multiplication-grid", comp: "MultiplicationGrid" },

  // Creativity & Spatial Intelligence
  { id: 81, name: "Tangram Animal Builder", desc: "Create animal silhouette from pieces.", cat: "creativity", key: "tangram-animal", comp: "TangramAnimal" },
  { id: 82, name: "Mirror Symmetry Drawing", desc: "Complete symmetric side.", cat: "creativity", key: "mirror-symmetry", comp: "MirrorSymmetry" },
  { id: 83, name: "3D Cube Rotation", desc: "Find matching cube orientation.", cat: "creativity", key: "cube-rotation", comp: "CubeRotation" },
  { id: 84, name: "Perspective Puzzle", desc: "Choose correct top-view object.", cat: "creativity", key: "perspective-puzzle", comp: "PerspectivePuzzle" },
  { id: 85, name: "Shape Folding Puzzle", desc: "Predict folded paper outcome.", cat: "creativity", key: "shape-folding", comp: "ShapeFolding" },
  { id: 86, name: "Optical Illusion Challenge", desc: "Identify hidden image.", cat: "creativity", key: "optical-illusion", comp: "OpticalIllusion" },
  { id: 87, name: "Perspective Maze", desc: "Maze changes perspective dynamically.", cat: "creativity", key: "perspective-maze", comp: "PerspectiveMaze" },
  { id: 88, name: "Build the Structure", desc: "Recreate block arrangement.", cat: "creativity", key: "build-structure", comp: "BuildStructure" },
  { id: 89, name: "Silhouette Guess", desc: "Guess object from outline.", cat: "creativity", key: "silhouette-guess", comp: "SilhouetteGuess" },
  { id: 90, name: "Negative Space Puzzle", desc: "Identify hidden symbol in gaps.", cat: "creativity", key: "negative-space", comp: "NegativeSpace" },

  // Attention & Focus
  { id: 91, name: "Countdown Focus", desc: "Tap only target symbols before timer ends.", cat: "strategy", key: "countdown-focus", comp: "CountdownFocus" },
  { id: 92, name: "Color-Word Conflict", desc: "Word says “Red” but color differs.", cat: "strategy", key: "color-word-conflict", comp: "ColorWordConflict" },
  { id: 93, name: "Multi-Task Puzzle", desc: "Solve two mini-puzzles simultaneously.", cat: "strategy", key: "multi-task-puzzle", comp: "MultiTaskPuzzle" },
  { id: 94, name: "Distraction Resistance", desc: "Ignore moving distractions while solving.", cat: "strategy", key: "distraction-resistance", comp: "DistractionResistance" },
  { id: 95, name: "Fast Sorting Game", desc: "Sort shapes quickly into categories.", cat: "strategy", key: "fast-sorting", comp: "FastSorting" },
  { id: 96, name: "Reaction Timing Puzzle", desc: "Tap at perfect timing.", cat: "strategy", key: "reaction-timing", comp: "ReactionTiming" },
  { id: 97, name: "Focus Beam", desc: "Keep moving object inside zone.", cat: "strategy", key: "focus-beam", comp: "FocusBeam" },
  { id: 98, name: "Symbol Tracking", desc: "Track one object among shuffled objects.", cat: "strategy", key: "symbol-tracking", comp: "SymbolTracking" },
  { id: 99, name: "Hidden Rule Discovery", desc: "Game never explains rules — user figures them out.", cat: "strategy", key: "hidden-rule", comp: "HiddenRule" },
  { id: 100, name: "Final Combo Challenge", desc: "Combination of memory, logic, timing, strategy.", cat: "strategy", key: "final-combo-100", comp: "FinalCombo100" }
];

// 1. Create Placeholder Components
console.log("Creating placeholder components...");
for (const lvl of newLevelsData) {
  const compPath = path.join(puzzlesDir, `${lvl.comp}.tsx`);
  const content = `'use client';
import React from 'react';

interface Props { onComplete: () => void; }

export default function ${lvl.comp}({ onComplete }: Props) {
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</div>
      <h3 style={{ color: 'var(--text-primary)' }}>Level Under Construction</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        This puzzle (${lvl.name}) is being actively developed in Phase 3.
      </p>
      <button className="btn btn-primary" onClick={() => onComplete()}>
        Skip / Auto-Complete
      </button>
    </div>
  );
}
`;
  fs.writeFileSync(compPath, content);
}

// 2. Append to levels.ts
console.log("Updating levels.ts...");
let levelsContent = fs.readFileSync(levelsFile, 'utf-8');
let levelsString = newLevelsData.map(l => `
  {
    id: ${l.id}, name: "${l.name}", description: "${l.desc}",
    instruction: "Instruction for ${l.name} goes here.",
    category: '${l.cat}', difficulty: ${Math.min(5, Math.ceil((l.id - 50) / 10))}, parTime: 120, puzzleKey: '${l.key}',
    hints: ["Hint 1 for ${l.name}", "Hint 2 for ${l.name}", "Hint 3 for ${l.name}"],
    insight: personalityInsights[${l.id}],
  }`).join(',');

levelsContent = levelsContent.replace(/];\s*export const getCategoryLevels/, `,${levelsString}\n];\n\nexport const getCategoryLevels`);
fs.writeFileSync(levelsFile, levelsContent);

// 3. Append to personalityInsights.ts
console.log("Updating personalityInsights.ts...");
let insightsContent = fs.readFileSync(insightsFile, 'utf-8');
let insightsString = newLevelsData.map(l => `  ${l.id}: "Mastering ${l.name} shows advanced cognitive abilities in the ${l.cat} domain."`).join(',\n');
insightsContent = insightsContent.replace(/};\s*$/, `,\n${insightsString}\n};\n`);
fs.writeFileSync(insightsFile, insightsContent);

// 4. Update page.tsx lazy loads
console.log("Updating page.tsx...");
let pageContent = fs.readFileSync(pageFile, 'utf-8');
let lazyImports = newLevelsData.map(l => `  '${l.key}': lazy(() => import('@/components/puzzles/${l.comp}')),`).join('\n');
pageContent = pageContent.replace(/};\s*export interface PuzzleComponentProps/, `\n${lazyImports}\n};\n\nexport interface PuzzleComponentProps`);
fs.writeFileSync(pageFile, pageContent);

console.log("Done scaffolding!");
