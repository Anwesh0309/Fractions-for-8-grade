import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { MathText } from '../components/MathText.jsx';
import { narrate, stopNarration } from '../audio.js';

const STORY_SLIDES = [
  {
    id: 1,
    title: "Every Equation Is a Balance",
    audioKey: "story_1",
    image: "/assets/images/slide1.png",
    body: "Mia runs a science fair booth with a balance scale. A mystery box of weight x sits on one side. An equation is like a balance: both sides must always stay equal. Whatever we do to one side, we must do to the other!",
    quote: "An equation is a balance: both sides are always equal.",
    bubble: "Keep the scale level and the answer stays true!"
  },
  {
    id: 2,
    title: "Fractions Mean Division",
    audioKey: "story_2",
    image: "/assets/images/slide2.png",
    body: "A fraction bar is a hidden division sign. The term {x|3} means x ÷ 3, one of three equal slices of x. The term {2x|3} means 2x ÷ 3, which is two of those three slices.",
    quote: "{x|3} = x ÷ 3     and     {2x|3} = 2x ÷ 3",
    bubble: "A fraction bar is just a division sign in disguise!"
  },
  {
    id: 3,
    title: "Undo Division with Multiplication",
    audioKey: "story_3",
    image: "/assets/images/slide3.png",
    body: "To solve {x|4} = 5, we undo the division with its inverse operation, multiplication. Multiply both sides by 4 and the 4s cancel, leaving x = 20. Always do the same thing to both sides!",
    quote: "{x|4} = 5   →   x = 5 × 4 = 20",
    bubble: "Undo division with multiplication!"
  },
  {
    id: 4,
    title: "Reciprocals: Flip to Cancel",
    audioKey: "story_4",
    image: "/assets/images/slide4.png",
    body: "Sometimes a fraction multiplies x, like {3x|5} = 12. Multiply both sides by the reciprocal, {5|3}. A fraction times its reciprocal equals 1, so x is left all alone!",
    quote: "{3x|5} = 12   →   x = 12 × {5|3} = 20",
    bubble: "Flip the fraction to make it cancel!"
  },
  {
    id: 5,
    title: "Clear Fractions with the LCD",
    audioKey: "story_5",
    image: "/assets/images/slide5.png",
    body: "When an equation has several fractions, clear them first! Find the lowest common denominator (LCD), then multiply every term on both sides by it. For {x|2} + {x|3} = 10, the LCD is 6.",
    quote: "{x|2} + {x|3} = 10   →   3x + 2x = 60   →   x = 12",
    bubble: "The LCD is a magic wand that makes fractions vanish!"
  },
  {
    id: 6,
    title: "Two Steps: Peel the Layers",
    audioKey: "story_6",
    image: "/assets/images/slide6.png",
    body: "Undo the operations in reverse order, like unwrapping a gift. For {x|2} + 3 = 11, first subtract 3 from both sides. Then multiply both sides by 2 to get x = 16. Mia's mystery box weighs 16 kg!",
    quote: "{x|2} + 3 = 11   →   {x|2} = 8   →   x = 16",
    bubble: "Undo adding or subtracting first, then undo the fraction!"
  },
  {
    id: 7,
    title: "Fractions on Both Sides",
    audioKey: "story_7",
    image: "/assets/images/slide7.png",
    body: "When x appears on both sides, clear the fractions with the LCD, then collect the x terms on one side. For {x|3} + 4 = {x|2} − 1, multiply every term by 6 to get 2x + 24 = 3x − 6. So x = 30!",
    quote: "2x + 24 = 3x − 6   →   x = 30   ✓ both sides = 14",
    bubble: "Clear first, collect second, then check your answer!"
  },
  {
    id: 8,
    title: "Step Into the Equation Lab!",
    audioKey: "story_8",
    image: "/assets/images/slide8.png",
    body: "Awesome job! You can keep a scale balanced, flip reciprocals, clear fractions with the LCD, and check your answers. Now step into the lab to balance scales, clear fractions, and hunt down mistakes!",
    quote: "Ready to solve equations with fractions?",
    bubble: "Click below to enter the interactive lab!"
  }
];

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(slideIdx + 1, STORY_SLIDES.length);
    }
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, !muted);
    }
    return () => stopNarration();
  }, [slideIdx, muted, onSlideChange]);

  const goNext = () => {
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 relative overflow-hidden select-none z-10 w-full max-w-5xl mx-auto">
      <BgSymbols />

      {/* Main Story Card with Fluid Responsiveness & Auto-Scaling */}
      <div className="w-full max-h-[calc(100dvh-6.2rem)] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 items-center fade-in-up z-20 overflow-y-auto custom-scrollbar my-auto">
        {/* Left Column: Responsive Image Illustration */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 h-40 sm:h-52 md:h-[clamp(170px,28vh,300px)] w-full bg-black/40 flex items-center justify-center shrink-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Column: Fluid Typography & Callout Pills */}
        <div className="flex flex-col items-start text-left justify-center gap-2.5 sm:gap-3 py-1">
          {/* Slide Title */}
          <h2 className="font-display font-900 text-[clamp(1.2rem,2.5vh+0.4vw,2rem)] text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-[clamp(0.85rem,1.4vh+0.2vw,1.15rem)] leading-relaxed font-extrabold drop-shadow-sm">
            <MathText text={slide.body} />
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border border-amber-400/60 rounded-xl px-4 py-2 text-center text-amber-300 font-display font-900 text-[clamp(0.78rem,1.3vh+0.1vw,0.95rem)] flex items-center justify-center gap-2 shadow-md">
            <span className="shrink-0 text-base sm:text-lg">✨</span>
            <span className="leading-snug">&ldquo;<MathText text={slide.quote} />&rdquo;</span>
            <span className="shrink-0 text-base sm:text-lg">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-2.5 w-full">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-400 flex items-center justify-center text-xl sm:text-2xl shadow-md shrink-0">
              🦁
            </div>
            <div className="bg-white text-[#0c031d] rounded-xl px-4 py-2 font-display font-900 text-[clamp(0.75rem,1.2vh+0.1vw,0.92rem)] shadow-lg flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-1.5 sm:mt-2.5 z-20 shrink-0 px-2">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border border-white/30 text-white font-display font-900 text-xs sm:text-sm px-6 sm:px-8 py-2 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:scale-105"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.9)]'
                  : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-xs sm:text-sm px-6 sm:px-8 py-2 font-900 flex items-center gap-1.5 shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
