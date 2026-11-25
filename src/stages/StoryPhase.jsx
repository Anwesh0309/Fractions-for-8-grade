import React, { useState, useEffect, useRef } from 'react';
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
  const onSlideChangeRef = useRef(onSlideChange);

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  // Notify parent of slide change
  useEffect(() => {
    if (onSlideChangeRef.current) {
      onSlideChangeRef.current(slideIdx + 1, STORY_SLIDES.length);
    }
  }, [slideIdx]);

  // Play narration whenever slideIdx or muted changes
  useEffect(() => {
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, !muted);
    }
    return () => {
      stopNarration();
    };
  }, [slideIdx, muted]);

  const replayAudio = () => {
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, true);
    }
  };

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
    <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 md:p-5 relative overflow-hidden select-none z-10 w-full max-w-6xl mx-auto">
      <BgSymbols />

      {/* Main Story Card with Expanded Height & Generous Layout */}
      <div className="w-full min-h-[480px] md:min-h-[540px] lg:min-h-[580px] max-h-[calc(100dvh-5.5rem)] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 items-center fade-in-up z-20 overflow-y-auto custom-scrollbar my-auto">
        {/* Left Column: Expanded High-Quality Illustration Viewer */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-400/40 bg-gradient-to-br from-[#1a0a38] via-[#0d0422] to-[#160533] h-64 sm:h-80 md:h-full min-h-[280px] sm:min-h-[350px] md:min-h-[460px] lg:min-h-[500px] w-full group">
          {/* Subtle backdrop radiant glow */}
          <div className="absolute inset-0 bg-radial from-amber-400/10 via-purple-600/10 to-transparent pointer-events-none" />
          
          {/* Story Scene Badge */}
          <div className="absolute top-3 left-3 bg-[#0d0322]/85 backdrop-blur-md border border-amber-400/50 text-amber-300 font-display font-extrabold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Story Scene {slide.id} of {STORY_SLIDES.length}</span>
          </div>

          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-contain p-2 sm:p-3 rounded-2xl transition-all duration-700 group-hover:scale-[1.02] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Right Column: Fluid Narrative, Prominent Typography & Interactive Pills */}
        <div className="md:col-span-6 flex flex-col justify-between h-full gap-3 sm:gap-4 py-1 text-left">
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {/* Header Tag Badge & Audio Replay Button */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem] sm:text-xs uppercase font-black tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/40 px-3 py-0.5 rounded-full">
                  Grade 8 Math Quest
                </span>
                <span className="text-purple-300/70 text-xs font-semibold">
                  Interactive Storyline
                </span>
              </div>

              {/* Speaker Narration Replay Button */}
              <button
                type="button"
                onClick={replayAudio}
                title="Listen to slide narration"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/70 hover:bg-purple-800 text-amber-300 border border-amber-400/50 hover:border-amber-300 text-xs font-black shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <span className="text-sm">🔊</span>
                <span className="hidden sm:inline">Replay Audio</span>
              </button>
            </div>

            {/* Slide Title */}
            <h2 className="font-display font-900 text-2xl sm:text-3xl lg:text-4xl text-amber-400 leading-tight drop-shadow-md">
              {slide.title}
            </h2>

            {/* Body Narrative */}
            <div className="text-slate-100 text-base sm:text-lg lg:text-[1.12rem] leading-relaxed font-semibold bg-purple-950/50 rounded-2xl p-4 sm:p-5 border border-white/10 shadow-inner">
              <MathText text={slide.body} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Pull-Quote Sparkle Pill */}
            <div className="w-full bg-gradient-to-r from-amber-500/15 via-purple-900/60 to-amber-500/15 border-2 border-amber-400/60 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-center text-amber-300 font-display font-900 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 shadow-lg">
              <span className="shrink-0 text-base sm:text-xl text-amber-400">✨</span>
              <span className="leading-snug">&ldquo;<MathText text={slide.quote} />&rdquo;</span>
              <span className="shrink-0 text-base sm:text-xl text-amber-400">✨</span>
            </div>

            {/* Mascot Speech Bubble Pill */}
            <div className="flex items-center gap-3 w-full bg-white/95 rounded-2xl p-2.5 sm:p-3 shadow-xl border-2 border-amber-400/60">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0 ring-2 ring-amber-300/80">
                🦁
              </div>
              <div className="text-[#0c031d] font-display font-black text-xs sm:text-sm lg:text-base flex-1 text-left leading-snug">
                {slide.bubble}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-5xl flex items-center justify-between mt-2.5 sm:mt-3.5 z-20 shrink-0 px-2 sm:px-4">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border border-white/30 text-white font-display font-900 text-xs sm:text-sm px-6 sm:px-8 py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 bg-black/40 px-3 sm:px-4 py-1.5 rounded-full border border-white/10">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-3.5 h-3.5 bg-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.9)] scale-110'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-xs sm:text-sm px-6 sm:px-8 py-2.5 font-900 flex items-center gap-1.5 shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
