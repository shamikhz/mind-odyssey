const fs = require('fs');
let file = fs.readFileSync('./src/data/levels.ts', 'utf8');

const customHints = {
  51: ["Look for alternating addition and subtraction.", "Calculate the difference between adjacent numbers.", "The pattern repeats every two steps."],
  52: ["Assign a color or name to each object.", "Don't blink while they are shuffling!", "Focus on the center of the screen to track multiple objects in your peripheral vision."],
  53: ["Try to map the pitches to high, medium, and low.", "Sing the notes back in your head.", "Group the notes into pairs."],
  54: ["Trace the path with your finger as it flashes.", "Memorize the shape of the path, like an 'L' or a 'Z'.", "Focus on the turns rather than the straight lines."],
  55: ["Count how many of each shape exist initially.", "Group shapes by color in your memory.", "Scan the grid methodically from top to bottom."],
  56: ["Scan row by row, like reading a book.", "Look for distinct colors that stick out.", "Divide the grid into 4 quadrants and check each one."],
  57: ["Look at the sharpest corners of the shadow.", "Pay attention to the rotation angle.", "Match the overall silhouette before checking the fine details."],
  58: ["Watch the animation loop carefully.", "Say what the animation is doing out loud.", "Find pairs by motion type (spinning, bouncing, etc)."],
  59: ["Keep your eyes fixed on the center of the screen.", "Look for a brief flicker or shift in position.", "The object that moves usually shifts only a few pixels."],
  60: ["Visualize the pattern as a letter or a number.", "Memorize the negative space (the empty squares).", "Break the grid into a 2x2 section and memorize that first."],
  61: ["You can pour water back into the infinite source.", "Try to reach exactly 1 liter in the small jug first.", "Keep transferring from the small jug to the big jug."],
  62: ["Send the two slowest people across together.", "You must send a fast person back with the torch.", "The 1-minute and 2-minute people should go first."],
  63: ["The goat cannot be left alone with the cabbage.", "You might need to bring an item back to the starting side.", "Take the most 'dangerous' item across first."],
  64: ["A knight moves in an 'L' shape: 2 squares in one direction, 1 square perpendicular.", "Work backwards from the target square.", "The knight always changes square color (light to dark) on every move."],
  65: ["Start from the endpoints (source and drain).", "Corner pipes must turn the flow 90 degrees.", "Ensure there are no open leaks before finishing."],
  66: ["The target car can only move horizontally.", "Clear the vertical cars blocking the path first.", "You may need to move cars backward to create space."],
  67: ["Angle of incidence equals angle of reflection.", "Work backwards from the target receiver.", "Use the 45-degree mirrors to make 90-degree turns."],
  68: ["Make sure the path connects continuously from start to finish.", "Avoid pointing paths into solid walls.", "Count the number of exits on each tile."],
  69: ["Adjacent domino halves must have the same number of pips.", "Start with the dominoes that have only one possible placement.", "Count the total number of each pip value used."],
  70: ["Use the scale to find which objects are equal.", "If A > B and B > C, then A > C.", "Substitute known weights to find the unknown ones."],
  71: ["The sum of every row, column, and diagonal must be exactly the same.", "Start by calculating the target sum using the fully completed row.", "The center square is often the average of the numbers."],
  72: ["Remember PEMDAS: Multiplication and Division happen before Addition and Subtraction.", "Look at the target number to decide if you need to multiply or divide.", "Try placing the equals sign first."],
  73: ["Each block is the sum of the two blocks directly beneath it.", "Work your way up from the bottom row.", "If you know the top and one bottom, subtract to find the other."],
  74: ["A prime number is only divisible by 1 and itself.", "Quick tip: 2, 3, 5, 7, 11, 13, 17, 19 are primes.", "Any even number greater than 2 is NOT prime."],
  75: ["The sequence might involve squaring or cubing numbers.", "Look for a pattern in the differences between the numbers.", "It might be a combination of two alternating sequences."],
  76: ["Count the total number of slices to find the denominator.", "1/2 is the same as 2/4 or 4/8.", "Add the slices visually to reach the target fraction."],
  77: ["The minute hand moves 6 degrees per minute.", "The hour hand moves 0.5 degrees per minute.", "Calculate their absolute positions from 12:00, then subtract them."],
  78: ["The rightmost bit is worth 1, the next is 2, then 4, 8, 16.", "A '1' means the value is added, a '0' means it is ignored.", "Add up all the values where there is a '1'."],
  79: ["Each row, column, and block must contain unique numbers.", "Scan for rows or columns that are only missing one number.", "Use 'crosshatching' to eliminate rows and columns for a specific number."],
  80: ["The overlapping section must satisfy BOTH conditions.", "Items outside the circles satisfy NEITHER condition.", "Read the labels of the circles carefully before placing."],
  81: ["Red + Yellow = Orange. Blue + Yellow = Green.", "Red + Blue = Purple. All three make Brown/Black.", "Analyze the target color to guess its primary components."],
  82: ["Imagine the object rotating in 3D space.", "Pay attention to asymmetric features.", "Does the shadow stretch or compress based on the angle?"],
  83: ["The two large triangles usually form the body.", "The square and parallelogram are often used for the head or tail.", "Make sure no pieces overlap."],
  84: ["A higher pitch means a tighter, more frequent wave.", "A louder volume means a taller wave (amplitude).", "Match the peaks and valleys perfectly."],
  85: ["Think about what the object looks like from the top vs the side.", "A cylinder looks like a circle from above, but a rectangle from the side.", "Imagine cutting the shape in half."],
  86: ["The line of symmetry acts like a mirror.", "Points further from the mirror line reflect further away.", "Check the left and right sides for perfect balance."],
  87: ["What looks like a dead end might be an open path from another angle.", "Follow the lines to their vanishing point.", "Try mentally rotating the entire structure."],
  88: ["Keep track of where the colored side goes.", "A fold halves the area and doubles the thickness.", "Unfold mentally step-by-step backwards."],
  89: ["Look for the longest straight line first.", "Count the number of vertices in the target shape.", "Use process of elimination if multiple stars are close."],
  90: ["Focus on one specific element of the pattern first.", "Look for rotations or reflections in the sequence.", "Determine if the pattern is additive or subtractive."],
  91: ["Keep your cursor near the center of the screen.", "Anticipate where the next target will appear.", "Don't rush so much that you misclick—accuracy counts."],
  92: ["Focus your eyes halfway up the screen to see objects earlier.", "Prioritize catching fast-falling objects first.", "Avoid sudden erratic movements to dodge bombs."],
  93: ["Read the INK COLOR, ignore the word itself.", "Try blurring your eyes slightly so you can't read the text.", "Say the ink color out loud to override your reading reflex."],
  94: ["Memorize the pattern as a geometric shape.", "Tap the safe squares in a specific order.", "Don't panic—take a second to recall before tapping."],
  95: ["Assign a number (1-4) to each color in your head.", "Tap out the rhythm of the sequence with your fingers.", "Focus only on the new color added at the end."],
  96: ["Group the highlighted squares into blocks.", "Visualize a picture or letter formed by the squares.", "Focus on the empty spaces instead if there are fewer of them."],
  97: ["Solve the easy parts of the equation instantly.", "Keep a running total in your head.", "Don't let a mistake derail your momentum."],
  98: ["Use the process of elimination relentlessly.", "If a clue says 'A is next to B', mark 'A is not B'.", "Cross-reference clues to unlock hidden deductions."],
  99: ["Focus on the math first, then check the color rule.", "Take it one step at a time.", "Don't let the flashing colors distract you from the numbers."],
  100: ["Breathe. Stay calm.", "Rely on the skills you've built over the last 99 levels.", "Take it one phase at a time and don't rush the final step."]
};

let modified = false;

const levelRegex = /id:\s*(\d+),\s*name:\s*"([^"]+)"[\s\S]*?hints:\s*\[(.*?)\]/g;

file = file.replace(levelRegex, (match, idStr, name, currentHints) => {
  const id = parseInt(idStr, 10);
  if (id >= 51 && id <= 100) {
    const newHints = customHints[id];
    if (newHints) {
      // Escape any quotes in hints
      const h0 = newHints[0].replace(/"/g, '\\"');
      const h1 = newHints[1].replace(/"/g, '\\"');
      const h2 = newHints[2].replace(/"/g, '\\"');
      const replacement = `hints: ["${h0}", "${h1}", "${h2}"]`;
      modified = true;
      return match.replace(/hints:\s*\[.*?\]/, replacement);
    }
  }
  return match;
});

if (modified) {
  fs.writeFileSync('./src/data/levels.ts', file);
  console.log('Successfully applied highly customized hints for levels 51-100!');
} else {
  console.log('No modifications were made.');
}
