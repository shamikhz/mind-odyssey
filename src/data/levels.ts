/* ──────────────────────────────────────────────
   50 Level Definitions
   ────────────────────────────────────────────── */

import { Level } from '@/types/game';
import { personalityInsights } from './personalityInsights';

export const levels: Level[] = [
  // ═══════════════════════════════════════════
  // LOGIC PUZZLES (1-12)
  // ═══════════════════════════════════════════
  {
    id: 1, name: "Odd One Out", description: "Find the item that doesn't belong",
    instruction: "Tap the item that doesn't fit the pattern.",
    category: 'logic', difficulty: 1, parTime: 30, puzzleKey: 'odd-one-out',
    hints: ["Look at the shapes carefully", "Focus on the number of sides", "The circle is different from the rest"],
    insight: personalityInsights[1],
  },
  {
    id: 2, name: "Complete the Sequence", description: "Find the next item in the pattern",
    instruction: "Study the sequence and select what comes next.",
    category: 'logic', difficulty: 1, parTime: 45, puzzleKey: 'sequence',
    hints: ["Look at the difference between consecutive numbers", "The pattern increases by a fixed amount", "Each number increases by 3"],
    insight: personalityInsights[2],
  },
  {
    id: 3, name: "True or False Logic", description: "Evaluate logical statements",
    instruction: "Read each statement carefully and determine if it's TRUE or FALSE.",
    category: 'logic', difficulty: 1, parTime: 60, puzzleKey: 'true-false',
    hints: ["Read the statement very carefully", "Think about the exact words used", "Don't overthink — take it literally"],
    insight: personalityInsights[3],
  },
  {
    id: 4, name: "Syllogism Solver", description: "Draw logical conclusions from premises",
    instruction: "Read the premises and select the correct conclusion.",
    category: 'logic', difficulty: 2, parTime: 60, puzzleKey: 'syllogism',
    hints: ["If All A are B, then every A is definitely a B", "Chain the relationships together", "Draw a Venn diagram in your mind"],
    insight: personalityInsights[4],
  },
  {
    id: 5, name: "River Crossing", description: "Transport everyone safely across the river",
    instruction: "Move the farmer, fox, chicken, and grain across the river. Never leave the fox alone with the chicken, or the chicken with the grain.",
    category: 'logic', difficulty: 2, parTime: 120, puzzleKey: 'river-crossing',
    hints: ["Start by taking the chicken across", "After bringing something back, think about what can stay together", "The farmer must always be in the boat"],
    insight: personalityInsights[5],
  },
  {
    id: 6, name: "Tower of Hanoi", description: "Move all disks to the rightmost peg",
    instruction: "Move all 3 disks from the left peg to the right peg. You can only move one disk at a time, and no larger disk may be placed on a smaller one.",
    category: 'logic', difficulty: 2, parTime: 90, puzzleKey: 'tower-of-hanoi',
    hints: ["Move the smallest disk first", "Use the middle peg as a helper", "Think recursively: solve for 2 disks first"],
    insight: personalityInsights[6],
  },
  {
    id: 7, name: "Logic Grid", description: "Use clues to solve the grid puzzle",
    instruction: "Use the clues to determine which items belong together. Mark ✓ for matches and ✗ for eliminations.",
    category: 'logic', difficulty: 3, parTime: 180, puzzleKey: 'logic-grid',
    hints: ["Start with the most definitive clues", "Use elimination — if A is not B, mark it", "When you find a match, eliminate that option from all others"],
    insight: personalityInsights[7],
  },
  {
    id: 8, name: "Balancing Scale", description: "Find the heaviest object",
    instruction: "Use the scale to compare objects and determine which is the heaviest. Minimize the number of weighings!",
    category: 'logic', difficulty: 3, parTime: 90, puzzleKey: 'balancing-scale',
    hints: ["Start by comparing any two objects", "If they balance, the heaviest is the third", "Use process of elimination"],
    insight: personalityInsights[8],
  },
  {
    id: 9, name: "Light Switch Puzzle", description: "Turn all the lights on",
    instruction: "Each switch toggles certain lights. Find the right combination to turn ALL lights on.",
    category: 'logic', difficulty: 3, parTime: 120, puzzleKey: 'light-switch',
    hints: ["Notice which lights each switch affects", "Some switches toggle multiple lights", "Try working backwards from the goal"],
    insight: personalityInsights[9],
  },
  {
    id: 10, name: "Knights & Knaves", description: "Determine who tells the truth",
    instruction: "Knights always tell the truth. Knaves always lie. Read their statements and determine who is a Knight and who is a Knave.",
    category: 'logic', difficulty: 4, parTime: 150, puzzleKey: 'knights-knaves',
    hints: ["Assume person A is a Knight, then check consistency", "If a statement creates a contradiction, the assumption is wrong", "A Knave saying 'I am a Knight' is consistent with lying"],
    insight: personalityInsights[10],
  },
  {
    id: 11, name: "Tower of Hanoi II", description: "5-disk Tower of Hanoi challenge",
    instruction: "Move all 5 disks from the left peg to the right peg. Same rules: one disk at a time, no larger on smaller.",
    category: 'logic', difficulty: 4, parTime: 240, puzzleKey: 'tower-of-hanoi-5',
    hints: ["The minimum moves needed is 31", "Solve it layer by layer — move top 4 disks first", "Alternate moving the smallest disk every other turn"],
    insight: personalityInsights[11],
  },
  {
    id: 12, name: "Einstein's Riddle", description: "The famous logic puzzle",
    instruction: "Use the 5 clues to determine which person owns the fish. Fill in the grid completely.",
    category: 'logic', difficulty: 5, parTime: 360, puzzleKey: 'einstein-riddle',
    hints: ["Start with the clue that gives a fixed position", "Use elimination across all categories", "Build from what you know — the Norwegian lives in the first house"],
    insight: personalityInsights[12],
  },

  // ═══════════════════════════════════════════
  // MEMORY PUZZLES (13-24)
  // ═══════════════════════════════════════════
  {
    id: 13, name: "Memory Match", description: "Find all matching card pairs",
    instruction: "Flip two cards at a time. Find all 4 matching pairs!",
    category: 'memory', difficulty: 1, parTime: 45, puzzleKey: 'memory-match-4',
    hints: ["Try to remember where each symbol was", "Start from the corners", "Flip systematically — row by row"],
    insight: personalityInsights[13],
  },
  {
    id: 14, name: "Simon Says", description: "Repeat the color sequence",
    instruction: "Watch the sequence of colors, then repeat it in the same order. The sequence gets longer each round!",
    category: 'memory', difficulty: 1, parTime: 60, puzzleKey: 'simon-says',
    hints: ["Say the colors aloud as they flash", "Group colors into pairs to remember", "Focus on the new addition each round"],
    insight: personalityInsights[14],
  },
  {
    id: 15, name: "Remember the Order", description: "Memorize and recall item positions",
    instruction: "Study the items and their positions for 5 seconds. Then place them back in the correct order!",
    category: 'memory', difficulty: 2, parTime: 60, puzzleKey: 'remember-order',
    hints: ["Create a story linking the items", "Use spatial memory — associate items with positions", "Focus on the first and last items first"],
    insight: personalityInsights[15],
  },
  {
    id: 16, name: "Memory Match II", description: "8-pair card matching challenge",
    instruction: "Flip two cards at a time. Find all 8 matching pairs!",
    category: 'memory', difficulty: 2, parTime: 90, puzzleKey: 'memory-match-8',
    hints: ["Work through one section at a time", "Remember near-misses — they'll help later", "Use a systematic scanning pattern"],
    insight: personalityInsights[16],
  },
  {
    id: 17, name: "Spot the Change", description: "Detect what changed in the scene",
    instruction: "Study the image carefully. After it briefly disappears, one thing will change. Find it!",
    category: 'memory', difficulty: 2, parTime: 45, puzzleKey: 'spot-change',
    hints: ["Scan the image systematically — left to right", "Focus on colors and positions", "Look at the edges and corners"],
    insight: personalityInsights[17],
  },
  {
    id: 18, name: "Number Recall", description: "Memorize a number sequence",
    instruction: "A sequence of numbers will flash on screen. Memorize them and type them back in the correct order!",
    category: 'memory', difficulty: 3, parTime: 60, puzzleKey: 'number-recall',
    hints: ["Chunk numbers into groups of 2-3", "Repeat them mentally as they appear", "Look for patterns in the digits"],
    insight: personalityInsights[18],
  },
  {
    id: 19, name: "Pattern Recall", description: "Reproduce a grid pattern from memory",
    instruction: "A pattern will appear on the grid for 3 seconds. After it disappears, recreate it exactly!",
    category: 'memory', difficulty: 3, parTime: 45, puzzleKey: 'pattern-recall',
    hints: ["Focus on the shape the pattern makes", "Count the total number of filled cells", "Memorize row by row"],
    insight: personalityInsights[19],
  },
  {
    id: 20, name: "Word Chain Memory", description: "Remember and extend the word chain",
    instruction: "Each round adds a new word to the chain. Remember all previous words and add the new one!",
    category: 'memory', difficulty: 3, parTime: 90, puzzleKey: 'word-chain',
    hints: ["Create a visual story linking the words", "Use the first letter of each word as a mnemonic", "Repeat the chain from the beginning each round"],
    insight: personalityInsights[20],
  },
  {
    id: 21, name: "Memory Match III", description: "Expert 12-pair matching",
    instruction: "Flip two cards at a time. Find all 12 matching pairs! Focus and patience are key.",
    category: 'memory', difficulty: 4, parTime: 150, puzzleKey: 'memory-match-12',
    hints: ["Divide the grid into quadrants", "Don't rush — accuracy beats speed here", "Track unmatched cards mentally"],
    insight: personalityInsights[21],
  },
  {
    id: 22, name: "Sequential Memory", description: "Follow multi-step instructions",
    instruction: "Read the sequence of instructions carefully. Then execute them from memory in the correct order!",
    category: 'memory', difficulty: 4, parTime: 120, puzzleKey: 'sequential-memory',
    hints: ["Read all instructions before starting", "Group related actions together", "Visualize yourself performing each step"],
    insight: personalityInsights[22],
  },
  {
    id: 23, name: "Face & Name Match", description: "Associate names with faces",
    instruction: "Study the faces and their names. Then match each face to its correct name!",
    category: 'memory', difficulty: 4, parTime: 90, puzzleKey: 'face-name',
    hints: ["Find a distinctive feature for each face", "Create an association between the name and the feature", "Focus on 2-3 faces at a time"],
    insight: personalityInsights[23],
  },
  {
    id: 24, name: "Memory Palace", description: "Navigate and recall items in a space",
    instruction: "Explore the rooms and memorize the items in each location. Then answer questions about what was where!",
    category: 'memory', difficulty: 5, parTime: 180, puzzleKey: 'memory-palace',
    hints: ["Create a mental journey through the rooms", "Associate each item with its room's theme", "Use vivid imagery to strengthen associations"],
    insight: personalityInsights[24],
  },

  // ═══════════════════════════════════════════
  // CREATIVITY PUZZLES (25-36)
  // ═══════════════════════════════════════════
  {
    id: 25, name: "Spot the Difference", description: "Find differences between two images",
    instruction: "Compare the two images side by side. Find all 3 differences!",
    category: 'creativity', difficulty: 1, parTime: 60, puzzleKey: 'spot-difference-easy',
    hints: ["Check the colors carefully", "Look at small details in the background", "Compare corresponding areas systematically"],
    insight: personalityInsights[25],
  },
  {
    id: 26, name: "Color Mixing", description: "Mix colors to match the target",
    instruction: "Combine the available colors to create the exact target color. Use the sliders to mix!",
    category: 'creativity', difficulty: 1, parTime: 60, puzzleKey: 'color-mixing',
    hints: ["Red + Blue = Purple", "Red + Yellow = Orange", "Start with the primary color closest to the target"],
    insight: personalityInsights[26],
  },
  {
    id: 27, name: "Tangram", description: "Arrange shapes to form a figure",
    instruction: "Drag and rotate the shapes to fill the outline exactly. All pieces must be used!",
    category: 'creativity', difficulty: 2, parTime: 120, puzzleKey: 'tangram-easy',
    hints: ["Start with the largest pieces", "The big triangles usually form the base", "Try rotating pieces 90 degrees"],
    insight: personalityInsights[27],
  },
  {
    id: 28, name: "Anagram Solver", description: "Rearrange letters to form words",
    instruction: "Unscramble the letters to form a valid English word. Drag letters to rearrange!",
    category: 'creativity', difficulty: 2, parTime: 60, puzzleKey: 'anagram',
    hints: ["Look for common letter combinations", "Try starting with vowels", "Think of 5-letter words you know"],
    insight: personalityInsights[28],
  },
  {
    id: 29, name: "Rebus Puzzle", description: "Decode picture-word combinations",
    instruction: "Look at the images and symbols. Figure out the word or phrase they represent!",
    category: 'creativity', difficulty: 2, parTime: 90, puzzleKey: 'rebus',
    hints: ["Think about what the pictures sound like", "Position and arrangement matter", "Say each element aloud"],
    insight: personalityInsights[29],
  },
  {
    id: 30, name: "Connect the Dots", description: "Draw lines to reveal the picture",
    instruction: "Connect the numbered dots in order to reveal the hidden picture!",
    category: 'creativity', difficulty: 3, parTime: 60, puzzleKey: 'connect-dots',
    hints: ["Follow the numbers in sequence", "Start from number 1", "The picture will emerge as you connect more dots"],
    insight: personalityInsights[30],
  },
  {
    id: 31, name: "Cryptogram", description: "Decode the secret message",
    instruction: "Each letter has been replaced with another letter. Crack the code to reveal the hidden message!",
    category: 'creativity', difficulty: 3, parTime: 180, puzzleKey: 'cryptogram',
    hints: ["Start with single-letter words (I, A)", "Look for common short words (THE, AND)", "'E' is the most common letter in English"],
    insight: personalityInsights[31],
  },
  {
    id: 32, name: "Nonogram", description: "Fill the grid using number clues",
    instruction: "Use the row and column numbers to determine which cells should be filled. Create the hidden picture!",
    category: 'creativity', difficulty: 3, parTime: 180, puzzleKey: 'nonogram-5',
    hints: ["Start with rows/columns that have the largest numbers", "If a clue equals the row size, fill the entire row", "Use overlap logic for partial fills"],
    insight: personalityInsights[32],
  },
  {
    id: 33, name: "Spot the Difference II", description: "Find 7 differences under time pressure",
    instruction: "Find all 7 differences between the two scenes. Watch the clock!",
    category: 'creativity', difficulty: 3, parTime: 90, puzzleKey: 'spot-difference-hard',
    hints: ["Scan in a grid pattern", "Look for color changes, missing items, and size changes", "Check the corners and edges"],
    insight: personalityInsights[33],
  },
  {
    id: 34, name: "Tangram II", description: "Advanced shape arrangement",
    instruction: "Arrange all tangram pieces to fill the complex outline. All 7 pieces must fit perfectly!",
    category: 'creativity', difficulty: 4, parTime: 180, puzzleKey: 'tangram-hard',
    hints: ["The outline may have unexpected orientations", "Try flipping pieces as well as rotating", "Look for right-angle corners to anchor pieces"],
    insight: personalityInsights[34],
  },
  {
    id: 35, name: "Nonogram II", description: "10×10 pixel art puzzle",
    instruction: "Solve the larger 10×10 nonogram to reveal a pixel-art image!",
    category: 'creativity', difficulty: 4, parTime: 300, puzzleKey: 'nonogram-10',
    hints: ["Work on rows and columns with the most clue numbers first", "Cross-reference between rows and columns", "Mark cells you know are empty with an X"],
    insight: personalityInsights[35],
  },
  {
    id: 36, name: "Lateral Thinking", description: "Think outside the box",
    instruction: "Read the riddle carefully. The answer requires creative, non-obvious thinking!",
    category: 'creativity', difficulty: 5, parTime: 120, puzzleKey: 'lateral-thinking',
    hints: ["Don't take the riddle literally", "Consider alternative meanings of words", "The simplest answer is often correct"],
    insight: personalityInsights[36],
  },

  // ═══════════════════════════════════════════
  // STRATEGY PUZZLES (37-50)
  // ═══════════════════════════════════════════
  {
    id: 37, name: "Maze Runner", description: "Navigate through the maze",
    instruction: "Find a path from START to FINISH. Use arrow keys or swipe to navigate!",
    category: 'strategy', difficulty: 2, parTime: 60, puzzleKey: 'maze-easy',
    hints: ["Try following the right wall", "Look for dead ends and avoid them", "Plan your route before moving"],
    insight: personalityInsights[37],
  },
  {
    id: 38, name: "Sliding Puzzle", description: "Rearrange tiles to form the image",
    instruction: "Slide the tiles to arrange them in the correct order (1-8). Click a tile next to the empty space to move it.",
    category: 'strategy', difficulty: 2, parTime: 120, puzzleKey: 'sliding-3',
    hints: ["Solve the top row first", "Then fix the left column", "Work on the bottom-right corner last"],
    insight: personalityInsights[38],
  },
  {
    id: 39, name: "Minesweeper", description: "Clear the field without hitting mines",
    instruction: "Click cells to reveal them. Numbers show how many adjacent mines exist. Right-click to flag suspected mines!",
    category: 'strategy', difficulty: 2, parTime: 120, puzzleKey: 'minesweeper-easy',
    hints: ["Start from the corners", "If a number matches its unrevealed neighbors, they're all mines", "If a number matches its flagged neighbors, remaining are safe"],
    insight: personalityInsights[39],
  },
  {
    id: 40, name: "Water Jug Problem", description: "Measure exact amounts with two jugs",
    instruction: "You have a 5L and a 3L jug. Measure exactly 4 liters! Fill, empty, or pour between jugs.",
    category: 'strategy', difficulty: 3, parTime: 120, puzzleKey: 'water-jug',
    hints: ["Fill the 5L jug first", "Pour from 5L into 3L — 2L remains in the 5L jug", "Empty the 3L, pour the 2L into it, then refill the 5L"],
    insight: personalityInsights[40],
  },
  {
    id: 41, name: "Path Finder", description: "Find the shortest path",
    instruction: "Navigate from the green start to the red finish. Each cell has a movement cost. Find the path with the lowest total cost!",
    category: 'strategy', difficulty: 3, parTime: 120, puzzleKey: 'pathfinder',
    hints: ["Lower numbers mean cheaper paths", "Sometimes a longer route costs less", "Add up costs as you go"],
    insight: personalityInsights[41],
  },
  {
    id: 42, name: "N-Queens", description: "Place 4 queens on a 4×4 board",
    instruction: "Place 4 queens on the board so that no two queens can attack each other (same row, column, or diagonal).",
    category: 'strategy', difficulty: 3, parTime: 120, puzzleKey: 'nqueens-4',
    hints: ["No two queens can share a row", "Try placing queens from left to right", "Only place one queen per column"],
    insight: personalityInsights[42],
  },
  {
    id: 43, name: "Sliding Puzzle II", description: "4×4 tile challenge",
    instruction: "Slide the tiles to arrange them 1-15 in order. Harder than it looks!",
    category: 'strategy', difficulty: 4, parTime: 240, puzzleKey: 'sliding-4',
    hints: ["Solve the first row and column first", "Use cycles to move pieces without disturbing solved areas", "Work systematically — don't rush"],
    insight: personalityInsights[43],
  },
  {
    id: 44, name: "Sudoku", description: "Fill the 9×9 grid with numbers",
    instruction: "Place numbers 1-9 in each row, column, and 3×3 box. No repeats allowed!",
    category: 'strategy', difficulty: 4, parTime: 300, puzzleKey: 'sudoku-easy',
    hints: ["Start with rows or columns that have the most numbers", "Use elimination — what numbers are missing?", "Check 3×3 boxes for single possibilities"],
    insight: personalityInsights[44],
  },
  {
    id: 45, name: "Maze Runner II", description: "Complex multi-path maze",
    instruction: "Navigate a challenging maze with multiple paths and dead ends. Find the exit!",
    category: 'strategy', difficulty: 4, parTime: 120, puzzleKey: 'maze-hard',
    hints: ["Use left-hand rule as a backup strategy", "Look for the widest corridors — they often lead forward", "Backtrack efficiently when you hit dead ends"],
    insight: personalityInsights[45],
  },
  {
    id: 46, name: "Minesweeper II", description: "Expert mine field",
    instruction: "Clear the large mine field. More mines, bigger grid, higher stakes!",
    category: 'strategy', difficulty: 4, parTime: 240, puzzleKey: 'minesweeper-hard',
    hints: ["Work from known safe areas outward", "Use probability when stuck", "Flag mines to help count remaining threats"],
    insight: personalityInsights[46],
  },
  {
    id: 47, name: "N-Queens II", description: "8 queens on 8×8 board",
    instruction: "Place 8 queens on a full chessboard so none threaten each other. There are 92 solutions!",
    category: 'strategy', difficulty: 5, parTime: 300, puzzleKey: 'nqueens-8',
    hints: ["Try a1, b5, c8, d6 as starting positions", "If stuck, backtrack to the last queen placed", "Visualize diagonals as you place each queen"],
    insight: personalityInsights[47],
  },
  {
    id: 48, name: "Sudoku II", description: "Expert 9×9 Sudoku",
    instruction: "A harder Sudoku with fewer starting numbers. Use advanced techniques!",
    category: 'strategy', difficulty: 5, parTime: 480, puzzleKey: 'sudoku-hard',
    hints: ["Look for naked pairs and hidden singles", "Use pencil marks to track possibilities", "Scan for pointing pairs in boxes"],
    insight: personalityInsights[48],
  },
  {
    id: 49, name: "Multi-Step Hybrid", description: "Logic + Memory + Strategy combined",
    instruction: "This challenge combines multiple skill types. Solve the logic puzzle, memorize the key, then use it strategically!",
    category: 'strategy', difficulty: 5, parTime: 300, puzzleKey: 'hybrid-challenge',
    hints: ["Complete each phase before moving to the next", "The logic phase gives you information for the memory phase", "The strategy phase requires both previous answers"],
    insight: personalityInsights[49],
  },
  {
    id: 50, name: "The Final Challenge", description: "Master puzzle — all skills required",
    instruction: "The ultimate Mind Odyssey test. Combine logic, memory, creativity, and strategy to solve the grand finale!",
    category: 'strategy', difficulty: 5, parTime: 420, puzzleKey: 'final-challenge',
    hints: ["Read all instructions before starting", "Break the problem into its component skills", "Trust your training from all 49 previous levels"],
    insight: personalityInsights[50],
  },
];

export const getCategoryLevels = (category: string) =>
  levels.filter(l => l.category === category);

export const getLevelById = (id: number) =>
  levels.find(l => l.id === id);
