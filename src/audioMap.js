/* =========================================================================
   AUDIO MAP — every narrated line in the module.
   Content policy: ONLY paragraph text, guidance, and questions are narrated.
   Titles, headings and section labels are NEVER narrated.

   Each entry:  id -> { text (exact words spoken), style, file (static mp3) }
   Static mp3s are produced by:  npm run audio     (scripts/generate_audio.js)
   ========================================================================= */
import { PRACTICE_QUESTIONS } from './practiceQuestions.js';

export const AUDIO_MAP = {
  /* ---------------- Phase 1 · Wonder ---------------- */
  wonder_1: {
    text: "Leo and Mia put a mystery box on a balance scale. Half of its weight, plus a 3 kilogram block, exactly balances an 11 kilogram weight. How heavy is the mystery box? How can we solve equations with fractions without getting tangled up?",
    style: "question",
    file: "/assets/audio/wonder_1.mp3"
  },

  /* ---------------- Phase 2 · Story ---------------- */
  story_1: {
    text: "Mia runs a science fair booth with a balance scale. A mystery box of weight x sits on one side. An equation is like a balance: both sides must always stay equal. Whatever we do to one side, we must do to the other!",
    style: "statement",
    file: "/assets/audio/story_1.mp3"
  },
  story_2: {
    text: "A fraction bar is a hidden division sign. The term x over 3 means x divided by 3, which is one of three equal slices of x. The term 2 x over 3 means 2 x divided by 3, which is two of those three slices.",
    style: "emphasis",
    file: "/assets/audio/story_2.mp3"
  },
  story_3: {
    text: "To solve x over 4 equals 5, we undo the division with its inverse operation, multiplication. Multiply both sides by 4 and the 4s cancel, leaving x equals 20. Always do the same thing to both sides!",
    style: "statement",
    file: "/assets/audio/story_3.mp3"
  },
  story_4: {
    text: "Sometimes a fraction multiplies x, like 3 x over 5 equals 12. Multiply both sides by the reciprocal, 5 over 3. A fraction times its reciprocal equals 1, so x is left all alone, and x equals 20!",
    style: "celebration",
    file: "/assets/audio/story_4.mp3"
  },
  story_5: {
    text: "When an equation has several fractions, clear them first! Find the lowest common denominator, the LCD, then multiply every term on both sides by it. For x over 2 plus x over 3 equals 10, the LCD is 6.",
    style: "emphasis",
    file: "/assets/audio/story_5.mp3"
  },
  story_6: {
    text: "Undo the operations in reverse order, like unwrapping a gift. For x over 2 plus 3 equals 11, first subtract 3 from both sides. Then multiply both sides by 2 to get x equals 16. Mia's mystery box weighs 16 kilograms!",
    style: "emphasis",
    file: "/assets/audio/story_6.mp3"
  },
  story_7: {
    text: "When x appears on both sides, clear the fractions with the LCD, then collect the x terms on one side. For x over 3 plus 4 equals x over 2 minus 1, multiply every term by 6 to get 2 x plus 24 equals 3 x minus 6. So x equals 30!",
    style: "encouragement",
    file: "/assets/audio/story_7.mp3"
  },
  story_8: {
    text: "Awesome job! You can keep a scale balanced, flip reciprocals, clear fractions with the LCD, and check your answers. Now step into the lab to balance scales, clear fractions, and hunt down mistakes!",
    style: "celebration",
    file: "/assets/audio/story_8.mp3"
  },

  /* ---------------- Phase 3 · Simulate (stations) ---------------- */
  sim_1: {
    text: "Welcome to Mia's Balance Lab! Pick an operation and a number, then apply it to both sides. Keep the scale level and get x all alone!",
    style: "encouragement",
    file: "/assets/audio/sim_1.mp3"
  },
  sim_2: {
    text: "In the Solve It Workshop, you are on your own. Clear the fractions with the LCD, put the solution steps in order, and hunt for the balance point!",
    style: "statement",
    file: "/assets/audio/sim_2.mp3"
  },
  sim_3: {
    text: "Welcome to the Detective Desk! Catch the mistake, turn words into an equation, and run a number machine backwards. Can you crack every case?",
    style: "question",
    file: "/assets/audio/sim_3.mp3"
  },

  /* ---------------- Phase 3 · Simulate (Activity Guidance) ---------------- */
  sim_1_1: {
    text: "Activity 1: Mia's Mineral Specimen Crate. Mia partitioned her crystal crate into 4 equal sample trays. One tray balances a 5 kilogram certified brass weight: x over 4 equals 5. Multiply both sides by 4 to find the crate's total mass x!",
    style: "instruction",
    file: "/assets/audio/sim_1_1.mp3"
  },
  sim_1_2: {
    text: "Activity 2: Leo's Solar Rover Power Core. Leo tests 3 of the 5 modular cells on the scale, balancing 12 kilograms of counterweights: 3 x over 5 equals 12. Multiply both sides by the reciprocal, 5 over 3, to find the full battery mass x!",
    style: "instruction",
    file: "/assets/audio/sim_1_2.mp3"
  },
  sim_1_3: {
    text: "Activity 3: The Mystery Gift Box Challenge. Half of Mia's wrapped experiment kit plus a 3 kilogram block balances an 11 kilogram certified weight: x over 2 plus 3 equals 11. Subtract 3 first, then multiply by 2 to unwrap the kit's true mass!",
    style: "instruction",
    file: "/assets/audio/sim_1_3.mp3"
  },
  sim_2_1: {
    text: "Activity 1: Hydration Punch. Mia and Leo mix half a jug and one-third of a jug into a 10-liter dispenser vat: x over 2 plus x over 3 equals 10. Click the magic wand with the lowest common denominator, 6, to clear the fractions!",
    style: "instruction",
    file: "/assets/audio/sim_2_1.mp3"
  },
  sim_2_2: {
    text: "Activity 2: Robotic Arm Track Calibration. Leo's automated arm travels 2 thirds of the track minus a 1-meter safety buffer: 2 x over 3 minus 1 equals 5 meters. Drag and order the 4 calibration steps from first to last!",
    style: "instruction",
    file: "/assets/audio/sim_2_2.mp3"
  },
  sim_2_3: {
    text: "Activity 3: Competing Solar Scales. Rig A measures x over 3 plus 4 kilograms, while Rig B measures x over 2 minus 1 kilograms. Drag the slider until both scales register the exact same weight to find the balance point!",
    style: "instruction",
    file: "/assets/audio/sim_2_3.mp3"
  },
  sim_3_1: {
    text: "Activity 1: 3D Printer Logbook Mistake. A helper logged: one-fourth of print time x plus 2 calibration hours equals 7 hours: x over 4 plus 2 equals 7. Inspect the logbook and click the step where the blunder occurred!",
    style: "instruction",
    file: "/assets/audio/sim_3_1.mp3"
  },
  sim_3_2: {
    text: "Activity 2: Science Booth Supply Budget. Sam sets aside one-fourth of his weekly allowance and adds 3 dollars from recycling to get 10 dollars: x over 4 plus 3 equals 10. Undo the operations to calculate Sam's total allowance!",
    style: "instruction",
    file: "/assets/audio/sim_3_2.mp3"
  },
  sim_3_3: {
    text: "Activity 3: Botanical Chemical Synthesiser. The synthesiser takes x liters, extracts two-thirds, then vents 1 liter of waste to yield 7 liters. Reverse each operation step-by-step to recover the starting volume x!",
    style: "instruction",
    file: "/assets/audio/sim_3_3.mp3"
  },

  /* ---------------- Phase 5 · Reflect ---------------- */
  reflect_1: {
    text: "Great work completing the module! In your own words, explain how to solve an equation with fractions, and show an example.",
    style: "thinking",
    file: "/assets/audio/reflect_1.mp3"
  },

  /* ---------------- Feedback lines (short reactions) ---------------- */
  fx_correct_1: { text: "Correct! Excellent equation solving!", style: "celebration", file: "/assets/audio/fx_correct_1.mp3" },
  fx_correct_2: { text: "Yes! You kept it perfectly balanced!", style: "celebration", file: "/assets/audio/fx_correct_2.mp3" },
  fx_correct_3: { text: "Brilliant! That is exactly right!", style: "celebration", file: "/assets/audio/fx_correct_3.mp3" },
  fx_wrong_1: { text: "Not quite! Read the solution and try the next one.", style: "encouragement", file: "/assets/audio/fx_wrong_1.mp3" },
  fx_wrong_2: { text: "Almost! Remember, do the same thing to both sides.", style: "encouragement", file: "/assets/audio/fx_wrong_2.mp3" },
  fx_tilt: { text: "Oh no, the scale tipped! Whatever you do to one side, you must do to the other.", style: "encouragement", file: "/assets/audio/fx_tilt.mp3" },
  fx_balanced: { text: "Balanced! You solved it and kept both sides equal. Great work!", style: "celebration", file: "/assets/audio/fx_balanced.mp3" },
  fx_wand: { text: "Whoosh! The magic wand cleared all the fractions!", style: "celebration", file: "/assets/audio/fx_wand.mp3" },
  fx_try_again: { text: "Not yet. Have another look and try again.", style: "encouragement", file: "/assets/audio/fx_try_again.mp3" },
  fx_complete: { text: "Outstanding reflection! Lesson complete!", style: "celebration", file: "/assets/audio/fx_complete.mp3" }
};

// Add all 100 practice questions and hints
for (const q of PRACTICE_QUESTIONS) {
  AUDIO_MAP[`${q.id}_question`] = {
    text: q.spokenPrompt,
    style: "question",
    file: q.questionAudio
  };
  AUDIO_MAP[`${q.id}_hint`] = {
    text: q.spokenHint,
    style: "thinking",
    file: q.hintAudio
  };
}

/** exact-text -> static file lookup (same shape as the pipeline's audioMap) */
export const audioMap = Object.fromEntries(
  Object.values(AUDIO_MAP).map(seg => [seg.text, seg.file])
);
