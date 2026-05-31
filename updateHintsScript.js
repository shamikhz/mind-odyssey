const fs = require('fs');
let file = fs.readFileSync('./src/data/levels.ts', 'utf8');

function generateHints(name) {
  const n = name.toLowerCase();
  
  if (n.includes('sudoku')) return ['Look for rows with only a few missing numbers.', 'Use the process of elimination in the 3x3 grids.', 'Check if a number can only go in one specific spot.'];
  if (n.includes('fraction')) return ['Remember that a fraction represents parts of a whole.', 'Try simplifying the fractions if possible.', 'Visualize the fractions as slices of a pie.'];
  if (n.includes('binary')) return ['Binary is base-2. Each digit represents a power of 2.', 'Read from right to left: 1, 2, 4, 8, 16...', 'If the number is odd, the rightmost digit must be 1.'];
  if (n.includes('tangram') || n.includes('shape')) return ['Try rotating the pieces to see if they fit differently.', 'Focus on the corners and edges first.', 'Look at the negative space between shapes.'];
  if (n.includes('maze') || n.includes('path')) return ['Try tracing the path backwards from the exit.', 'Look for dead ends and eliminate those routes.', 'Keep track of the overall direction you need to go.'];
  if (n.includes('memory') || n.includes('recall') || n.includes('sequence') || n.includes('flash')) return ['Try creating a story or pattern to remember the sequence.', 'Focus on a small chunk first before the whole picture.', 'Repeat the items in your head immediately after seeing them.'];
  if (n.includes('logic') || n.includes('grid')) return ['Read the clues very carefully. Every word matters.', 'Use a grid to mark what is definitely true and definitely false.', 'If A is B, and B is C, then A must be C.'];
  if (n.includes('math') || n.includes('equation') || n.includes('calculation')) return ['Remember the order of operations (PEMDAS).', 'Try estimating the answer first to check if you are close.', 'Break the problem down into smaller, easier steps.'];
  if (n.includes('color') || n.includes('stroop')) return ['Think about primary and secondary colors.', 'Red + Blue = Purple, Yellow + Blue = Green, Red + Yellow = Orange.', 'Look at the contrast between the background and foreground.'];
  if (n.includes('time') || n.includes('clock')) return ['A clock face is 360 degrees. Each minute is 6 degrees.', 'The hour hand moves slowly as the minute hand turns.', 'Calculate the positions of both hands relative to 12.'];
  if (n.includes('speed') || n.includes('fast') || n.includes('timing') || n.includes('countdown') || n.includes('catch') || n.includes('traffic')) return ['Stay calm and do not panic as the timer ticks down.', 'Accuracy is often more important than pure speed.', 'Anticipate the next move before the current one finishes.'];
  if (n.includes('shadow') || n.includes('perspective') || n.includes('illusion') || n.includes('symmetry')) return ['Change your angle. What looks like a circle might be a cylinder.', 'Focus on the light source and how it casts the shadow.', 'Do not trust your initial assumption. Look deeper.'];
  if (n.includes('jug') || n.includes('water')) return ['You can empty a jug completely to start fresh.', 'Fill the larger jug first, then pour into the smaller one.', 'Pouring from one to another is key to getting odd amounts.'];
  
  return ['Take your time to observe the pattern carefully.', 'Try a different perspective or approach if you are stuck.', 'Focus on the key elements and eliminate incorrect options.'];
}

let modified = false;

// Regex to match the object block of a level
const levelRegex = /id:\s*(\d+),\s*name:\s*"([^"]+)"[\s\S]*?hints:\s*\[(.*?)\]/g;

file = file.replace(levelRegex, (match, idStr, name, currentHints) => {
  const id = parseInt(idStr, 10);
  // Unconditionally replace hints for levels 51-100
  if (id >= 51 && id <= 100) {
    const newHints = generateHints(name);
    const replacement = `hints: ["${newHints[0]}", "${newHints[1]}", "${newHints[2]}"]`;
    modified = true;
    return match.replace(/hints:\s*\[.*?\]/, replacement);
  }
  return match;
});

if (modified) {
  fs.writeFileSync('./src/data/levels.ts', file);
  console.log('Successfully updated hints for levels 51-100');
} else {
  console.log('No hints needed updating');
}
