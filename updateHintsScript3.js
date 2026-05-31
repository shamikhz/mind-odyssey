const fs = require('fs');
let file = fs.readFileSync('./src/data/levels.ts', 'utf8');

const customHints = {
  51: ["Focus on the first and last numbers.", "Try grouping numbers into smaller chunks.", "Repeat the sequence in your mind before it disappears.", "Look for any pattern or repetition.", "Recall the numbers in the exact order shown."],
  52: ["Watch the center object carefully.", "Track positions, not colors.", "Follow one object at a time.", "Notice where each object started.", "Reconstruct the original arrangement mentally."],
  53: ["Listen carefully before acting.", "Count the sounds as they play.", "Group similar tones together.", "Repeat the sequence mentally.", "Enter the sounds in the same order."],
  54: ["Observe the entire path first.", "Remember turning points.", "Focus on color transitions.", "Visualize the trail after it disappears.", "Recreate the exact route shown."],
  55: ["Compare all shapes carefully.", "Look for patterns in rows and columns.", "Count the occurrences of each shape.", "Identify what should logically be there.", "Select the shape that completes the pattern."],
  56: ["Scan one row at a time.", "Ignore symbols you've already checked.", "Compare similar-looking icons closely.", "The duplicate may be separated from its pair.", "Find the two identical symbols."],
  57: ["Focus on the outline.", "Ignore colors and textures.", "Check unique edges and corners.", "Compare proportions carefully.", "Match the object with its exact silhouette."],
  58: ["Remember the location of each card.", "Match one pair before moving on.", "Use mistakes to improve memory.", "Track revealed cards mentally.", "Clear the board with the fewest moves."],
  59: ["Watch all objects before interacting.", "Focus on subtle changes.", "Look near the edges first.", "Compare the current state with the previous one.", "Identify the object that moved."],
  60: ["Observe the entire pattern.", "Remember the corners first.", "Break the pattern into sections.", "Rebuild it piece by piece.", "Recreate the exact arrangement shown."],
  61: ["Think about filling and emptying strategically.", "You don't always need full containers.", "Use one jug to measure the other.", "Create intermediate amounts first.", "Work backward from the target quantity."],
  62: ["The fastest person should make multiple trips.", "Consider who returns with the torch.", "Pair slow people together wisely.", "Minimize wasted return trips.", "Focus on reducing total crossing time."],
  63: ["Never leave incompatible items together.", "The boat can carry only limited passengers.", "Sometimes you must bring something back.", "Think several moves ahead.", "Protect vulnerable items at all times."],
  64: ["A knight moves in an L-shape.", "Don't focus only on the destination.", "Consider intermediate positions.", "Look for the shortest route.", "Plan the entire sequence before moving."],
  65: ["Start from the source.", "Check where water should flow next.", "Corner pieces are important.", "Build the path section by section.", "Ensure every connection is complete."],
  66: ["Move blocking vehicles first.", "Create space before advancing.", "Some vehicles must move away temporarily.", "Think several moves ahead.", "Clear a direct path to the exit."],
  67: ["Remember the law of reflection.", "One mirror can change everything.", "Test different angles.", "Trace the laser path mentally.", "Guide the beam step by step to the target."],
  68: ["Start with obvious connections.", "Rotate edge pieces first.", "Build from start to finish.", "Avoid dead ends.", "Ensure every tile supports the final path."],
  69: ["Match numbers carefully.", "Look for unique values.", "Start with the most restrictive piece.", "Build outward gradually.", "Complete a valid chain from end to end."],
  70: ["Compare weights systematically.", "Use elimination.", "Every balance provides information.", "Record what you've learned.", "Deduce unknown weights logically."],
  71: ["Every row follows the same rule.", "Columns matter too.", "Check diagonal sums.", "Missing numbers affect multiple directions.", "Make all rows, columns, and diagonals equal."],
  72: ["Test simple operators first.", "Consider order of operations.", "One symbol may affect everything.", "Check both sides carefully.", "Build an equation that balances perfectly."],
  73: ["Lower levels influence upper levels.", "Look for addition patterns.", "Fill obvious gaps first.", "Verify each relationship.", "Complete the pyramid from bottom upward."],
  74: ["Prime numbers have only two factors.", "Eliminate even numbers quickly.", "Check divisibility carefully.", "Small factors reveal composites.", "Select only true prime numbers."],
  75: ["Look beyond simple addition.", "Check multiplication patterns.", "Observe alternating rules.", "Compare differences between terms.", "Discover the hidden mathematical rule."],
  76: ["Compare parts to wholes.", "Visual representations can help.", "Simplify fractions mentally.", "Equivalent fractions matter.", "Match fractions with equal values."],
  77: ["Track hours and minutes separately.", "Watch for day changes.", "Convert everything consistently.", "Double-check arithmetic.", "Calculate the exact elapsed time."],
  78: ["Binary uses only 0 and 1.", "Powers of two are important.", "Start from the highest value.", "Subtract as you build.", "Convert the number step by step."],
  79: ["Every number appears once per region.", "Check rows carefully.", "Check columns too.", "Use elimination frequently.", "Find the only valid placement."],
  80: ["Fill easy answers first.", "Use known multiplication facts.", "Watch for repeated patterns.", "Verify neighboring cells.", "Complete the grid systematically."],
  81: ["Start with the largest pieces.", "Match the outline.", "Rotate pieces mentally.", "Build major sections first.", "Use every piece without overlap."],
  82: ["Observe the center line.", "Match distances carefully.", "Every point has a counterpart.", "Check shape proportions.", "Create a perfect reflection."],
  83: ["Track visible faces.", "Imagine rotating the object.", "Corners provide clues.", "Follow face relationships.", "Find the identical orientation."],
  84: ["Consider viewing angle.", "Depth changes appearances.", "Visualize the object in 3D.", "Compare multiple perspectives.", "Identify the correct viewpoint."],
  85: ["Imagine folding along lines.", "Track shape positions.", "Consider overlapping parts.", "Visualize the final form.", "Predict the folded result accurately."],
  86: ["Look beyond the obvious image.", "Change your focus.", "Observe negative space.", "Different perspectives reveal clues.", "Find the hidden image."],
  87: ["The maze changes with perspective.", "Rotate your viewpoint mentally.", "Some paths are misleading.", "Look for hidden connections.", "Find the true route to the goal."],
  88: ["Start from the base.", "Compare height levels.", "Observe block positions carefully.", "Recreate the framework first.", "Match the original structure exactly."],
  89: ["Focus on the outline.", "Ignore missing details.", "Look for unique shapes.", "Compare proportions.", "Identify the object from its silhouette."],
  90: ["Look between the shapes.", "Empty space contains clues.", "Change your visual focus.", "Observe hidden outlines.", "Find the symbol concealed in the gaps."],
  91: ["Stay calm under pressure.", "Ignore distractions.", "Prioritize accuracy over speed.", "Scan systematically.", "Tap only the correct targets."],
  92: ["Read carefully.", "Observe the color itself.", "The word may mislead you.", "Focus on the required rule.", "Respond using color, not text."],
  93: ["Divide attention wisely.", "Alternate focus when needed.", "Don't neglect either task.", "Keep track of progress in both.", "Balance your effort effectively."],
  94: ["Ignore unnecessary movement.", "Stay focused on the objective.", "Visual noise is intentional.", "Concentrate on important details.", "Complete the task without reacting to distractions."],
  95: ["Learn categories first.", "Speed comes after accuracy.", "Group similar items mentally.", "Develop a sorting rhythm.", "Place every item correctly and quickly."],
  96: ["Observe the timing pattern.", "Anticipate movement.", "Don't rush too early.", "Wait for the ideal moment.", "Act with precise timing."],
  97: ["Small movements matter.", "Stay centered.", "Avoid overcorrecting.", "Anticipate changes.", "Keep the object within the safe zone."],
  98: ["Choose your target immediately.", "Follow it continuously.", "Ignore decoys.", "Watch every shuffle carefully.", "Never lose sight of the target symbol."],
  99: ["Observe before acting.", "Every result is a clue.", "Test different approaches.", "Look for patterns in outcomes.", "Discover the rule through experimentation."],
  100: ["Break the challenge into smaller parts.", "Solve one section at a time.", "Use information gained from previous stages.", "Stay patient and organized.", "Combine logic, memory, focus, and strategy to succeed."]
};

let modified = false;

// We match hints array, no matter how many elements it has
const levelRegex = /id:\s*(\d+),\s*name:\s*"([^"]+)"[\s\S]*?hints:\s*\[([\s\S]*?)\]/g;

file = file.replace(levelRegex, (match, idStr, name, currentHints) => {
  const id = parseInt(idStr, 10);
  if (id >= 51 && id <= 100) {
    const newHints = customHints[id];
    if (newHints) {
      // Escape quotes
      const mapped = newHints.map(h => '"' + h.replace(/"/g, '\\"') + '"');
      const replacement = `hints: [${mapped.join(', ')}]`;
      modified = true;
      return match.replace(/hints:\s*\[[\s\S]*?\]/, replacement);
    }
  }
  return match;
});

if (modified) {
  fs.writeFileSync('./src/data/levels.ts', file);
  console.log('Successfully applied USERs custom 5-hint lists for levels 51-100!');
} else {
  console.log('No modifications were made.');
}
