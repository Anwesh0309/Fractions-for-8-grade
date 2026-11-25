import React, { useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    narrate(AUDIO_MAP.wonder_1, !muted);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-2xl glass-card max-h-[calc(100dvh-5.5rem)] overflow-y-auto custom-scrollbar flex flex-col items-center text-center fade-in-up z-20 my-auto p-4 sm:p-6 gap-2 sm:gap-3">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder mb-1 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl sm:text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
          <button
            type="button"
            onClick={() => narrate(AUDIO_MAP.wonder_1, true)}
            title="Replay narration"
            className="ml-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-900/60 hover:bg-purple-800 text-amber-300 border border-amber-400/40 text-xs font-bold shadow hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <span>🔊</span>
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        <h2 className="font-display font-900 text-purple-200 text-[clamp(1.25rem,2.8vh+0.4vw,2.2rem)] leading-tight max-w-xl shrink-0">
          What Is Hiding Inside the Mystery Box?
        </h2>

        {/* Feature Stat Box */}
        <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center shadow-xl shrink-0">
          <div className="text-amber-300 font-display font-900 text-[clamp(1.4rem,3.5vh+0.4vw,2.6rem)] mb-1">
            Half a Box + 3 = 11!
          </div>
          <p className="text-slate-200 text-[clamp(0.85rem,1.4vh+0.2vw,1.05rem)] max-w-lg leading-relaxed font-bold">
            Leo and Mia put a mystery box on a balance scale. Half of its weight, plus a 3 kg block, exactly balances an <span className="text-amber-300 font-bold">11 kg weight</span>. How heavy is the box?
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-2.5 bg-[#14082c]/80 border border-purple-500/30 rounded-full px-4 sm:px-5 py-1.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
            🤖
          </div>
          <p className="text-slate-300 text-[clamp(0.75rem,1.3vh,0.9rem)] font-semibold text-left">
            How can we solve equations with fractions without getting tangled up?
          </p>
        </div>

        <button onClick={onNext} className="btn-gold flex items-center gap-2 shrink-0 mt-1">
          <span>Explore the Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
