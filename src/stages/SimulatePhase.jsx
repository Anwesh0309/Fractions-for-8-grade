import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration, speakFx } from '../audio.js';
import { MathText } from '../components/MathText.jsx';
import { BalanceScale } from '../components/BalanceScale.jsx';
import { F, lin, linMarkup, evalLin, applyOp, OP_SYMBOL, frMarkup } from '../fractions.js';

/* =========================================================================
   SIMULATION STATIONS — Grade 7/8 · Equations with Fractions
   Inspired by Real-World Science Fair, Laboratory & Workshop Scenarios
   Directly Aligned with the Story Phase (Mia, Leo & The Science Fair Lab)

   Station 1 · Mia's Balance Lab      (Live interactive scale: minerals, batteries & mystery gift)
   Station 2 · The Solve It Workshop  (Clear LCD punch mix, order robotic rail steps & hunt equilibrium)
   Station 3 · Detective Desk         (Spot 3D print log errors, budget component cash & reverse chemical synthesiser)
   ========================================================================= */

const STATIONS = [
  { n: 1, icon: '⚖️', name: "Station 1: Mia's Balance Lab", sub: 'Live scale: minerals, rovers & gifts' },
  { n: 2, icon: '🪄', name: 'Station 2: Solve It Workshop', sub: 'Clear punch LCD, robotic track & hunt' },
  { n: 3, icon: '🕵️', name: 'Station 3: Detective Desk', sub: 'Fix 3D print logs, budget cash & reverse fluids' }
];

const ACTIVITIES = {
  1: [
    {
      id: 1,
      icon: '💎',
      title: "Activity 1: Mia's Mineral Specimen Crate",
      tag: "🔬 Mia's Geology Booth · Science Fair",
      variable: "x = Total mass of the mineral crate (in kg)",
      desc: "Mia received a crate of rare fluorescent geology crystals with unknown mass x kg. To inspect them safely, she partitioned the crystals equally into 4 sample trays ({x|4} kg each). One tray balances a 5 kg certified brass weight: {x|4} = 5. Find the crate's total mass x!"
    },
    {
      id: 2,
      icon: '🔋',
      title: "Activity 2: Leo's Solar Rover Power Core",
      tag: "🤖 Leo's Robotics Garage · Power Calibrator",
      variable: "x = Full mass of the 5-cell lithium battery pack (in kg)",
      desc: "Leo is assembling a solar-powered rover. Its lithium battery pack consists of 5 modular cells of total mass x kg. He tests 3 of the 5 cells ({3x|5} kg) on the scale, balancing 12 kg of counterweights: {3x|5} = 12. Find the full battery mass x!"
    },
    {
      id: 3,
      icon: '🎁',
      title: "Activity 3: The Mystery Gift Box Challenge",
      tag: "🎪 Science Fair Mystery Contest · Grand Scale",
      variable: "x = True mass of the mystery science kit (in kg)",
      desc: "The mystery challenge from the Wonder Phase! Half of Mia's wrapped experiment kit ({x|2} kg) plus a 3 kg brass block balances an 11 kg certified weight: {x|2} + 3 = 11. Peel the layers in reverse order to uncover the kit's true mass!"
    }
  ],
  2: [
    {
      id: 1,
      icon: '🧪',
      title: 'Activity 1: Hydration Punch (LCD Magic Wand)',
      tag: '🥤 Chemistry Bench · Science Fair Electrolyte Punch',
      variable: 'x = Total capacity of the master punch jug (in Liters)',
      desc: 'Mia and Leo are mixing cold hydration punch for science fair guests. Mia pours half a master jug ({x|2} L) and Leo pours one-third of a jug ({x|3} L) into a 10-Liter dispenser vat: {x|2} + {x|3} = 10 L. Clear the liquid fractions with the LCD to find x!'
    },
    {
      id: 2,
      icon: '🦾',
      title: 'Activity 2: Robotic Arm Track Calibration',
      tag: '⚙️ Engineering Pavilion · Automated Arm Rail',
      variable: 'x = Total length of the robotic arm track (in meters)',
      desc: 'Leo is calibrating an automated robotic arm track of length x meters. The arm travels two-thirds of the track minus a 1-meter safety buffer: {2x|3} − 1 = 5 m. Snap the 4 calibration protocol steps into the exact logical order!'
    },
    {
      id: 3,
      icon: '🎚️',
      title: 'Activity 3: Competing Solar Scales (Balance Hunt)',
      tag: '⚖️ Invention Arena · Dual Prototype Rigs',
      variable: 'x = Mass of the prototype alloy ingot (in kg)',
      desc: 'Mia and Leo built two competing prototype rigs to weigh an alloy ingot (x kg). Rig A measures {x|3} + 4 kg, while Rig B measures {x|2} − 1 kg. Drag the ingot slider until both rigs register the exact same weight!'
    }
  ],
  3: [
    {
      id: 1,
      icon: '🔍',
      title: 'Activity 1: 3D Printer Logbook Mistake',
      tag: '📋 Rapid Prototyping Lab · Model Print Log',
      variable: 'x = Total scheduled 3D print runtime (in hours)',
      desc: "A student helper logged the 3D printer runtime: 'One-fourth of total print time x plus 2 calibration hours equals 7 hours': {x|4} + 2 = 7 hrs. But they made a classic Grade 7 blunder in their notebook! Spot and fix the mistake."
    },
    {
      id: 2,
      icon: '🛍️',
      title: 'Activity 2: Science Booth Supply Budget',
      tag: '💰 Maker Faire Budget · Sensor Purchasing',
      variable: 'x = Sam\'s weekly allowance (in dollars $)',
      desc: 'Sam is buying sensors for his science fair booth project. He sets aside one-fourth of his weekly allowance ({x|4}) and adds $3 earned recycling drink cans. Altogether he has $10: {x|4} + 3 = 10. Help him calculate his total weekly allowance!'
    },
    {
      id: 3,
      icon: '🏭',
      title: 'Activity 3: Botanical Chemical Synthesiser',
      tag: '🧪 Plant Chemistry Lab · Fluid Extractor',
      variable: 'x = Volume of raw botanical liquid input (in Liters)',
      desc: 'Mia\'s automated synthesiser processes an initial solution of x Liters. It extracts two-thirds (× ⅔), then vents 1 Liter of waste sediment (− 1), yielding 7 Liters of purified plant extract. Run the machine backwards to find input x!'
    }
  ]
};

/* ------------------------------ Small UI Bits ------------------------------ */
function Feedback({ success, children }) {
  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-900 w-full text-center shadow-xl shrink-0 fade-in-up border-2 ${
        success
          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400/70 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
          : 'bg-rose-950/90 text-rose-300 border-rose-400/70 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
      }`}
    >
      {children}
    </div>
  );
}

function EqBanner({ children }) {
  return (
    <div className="bg-[#14082c] border-2 border-amber-400/50 rounded-2xl px-6 py-2.5 font-display font-900 text-2xl sm:text-3xl text-white text-center shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] shrink-0">
      <MathText text={children} />
    </div>
  );
}

const NumInput = ({ value, onChange, onEnter, placeholder }) => (
  <input
    type="number"
    placeholder={placeholder}
    value={value}
    onChange={e => onChange(e.target.value)}
    onKeyDown={e => {
      if (e.key === 'Enter') onEnter && onEnter();
    }}
    className="bg-[#14082c] border-2 border-cyan-400/70 rounded-xl px-5 py-3 text-white font-display font-900 text-base sm:text-lg text-center outline-none focus:border-amber-400 focus:shadow-[0_0_15px_rgba(250,204,21,0.5)] w-48 shadow-inner transition"
  />
);

const HintBtn = ({ onClick, active }) => (
  <button
    onClick={onClick}
    className={`border font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
      active
        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
        : 'bg-purple-900/80 hover:bg-purple-800 border-purple-400/50 text-purple-200'
    }`}
  >
    <span>💡</span>
    <span>{active ? 'Hide Tip' : 'Grade 7 Tip'}</span>
  </button>
);

const HintBox = ({ title = 'Grade 7 Detective Tip', children }) => (
  <div className="p-3.5 bg-amber-950/95 border-2 border-amber-400/60 text-amber-200 rounded-2xl text-xs sm:text-sm font-extrabold w-full text-left shadow-xl fade-in-up shrink-0 leading-relaxed">
    <div className="flex items-center gap-2 text-amber-300 font-display font-900 text-sm mb-1">
      <span>💡</span>
      <span>{title}</span>
    </div>
    <div>{children}</div>
  </div>
);

const ghostBtn =
  'bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-xs sm:text-sm px-4 py-2 rounded-xl cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:scale-105';

/* Real-World Context Card rendered on top of every simulation */
function ScenarioHeader({ activity }) {
  return (
    <div className="w-full bg-[#14082c]/90 border border-purple-400/35 rounded-2xl p-3 sm:p-3.5 shadow-inner flex flex-col gap-1.5 shrink-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-display font-900 text-xs sm:text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
          <span>{activity.icon}</span>
          <span>{activity.tag}</span>
        </span>
        <span className="bg-amber-400/15 border border-amber-400/40 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full">
          {activity.variable}
        </span>
      </div>
      <p className="text-slate-200 text-xs sm:text-sm font-extrabold leading-snug">
        <MathText text={activity.desc} />
      </p>
    </div>
  );
}

/* =========================================================================
   STATION 1 — MIA'S BALANCE LAB
   Interactive balance scale with real-world specimens, lithium cores & mystery gift!
   Tipping physics: applying an operation to left only tilts the real scale!
   ========================================================================= */
const LAB_CONFIGS = [
  {
    eq: { left: lin(1, 4, 0, 1), right: lin(0, 1, 5, 1) },
    solution: 20,
    unit: 'kg',
    leftItem: '💎 ¼ Crate',
    leftLabel: '1 Sample Tray (x/4 kg)',
    rightItem: '⚖️ 5 kg Brass',
    rightLabel: '5 kg Certified Weight',
    optimal: 1,
    recipDisabled: true,
    realAction: (op, k) => {
      if (op === 'mul' && k === 4) {
        return 'Mia gathers 4 identical ¼-sample trays onto the left pan to reassemble the entire crystal crate (x kg). To preserve balance, she places four 5 kg brass weights on the right pan (4 × 5 kg = 20 kg)!';
      }
      return `Applied ${OP_SYMBOL[op]} ${k} to both pans of the scale.`;
    },
    solvedMsg: '🎉 Crate Reassembled! The full geological crystal crate weighs x = 20 kg! (4 sample trays × 5 kg = 20 kg). Mia can now safely catalog the crystals!'
  },
  {
    eq: { left: lin(3, 5, 0, 1), right: lin(0, 1, 12, 1) },
    solution: 20,
    unit: 'kg',
    leftItem: '🔋 ⅗ Power Pack',
    leftLabel: '3 of 5 Cells ({3x|5} kg)',
    rightItem: '⚖️ 12 kg Weights',
    rightLabel: '12 kg Counterweights',
    optimal: 1,
    recipDisabled: false,
    realAction: (op, k) => {
      if (op === 'div' && k === 3) {
        return 'Dividing by 3 finds the mass of 1 single lithium cell: 12 kg ÷ 3 = 4 kg per cell!';
      }
      if (op === 'mul' && k === 5) {
        return 'Multiplying by 5 scales up 1 single cell to all 5 cells in the full rover battery: 4 kg × 5 = 20 kg!';
      }
      return `Applied ${OP_SYMBOL[op]} ${k} to both pans.`;
    },
    solvedMsg: '🎉 Power Core Calibrated! The full 5-cell lithium pack weighs x = 20 kg! Each cell is 4 kg (3 × 4 = 12 kg). Leo can install the power pack into the solar rover!'
  },
  {
    eq: { left: lin(1, 2, 3, 1), right: lin(0, 1, 11, 1) },
    solution: 16,
    unit: 'kg',
    leftItem: '🎁 Half Kit + 🟨 3 kg',
    leftLabel: '{x|2} + 3 kg Block',
    rightItem: '⚖️ 11 kg Brass',
    rightLabel: '11 kg Certified Weight',
    optimal: 2,
    recipDisabled: true,
    realAction: (op, k) => {
      if (op === 'sub' && k === 3) {
        return 'Unwrapping Layer 1: Mia removes the 3 kg brass block from the left pan and takes 3 kg off the right pan! Now half the mystery kit balances exactly 8 kg!';
      }
      if (op === 'mul' && k === 2) {
        return 'Unwrapping Layer 2: Mia doubles the half-kit to produce 1 full mystery kit (x kg), and doubles the right pan to 16 kg!';
      }
      return `Applied ${OP_SYMBOL[op]} ${k} to both pans.`;
    },
    solvedMsg: "🎉 Mystery Kit Unwrapped! The full science fair kit weighs x = 16 kg! (Half is 8 kg + 3 kg block = 11 kg). Mia and Leo's booth mystery is solved!"
  }
];

function suggestMoveReal(cur, probIdx) {
  const { left } = cur;
  if (!left.c.isZero()) {
    return left.c.n > 0
      ? `Step 1 (Unwrap Outside Layer): The 3 kg brass block is added on the left. Subtract ${frMarkup(left.c)} from both pans to leave only the mystery fraction!`
      : `Undo the subtraction: add ${frMarkup(left.c.neg())} to both pans.`;
  }
  if (left.x.d > 1 && left.x.n === 1) {
    return `Division Inversion: x is divided into ${left.x.d} equal pieces. Multiply BOTH pans by ${left.x.d} to reassemble the whole item!`;
  }
  if (left.x.d > 1 && left.x.n !== 1) {
    return `Fraction Coefficient: You have ${left.x.n}/${left.x.d} of x. Either multiply by the reciprocal (${left.x.d}/${left.x.n}) in one shot, or divide by ${left.x.n} (to find 1 cell), then multiply by ${left.x.d} (for all ${left.x.d} cells)!`;
  }
  if (left.x.n !== 1) {
    return `Divide both sides by ${left.x.n} to find 1 whole x.`;
  }
  return 'x is already alone and balanced!';
}

function BalanceLab({ index, muted }) {
  const prob = LAB_CONFIGS[index];
  const [cur, setCur] = useState(prob.eq);
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState(0);
  const [op, setOp] = useState('mul');
  const [k, setK] = useState(index === 0 ? 4 : index === 1 ? 3 : 3);
  const [side, setSide] = useState('both');
  const [tipped, setTipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const solved = cur.left.x.eq(F(1)) && cur.left.c.isZero() && cur.right.x.isZero();
  const vL = evalLin(cur.left, prob.solution);
  const vR = evalLin(cur.right, prob.solution);
  const diff = vR - vL;
  const tilt =
    diff === 0
      ? 0
      : Math.max(
          -14,
          Math.min(14, Math.sign(diff) * Math.max(6, (Math.abs(diff) / (Math.abs(vL) + Math.abs(vR) || 1)) * 36))
        );

  const apply = () => {
    if (solved || tipped) return;
    const kk = F(k);
    const nl = applyOp(cur.left, op, kk);
    const nr = side === 'both' ? applyOp(cur.right, op, kk) : cur.right;
    setHistory(h => [...h, { cur, moves, lastAction }]);
    setCur({ left: nl, right: nr });

    if (side === 'left') {
      setTipped(true);
      setLastAction('⚠️ The scale tipped! You modified only the left pan without balancing the right pan.');
      speakFx('fx_tilt', muted);
    } else {
      const m = moves + 1;
      setMoves(m);
      setLastAction(prob.realAction(op, k));
      const done = nl.x.eq(F(1)) && nl.c.isZero() && nr.x.isZero();
      if (done) {
        speakFx('fx_balanced', muted);
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      }
    }
  };

  const applyRecip = () => {
    if (solved || tipped) return;
    const rec = F(cur.left.x.d, cur.left.x.n);
    setHistory(h => [...h, { cur, moves, lastAction }]);
    const nl = applyOp(cur.left, 'mul', rec);
    const nr = applyOp(cur.right, 'mul', rec);
    setCur({ left: nl, right: nr });
    setMoves(m => m + 1);
    setLastAction(
      `Reciprocal Magic: Multiplied both sides by {${cur.left.x.d}|${cur.left.x.n}}! Because (${cur.left.x.n}/${cur.left.x.d}) × (${cur.left.x.d}/${cur.left.x.n}) = 1, the fraction cancels instantly, leaving 1 full battery core x = 20 kg!`
    );
    if (nl.x.eq(F(1)) && nl.c.isZero() && nr.x.isZero()) {
      speakFx('fx_balanced', muted);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const undo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setCur(last.cur);
    setMoves(last.moves);
    setLastAction(last.lastAction || null);
    setHistory(h => h.slice(0, -1));
    setTipped(false);
  };

  const reset = () => {
    setCur(prob.eq);
    setHistory([]);
    setMoves(0);
    setTipped(false);
    setShowHint(false);
    setSide('both');
    setLastAction(null);
  };

  const canRecip = cur.left.x.n > 0 && cur.left.x.d > 1 && cur.left.c.isZero();
  const stars = moves <= prob.optimal ? 3 : moves <= prob.optimal + 1 ? 2 : 1;

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[1][index]} />

      {/* Live Balance Readouts Bar */}
      <div className="flex items-center justify-between w-full max-w-lg bg-[#14082c] border border-cyan-400/30 rounded-xl px-4 py-1.5 text-xs font-900 shrink-0">
        <span className="text-purple-300">
          Left Pan: <b className="text-white">{Number(vL.toFixed(1))} {prob.unit}</b>
        </span>
        <span className={tilt === 0 ? 'text-emerald-300' : 'text-amber-300'}>
          {tilt === 0 ? '⚖️ Level & Balanced' : tilt > 0 ? '↘️ Right Pan Heavier' : '↙️ Left Pan Heavier'}
        </span>
        <span className="text-cyan-300">
          Right Pan: <b className="text-white">{Number(vR.toFixed(1))} {prob.unit}</b>
        </span>
      </div>

      {/* SVG Scale with Real-World Item Badges */}
      <div className="w-full flex justify-center shrink-0">
        <BalanceScale
          left={linMarkup(cur.left)}
          right={linMarkup(cur.right)}
          tilt={tilt}
          maxWidth={340}
          leftItem={prob.leftItem}
          rightItem={prob.rightItem}
          leftLabel={prob.leftLabel}
          rightLabel={prob.rightLabel}
        />
      </div>

      {/* Real-World Action Ledger */}
      {lastAction && (
        <div className="w-full bg-[#14082c]/90 border border-purple-400/40 rounded-xl p-2.5 text-xs sm:text-sm font-extrabold text-slate-100 text-center shadow-inner shrink-0 fade-in-up">
          <span className="text-amber-300 font-display font-900 mr-1.5">🔬 Physical Lab Ledger:</span>
          <MathText text={lastAction} />
        </div>
      )}

      {tipped && (
        <Feedback success={false}>
          ⚠️ <b>The scale tipped!</b> You changed only one side. In the real world, whatever weight you add or remove on
          one pan MUST be done to the other pan. Press <b>Undo</b>, then apply to <b>Both sides ✅</b>.
        </Feedback>
      )}

      {solved ? (
        <Feedback success>
          <div className="flex flex-col items-center gap-1">
            <span className="text-base sm:text-lg">{prob.solvedMsg}</span>
            <span className="text-xs sm:text-sm text-emerald-200 font-bold">
              Solved in {moves} move{moves === 1 ? '' : 's'} &nbsp;·&nbsp; Rating:{' '}
              <span className="text-amber-300">{'★'.repeat(stars)}</span>
              <span className="text-slate-500">{'☆'.repeat(3 - stars)}</span>
            </span>
          </div>
        </Feedback>
      ) : (
        <>
          {/* Operation & Number Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full bg-[#14082c] px-3.5 py-2.5 rounded-2xl border border-cyan-400/30 shrink-0">
            <span className="text-xs sm:text-sm font-extrabold text-slate-200">Operation:</span>
            {['add', 'sub', 'mul', 'div'].map(o => (
              <button
                key={o}
                onClick={() => setOp(o)}
                className={`w-10 h-10 rounded-xl font-display font-900 text-xl cursor-pointer transition ${
                  op === o
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.6)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {OP_SYMBOL[o]}
              </button>
            ))}

            <span className="text-xs sm:text-sm font-extrabold text-slate-200 ml-2">Number:</span>
            <button
              onClick={() => setK(v => Math.max(1, v - 1))}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-900 cursor-pointer"
            >
              −
            </button>
            <span className="font-display font-900 text-xl text-amber-300 w-8 text-center">{k}</span>
            <button
              onClick={() => setK(v => Math.min(12, v + 1))}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-900 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Target Side & Execution */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full shrink-0">
            <span className="text-xs sm:text-sm font-extrabold text-slate-200">Apply to:</span>
            <button
              onClick={() => setSide('both')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-900 cursor-pointer transition ${
                side === 'both' ? 'bg-cyan-400 text-slate-950 shadow-md scale-105' : 'bg-white/10 text-white'
              }`}
            >
              Both pans ✅ (Keep Level)
            </button>
            <button
              onClick={() => setSide('left')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-900 cursor-pointer transition ${
                side === 'left' ? 'bg-rose-400 text-slate-950 shadow-md scale-105' : 'bg-white/10 text-white'
              }`}
            >
              Left pan only ⚠️ (Tips Scale!)
            </button>

            <button
              onClick={apply}
              disabled={tipped}
              className="btn-gold text-xs sm:text-sm font-900 px-6 py-2 shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply {OP_SYMBOL[op]} {k} ✨
            </button>

            {canRecip && (
              <button
                onClick={applyRecip}
                disabled={tipped}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-900 text-xs sm:text-sm px-4 py-2 rounded-xl cursor-pointer transition disabled:opacity-40 shadow-[0_0_15px_rgba(52,211,153,0.5)] hover:scale-105 flex items-center gap-1.5"
              >
                <span>🔄 Multiply by Reciprocal</span>
                <MathText text={`{${cur.left.x.d}|${cur.left.x.n}}`} />
              </button>
            )}
          </div>
        </>
      )}

      {showHint && !solved && (
        <HintBox title="Grade 7 Scale Guide">
          <MathText text={suggestMoveReal(cur, index)} />
        </HintBox>
      )}

      {/* Footer Utility Row */}
      <div className="flex items-center gap-2.5 shrink-0 mt-1">
        <button onClick={undo} disabled={!history.length} className={ghostBtn}>
          ↩ Undo
        </button>
        <button onClick={reset} className={ghostBtn}>
          🔁 Reset
        </button>
        {!solved && <HintBtn onClick={() => setShowHint(h => !h)} active={showHint} />}
        <span className="font-display font-900 text-xs sm:text-sm text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
          Moves: {moves}
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   STATION 2 · A1 — SCIENCE FAIR HYDRATION PUNCH (LCD MAGIC WAND)
   Equation: {x|2} + {x|3} = 10 L
   ========================================================================= */
function LcdWand({ muted }) {
  const [stage, setStage] = useState(0); // 0: pick LCD · 1: cast wand · 2: solve for x · 3: done
  const [msg, setMsg] = useState(null);
  const [ans, setAns] = useState('');
  const [showHint, setShowHint] = useState(false);

  const pickLcd = v => {
    if (v === 6) {
      setStage(1);
      setMsg({
        ok: true,
        t: '✅ Outstanding! 6 is the Lowest Common Multiple of 2 and 3. Multiplying every container by 6 scales all liquid amounts to whole numbers!'
      });
    } else if (v === 12) {
      setMsg({
        ok: false,
        t: '12 is a common multiple that would clear denominators, but Grade 7 mathematicians use the LOWEST common denominator: 6 is smaller!'
      });
    } else {
      setMsg({
        ok: false,
        t: `${v} is not a multiple of both 2 and 3. List multiples of 2 (2, 4, 6...) and multiples of 3 (3, 6, 9...). The first common number is 6!`
      });
    }
  };

  const cast = () => {
    setStage(2);
    setMsg(null);
    speakFx('fx_wand', muted);
  };

  const check = () => {
    if (Number(ans) === 12) {
      setStage(3);
      setMsg({
        ok: true,
        t: '🎉 Solved! The master jug holds x = 12 Liters! Real-World Check: Mia poured ½ of 12 = 6 L, Leo poured ⅓ of 12 = 4 L. Total = 6 L + 4 L = 10 L ✓ Exactly fills the dispenser vat!'
      });
      speakFx('fx_balanced', muted);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setMsg({
        ok: false,
        t: 'Not quite. After combining like terms you have 5x = 60 Liters. Divide 60 by 5 to find the volume of 1 jug.'
      });
      speakFx('fx_try_again', muted);
    }
  };

  const chip = (n, label) => (
    <span
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-900 border ${
        stage + 1 >= n ? 'bg-amber-400 text-slate-950 border-amber-200' : 'bg-white/10 text-slate-300 border-white/20'
      }`}
    >
      {n}. {label}
    </span>
  );

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[2][0]} />

      <div className="flex items-center gap-2 flex-wrap justify-center shrink-0">
        {chip(1, 'Identify LCD')}
        <span className="text-amber-300">→</span>
        {chip(2, 'Cast LCD Wand')}
        <span className="text-amber-300">→</span>
        {chip(3, 'Solve Master Volume')}
      </div>

      <EqBanner>{'{x|2} + {x|3} = 10'}</EqBanner>

      {/* Visual Recipe Beakers Card */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg bg-[#14082c] border border-cyan-400/30 p-2.5 rounded-2xl text-center shrink-0">
        <div className="bg-cyan-950/70 border border-cyan-400/50 rounded-xl p-2 flex flex-col items-center">
          <span className="text-2xl">🧪</span>
          <span className="text-[11px] font-900 text-cyan-300 uppercase">Mia's Pour</span>
          <span className="font-display font-900 text-white text-sm">
            <MathText text="{x|2} L (½ jug)" />
          </span>
        </div>
        <div className="bg-emerald-950/70 border border-emerald-400/50 rounded-xl p-2 flex flex-col items-center">
          <span className="text-2xl">🧪</span>
          <span className="text-[11px] font-900 text-emerald-300 uppercase">Leo's Pour</span>
          <span className="font-display font-900 text-white text-sm">
            <MathText text="{x|3} L (⅓ jug)" />
          </span>
        </div>
        <div className="bg-amber-950/70 border border-amber-400/50 rounded-xl p-2 flex flex-col items-center">
          <span className="text-2xl">🚰</span>
          <span className="text-[11px] font-900 text-amber-300 uppercase">Dispenser Vat</span>
          <span className="font-display font-900 text-white text-sm">10 Liters Total</span>
        </div>
      </div>

      {stage === 0 && (
        <div className="flex flex-col items-center gap-2.5 shrink-0">
          <p className="text-slate-100 font-extrabold text-sm sm:text-base text-center">
            What is the <b>Lowest Common Denominator (LCD)</b> of 2 and 3?
          </p>
          <div className="flex gap-3">
            {[5, 6, 12, 24].map(v => (
              <button
                key={v}
                onClick={() => pickLcd(v)}
                className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white font-display font-900 text-2xl cursor-pointer transition hover:scale-110 border border-white/20 shadow-md"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 1 && (
        <div className="flex flex-col items-center gap-2 shrink-0">
          <p className="text-slate-200 text-xs sm:text-sm font-extrabold text-center max-w-md">
            Click the Magic Wand to scale every liquid measurement by 6: this eliminates all fraction denominators!
          </p>
          <button
            onClick={cast}
            className="btn-gold text-sm sm:text-base font-900 px-8 py-3 shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105 transition cursor-pointer flex items-center gap-2"
          >
            <span>🪄 Multiply Every Term by 6 (LCD)</span>
          </button>
        </div>
      )}

      {stage >= 2 && (
        <div className="w-full max-w-lg bg-[#14082c]/90 border-2 border-amber-400/40 p-3.5 rounded-2xl text-center flex flex-col gap-2 shadow-inner fade-in-up shrink-0">
          <div className="grid grid-cols-3 gap-2 text-xs font-900 text-slate-200 border-b border-white/10 pb-2">
            <div>
              <span className="text-cyan-300">6</span> × <MathText text="{x|2}" /> = <b className="text-amber-300">3x</b>
            </div>
            <div>
              <span className="text-cyan-300">6</span> × <MathText text="{x|3}" /> = <b className="text-amber-300">2x</b>
            </div>
            <div>
              <span className="text-cyan-300">6</span> × 10 = <b className="text-amber-300">60</b>
            </div>
          </div>
          <p className="font-display font-900 text-xl sm:text-2xl text-emerald-300">
            3x + 2x = 60 &nbsp;→&nbsp; 5x = 60
          </p>
          <p className="text-xs text-slate-300 font-extrabold">✨ All fraction bars cleared! Now 5 master jugs equal 60 Liters.</p>
        </div>
      )}

      {stage === 2 && (
        <div className="flex items-center gap-3 flex-wrap justify-center shrink-0">
          <span className="font-display font-900 text-lg sm:text-xl text-white">Master Jug Volume x =</span>
          <NumInput value={ans} onChange={setAns} onEnter={check} placeholder="Enter Liters" />
          <button
            onClick={check}
            className="btn-gold text-xs sm:text-sm font-900 px-7 py-3 shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Check Answer ✨
          </button>
          <HintBtn onClick={() => setShowHint(h => !h)} active={showHint} />
        </div>
      )}

      {showHint && stage === 2 && (
        <HintBox title="Solving 5x = 60">
          To undo multiplying by 5, divide both sides by 5: 60 ÷ 5 = ?
        </HintBox>
      )}

      {msg && <Feedback success={msg.ok}>{msg.t}</Feedback>}
    </div>
  );
}

/* =========================================================================
   STATION 2 · A2 — ROBOTIC ARM TRACK CALIBRATION (STEP SORTER)
   Equation: {2x|3} − 1 = 5 m
   ========================================================================= */
const ROBOT_STEPS = [
  'Step 1 · Undo 1m Safety Buffer: Add 1 to both sides → {2x|3} = 6',
  'Step 2 · Clear Track Division: Multiply both sides by 3 → 2x = 18',
  'Step 3 · Isolate Track Length: Divide both sides by 2 → x = 9 meters',
  'Step 4 · Safety Check: {2(9)|3} − 1 = 6 − 1 = 5 m ✓'
];

function StepSorter({ muted }) {
  const order = useMemo(() => {
    let a;
    do {
      a = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    } while (a.every((v, i) => v === i));
    return a;
  }, []);

  const [placed, setPlaced] = useState([]);
  const [shake, setShake] = useState(null);
  const [msg, setMsg] = useState(null);
  const [slips, setSlips] = useState(0);

  const tap = i => {
    if (placed.includes(i)) return;
    if (i === placed.length) {
      const np = [...placed, i];
      setPlaced(np);
      setMsg(null);
      if (np.length === 4) {
        setMsg({
          ok: true,
          t: `🎉 Perfect Calibration! The robotic arm track length is x = 9 meters!${
            slips === 0 ? ' Completed with zero slips!' : ''
          }`
        });
        speakFx('fx_balanced', muted);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      setSlips(s => s + 1);
      setShake(i);
      setTimeout(() => setShake(null), 450);
      setMsg({
        ok: false,
        t: `That step comes later. For Step ${
          placed.length + 1
        }: In reverse operations (SADMEP), undo adding/subtracting before undoing fractions!`
      });
    }
  };

  const reset = () => {
    setPlaced([]);
    setMsg(null);
    setSlips(0);
  };

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[2][1]} />
      <EqBanner>{'{2x|3} − 1 = 5'}</EqBanner>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {/* Jumbled Step Tiles */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider text-center">
            Jumbled Protocol Steps — Tap the Next Step
          </p>
          {order.map(i => (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={placed.includes(i)}
              className={`text-left px-4 py-2.5 rounded-xl border-2 font-display font-900 text-xs sm:text-sm cursor-pointer transition ${
                placed.includes(i)
                  ? 'opacity-20 border-white/10 bg-white/5 text-slate-500'
                  : 'bg-[#2b1a63] border-purple-400/50 text-white hover:border-amber-300 hover:scale-[1.02] shadow-md'
              } ${shake === i ? 'animate-shake border-rose-400 bg-rose-950/60' : ''}`}
            >
              <MathText text={ROBOT_STEPS[i]} />
            </button>
          ))}
        </div>

        {/* Ordered Solution Slots */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-900 text-amber-300 uppercase tracking-wider text-center">
            Your Ordered Solution Protocol
          </p>
          {[0, 1, 2, 3].map(slot => (
            <div
              key={slot}
              className={`min-h-[46px] px-4 py-2 rounded-xl border-2 flex items-center gap-3 font-display font-900 text-xs sm:text-sm ${
                placed[slot] != null
                  ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-200 fade-in-up shadow-md'
                  : 'border-dashed border-white/25 text-slate-500 bg-black/20'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/15 text-xs flex items-center justify-center shrink-0">
                {slot + 1}
              </span>
              {placed[slot] != null ? (
                <MathText text={ROBOT_STEPS[placed[slot]]} />
              ) : (
                <span className="text-slate-400">Step {slot + 1} Slot</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {msg && <Feedback success={msg.ok}>{msg.t}</Feedback>}
      <button onClick={reset} className={ghostBtn}>
        🔁 Shuffle & Restart Steps
      </button>
    </div>
  );
}

/* =========================================================================
   STATION 2 · A3 — COMPETING SOLAR SCALES (BALANCE HUNTER)
   Equation: {x|3} + 4 = {x|2} − 1 kg
   ========================================================================= */
const trim = v => String(Number(v.toFixed(2)));

function BalanceHunter({ muted }) {
  const [x, setX] = useState(6);
  const [tries, setTries] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [found, setFound] = useState(false);

  const vL = x / 3 + 4;
  const vR = x / 2 - 1;
  const d = vR - vL;
  const balanced = Math.abs(d) < 1e-9;
  const tilt = Math.max(-14, Math.min(14, d * 2.4));

  useEffect(() => {
    if (balanced && !found) {
      setFound(true);
      speakFx('fx_balanced', muted);
      confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 } });
    }
  }, [balanced, found, muted]);

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[2][2]} />
      <EqBanner>{'{x|3} + 4 = {x|2} − 1'}</EqBanner>

      {/* Real-World Rig Weight Dials Bar */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-lg bg-[#14082c] border border-cyan-400/30 p-2 rounded-xl text-center text-xs font-900 shrink-0">
        <div className="text-purple-300">
          Rig A: <b className="text-white">{trim(vL)} kg</b>
        </div>
        <div className={balanced ? 'text-emerald-300 font-extrabold' : 'text-amber-300'}>
          {balanced ? '⚖️ EQUILIBRIUM' : `Gap: ${trim(Math.abs(d))} kg`}
        </div>
        <div className="text-cyan-300">
          Rig B: <b className="text-white">{trim(vR)} kg</b>
        </div>
      </div>

      <BalanceScale
        left={trim(vL)}
        right={trim(vR)}
        tilt={tilt}
        maxWidth={320}
        leftLabel="Rig A ({x|3} + 4)"
        rightLabel="Rig B ({x|2} − 1)"
        leftItem="🏗️ Rig A"
        rightItem="🏗️ Rig B"
      />

      {/* Interactive Ingot Mass Adjustment Slider & Fine-Tuning */}
      <div className="flex flex-col items-center gap-2 w-full max-w-lg bg-[#14082c] px-4 py-3 rounded-2xl border border-cyan-400/30 shrink-0">
        <div className="flex items-center justify-between w-full text-xs font-extrabold text-slate-300">
          <span>0 kg (Min)</span>
          <span className="text-sm font-black text-amber-300 bg-amber-400/10 px-4 py-1 rounded-full border border-amber-400/40">
            Ingot Mass x = {x} kg
          </span>
          <span>60 kg (Max)</span>
        </div>

        <input
          type="range"
          min="0"
          max="60"
          step="1"
          value={x}
          onChange={e => {
            setX(Number(e.target.value));
            setTries(t => t + 1);
          }}
          className="w-full accent-cyan-400 cursor-pointer h-2 rounded-lg bg-white/20"
        />

        {/* Fine Adjustment Quick Buttons */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400 font-bold">Fine-tune:</span>
          {[-5, -1, 1, 5].map(step => (
            <button
              key={step}
              onClick={() => {
                setX(curr => Math.max(0, Math.min(60, curr + step)));
                setTries(t => t + 1);
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-900 text-white cursor-pointer transition hover:scale-105"
            >
              {step > 0 ? `+${step}` : step} kg
            </button>
          ))}
        </div>
      </div>

      {!balanced && (
        <p className="text-slate-100 font-extrabold text-xs sm:text-sm text-center">
          {d > 0
            ? '⬅️ Rig B (Right pan) is heavier! Try a smaller ingot mass x.'
            : '➡️ Rig A (Left pan) is heavier! Try a larger ingot mass x.'}{' '}
          <span className="text-amber-300 font-bold">(Difference: {trim(Math.abs(d))} kg)</span>
        </p>
      )}

      {balanced && (
        <div className="w-full max-w-lg bg-[#14082c]/95 border-2 border-emerald-400/60 p-3.5 rounded-2xl text-center fade-in-up shrink-0 shadow-xl">
          <p className="font-display font-900 text-emerald-300 text-lg">
            🎉 Equilibrium Reached at Ingot Mass x = 30 kg!
          </p>
          <p className="text-xs sm:text-sm text-white font-extrabold mt-1">
            Both suspension rigs support exactly <b>14 kg</b>! (Rig A: 30÷3 + 4 = 14 kg &nbsp;|&nbsp; Rig B: 30÷2 − 1 = 14 kg).
          </p>
          <div className="mt-2 text-xs bg-emerald-950/60 p-2 rounded-xl text-emerald-200 border border-emerald-400/30">
            <b>Algebra Proof (Clear fractions with LCD 6):</b> 6 × ({'{x|3}'} + 4) = 6 × ({'{x|2}'} − 1) &nbsp;→&nbsp; 2x + 24 = 3x − 6 &nbsp;→&nbsp; x = 30 kg ✓
          </div>
        </div>
      )}

      {showHint && !balanced && (
        <HintBox title="Algebraic Equilibrium Hint">
          Clear both denominators (3 and 2) by multiplying every term by 6: 2x + 24 = 3x − 6. Subtract 2x from both sides
          to get 24 = x − 6, then add 6 to find x!
        </HintBox>
      )}

      {!balanced && <HintBtn onClick={() => setShowHint(h => !h)} active={showHint} />}
    </div>
  );
}

/* =========================================================================
   STATION 3 · A1 — 3D PRINTER LOGBOOK MISTAKE DETECTIVE
   Equation: {x|4} + 2 = 7 hrs
   ========================================================================= */
const DETECTIVE_LINES = [
  { t: 'Line 1:   {x|4} + 2 = 7', bad: false, note: 'Initial problem formulation — perfectly valid.' },
  {
    t: 'Line 2:   {x|4} = 7 + 2 = 9',
    bad: true,
    note: '🚨 THE BLUNDER! Added 2 instead of subtracting 2 to undo "+ 2"!'
  },
  { t: 'Line 3:   x = 9 × 4', bad: false, note: 'Follows from Line 2, but carries the previous error.' },
  { t: 'Line 4:   x = 36 hours', bad: false, note: 'Final calculation based on the blunder.' }
];

const FIX_OPTIONS = [
  { t: 'Line 2:   {x|4} = 7 ÷ 2', ok: false },
  { t: 'Line 2:   {x|4} = 7 − 2 = 5', ok: true },
  { t: 'Line 2:   x = 7 − 2 = 5', ok: false }
];

function MistakeDetective({ muted }) {
  const [stage, setStage] = useState(0); // 0: pick mistake · 1: choose fix · 2: case closed
  const [msg, setMsg] = useState(null);
  const [fixOrder] = useState(() => [...FIX_OPTIONS].sort(() => Math.random() - 0.5));

  const pickLine = i => {
    if (stage !== 0) return;
    if (DETECTIVE_LINES[i].bad) {
      setStage(1);
      setMsg({
        ok: true,
        t: '🔍 Blunder Caught! Line 2 added 2 instead of subtracting 2! To undo "+ 2", you must subtract 2 from both sides!'
      });
    } else {
      setMsg({
        ok: false,
        t:
          i === 0
            ? 'Line 1 is the original problem statement from the 3D printer log, so it is correct.'
            : 'That line followed algebraically from the line above it. Find the step where an operation was undone improperly!'
      });
    }
  };

  const pickFix = o => {
    if (o.ok) {
      setStage(2);
      setMsg({
        ok: true,
        t: '🎉 Blunder Repaired! x = 5 × 4 = 20 hours! Check: 20 ÷ 4 + 2 = 5 + 2 = 7 hours ✓ The 3D print models will be ready for the science fair on time!'
      });
      speakFx('fx_balanced', muted);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setMsg({
        ok: false,
        t: 'Not that option. We undo "+ 2" by subtracting 2 from 7, while keeping {x|4} on the left side!'
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[3][0]} />

      <p className="text-slate-100 font-extrabold text-xs sm:text-sm text-center">
        {stage === 0
          ? '🕵️ Tap the logbook line that contains the FIRST algebraic blunder:'
          : stage === 1
          ? '🛠️ How should Line 2 be corrected?'
          : '✅ Case Closed! The true 3D printer runtime has been recovered.'}
      </p>

      {/* Realistic Lab Notebook Layout */}
      <div className="w-full max-w-lg bg-[#fffdf0] border-2 border-amber-300 rounded-2xl p-3.5 flex flex-col gap-2 shadow-2xl text-slate-900 shrink-0">
        <div className="flex items-center justify-between border-b border-amber-200 pb-1 text-[11px] font-900 text-amber-800 tracking-wider uppercase">
          <span>📓 Lab Notebook · Volunteer Log</span>
          <span>Page 14 · Print Job #4</span>
        </div>

        {DETECTIVE_LINES.map((l, i) => (
          <button
            key={i}
            onClick={() => pickLine(i)}
            className={`text-left px-3.5 py-2.5 rounded-xl border-2 font-display font-900 text-sm sm:text-base cursor-pointer transition flex items-center justify-between ${
              stage > 0 && l.bad
                ? 'bg-rose-100 border-rose-500 text-rose-800 line-through decoration-rose-600 decoration-3'
                : 'bg-white border-amber-200 text-slate-900 hover:border-amber-500 hover:scale-[1.02]'
            }`}
          >
            <MathText text={l.t} />
            {stage > 0 && l.bad && <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-md">Error Here!</span>}
          </button>
        ))}
      </div>

      {stage === 1 && (
        <div className="w-full max-w-lg flex flex-col gap-2 fade-in-up shrink-0">
          <p className="text-amber-300 font-display font-900 text-xs sm:text-sm text-center">
            Select the Proper Correction for Line 2:
          </p>
          {fixOrder.map((o, i) => (
            <button
              key={i}
              onClick={() => pickFix(o)}
              className="text-left px-4 py-2.5 rounded-xl border-2 border-cyan-400/50 bg-[#10294a] text-white font-display font-900 text-xs sm:text-sm cursor-pointer hover:border-amber-300 hover:scale-[1.02] transition shadow-md"
            >
              <MathText text={o.t} />
            </button>
          ))}
        </div>
      )}

      {msg && <Feedback success={msg.ok}>{msg.t}</Feedback>}
    </div>
  );
}

/* =========================================================================
   STATION 3 · A2 — SCIENCE BOOTH SUPPLY BUDGET (WORD WORKSHOP)
   Equation: {x|4} + 3 = 10 dollars
   ========================================================================= */
const WORD_EQS = [
  { t: '{x|4} + 3 = 10', ok: true, reason: 'Correct! ¼ of allowance is {x|4}, plus $3 recycling = $10 total.' },
  { t: '4x + 3 = 10', ok: false, reason: '4x would mean 4 TIMES the allowance, not one-fourth!' },
  { t: '{x|4} − 3 = 10', ok: false, reason: 'He added $3 earned from recycling, not lost $3!' },
  { t: 'x + 3 = {10|4}', ok: false, reason: 'The weekly allowance was divided by 4, not the $10 budget!' }
];

function WordWorkshop({ muted }) {
  const [stage, setStage] = useState(0); // 0: pick equation · 1: solve x · 2: done
  const [msg, setMsg] = useState(null);
  const [ans, setAns] = useState('');
  const [showHint, setShowHint] = useState(false);

  const pick = o => {
    if (o.ok) {
      setStage(1);
      setMsg({
        ok: true,
        t: '✅ Excellent Equation Modeling! "One-fourth of allowance" is {x|4}, and "adds $3" means + 3, giving 10.'
      });
    } else {
      setMsg({ ok: false, t: o.reason });
    }
  };

  const check = () => {
    if (Number(ans) === 28) {
      setStage(2);
      setMsg({
        ok: true,
        t: "🎉 Budget Solved! Sam's weekly allowance is $28! Verification: One-fourth of $28 is $7, plus $3 recycling = $10 total sensor budget ✓"
      });
      speakFx('fx_balanced', muted);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setMsg({
        ok: false,
        t: 'Not yet. Subtract the $3 recycling money from $10 first ({x|4} = 7), then multiply by 4 to get the full allowance.'
      });
      speakFx('fx_try_again', muted);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[3][1]} />

      {/* Visual Money Jars Card */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg bg-[#14082c] border border-cyan-400/30 p-2.5 rounded-2xl text-center shrink-0">
        <div className="bg-purple-950/70 border border-purple-400/50 rounded-xl p-2 flex flex-col items-center">
          <span className="text-2xl">🪙</span>
          <span className="text-[11px] font-900 text-purple-300 uppercase">¼ Allowance</span>
          <span className="font-display font-900 text-white text-sm">
            <MathText text="{x|4}" />
          </span>
        </div>
        <div className="bg-emerald-950/70 border border-emerald-400/50 rounded-xl p-2 flex flex-col items-center">
          <span className="text-2xl">♻️</span>
          <span className="text-[11px] font-900 text-emerald-300 uppercase">Recycling Cash</span>
          <span className="font-display font-900 text-white text-sm">+$3.00</span>
        </div>
        <div className="bg-amber-950/70 border border-amber-400/50 rounded-xl p-2 flex flex-col items-center">
          <span className="text-2xl">🛒</span>
          <span className="text-[11px] font-900 text-amber-300 uppercase">Sensor Budget</span>
          <span className="font-display font-900 text-white text-sm">$10.00 Total</span>
        </div>
      </div>

      {stage === 0 && (
        <>
          <p className="text-slate-100 font-extrabold text-xs sm:text-sm text-center">
            Step 1: Which algebraic equation models this story? (x = weekly allowance)
          </p>
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-lg shrink-0">
            {WORD_EQS.map((o, i) => (
              <button
                key={i}
                onClick={() => pick(o)}
                className="px-4 py-3 rounded-xl border-2 border-purple-400/50 bg-[#2b1a63] text-white font-display font-900 text-base sm:text-lg cursor-pointer hover:border-amber-300 hover:scale-105 transition shadow-md"
              >
                <MathText text={o.t} />
              </button>
            ))}
          </div>
        </>
      )}

      {stage >= 1 && <EqBanner>{'{x|4} + 3 = 10'}</EqBanner>}

      {stage === 1 && (
        <div className="flex items-center gap-3 flex-wrap justify-center shrink-0">
          <span className="font-display font-900 text-base sm:text-lg text-white">Step 2: Allowance x = $</span>
          <NumInput value={ans} onChange={setAns} onEnter={check} placeholder="Enter dollars" />
          <button
            onClick={check}
            className="btn-gold text-xs sm:text-sm font-900 px-7 py-3 shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Check Allowance ✨
          </button>
          <HintBtn onClick={() => setShowHint(h => !h)} active={showHint} />
        </div>
      )}

      {showHint && stage === 1 && (
        <HintBox title="Solving for Allowance">
          Subtract 3 from both sides: {'{x|4}'} = 10 − 3 = 7. Then multiply both sides by 4: x = 7 × 4!
        </HintBox>
      )}

      {msg && <Feedback success={msg.ok}>{msg.t}</Feedback>}
    </div>
  );
}

/* =========================================================================
   STATION 3 · A3 — BOTANICAL CHEMICAL SYNTHESISER (BACKWARDS MACHINE)
   Pipeline: x → × ⅔ → − 1 L → 7 L
   ========================================================================= */
function BackwardsMachine({ muted }) {
  const [stage, setStage] = useState(0); // 0: find middle chamber · 1: find input batch · 2: done
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [msg, setMsg] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const check1 = () => {
    if (Number(a1) === 8) {
      setStage(1);
      setMsg({
        ok: true,
        t: '✅ Chamber 2 Restored! Undoing sediment vent "− 1 L" by adding 1 L yields 7 + 1 = 8 Liters!'
      });
    } else {
      setMsg({
        ok: false,
        t: 'The opposite of subtracting 1 L is adding 1 L. What is 7 + 1?'
      });
      speakFx('fx_try_again', muted);
    }
  };

  const check2 = () => {
    if (Number(a2) === 12) {
      setStage(2);
      setMsg({
        ok: true,
        t: '🎉 Input Batch Discovered! Initial volume was x = 12 Liters! Real-World Check: ⅔ of 12 L = 8 L, minus 1 L sediment = 7 L pure extract ✓'
      });
      speakFx('fx_balanced', muted);
      confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 } });
    } else {
      setMsg({
        ok: false,
        t: 'To undo multiplying by ⅔, multiply by the reciprocal ³⁄₂ (or divide by 2, then multiply by 3): 8 × 3/2 = ?'
      });
      speakFx('fx_try_again', muted);
    }
  };

  const Chamber = ({ label, value, glow, unit = 'L' }) => (
    <div
      className={`w-24 sm:w-28 h-20 sm:h-22 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 transition-all ${
        glow
          ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-105'
          : 'border-purple-400/50 bg-[#2b1a63]'
      }`}
    >
      <span className="text-[10px] font-900 text-slate-300 uppercase tracking-wider">{label}</span>
      <span className="font-display font-900 text-2xl text-white">
        {value} <span className="text-xs text-amber-300">{value !== '?' && value !== 'x' ? unit : ''}</span>
      </span>
    </div>
  );

  const Valve = ({ title, children }) => (
    <div className="w-24 sm:w-28 h-20 sm:h-22 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white flex flex-col items-center justify-center shrink-0 shadow-lg">
      <span className="text-xs font-900 text-slate-900 uppercase">{title}</span>
      <span className="font-display font-900 text-lg sm:text-xl text-slate-950">
        <MathText text={children} />
      </span>
    </div>
  );

  const FlowArrow = () => (
    <span className="text-amber-300 font-900 text-2xl sm:text-3xl shrink-0 drop-shadow-sm">→</span>
  );

  return (
    <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full">
      <ScenarioHeader activity={ACTIVITIES[3][2]} />

      {/* Visual Pipeline Layout */}
      <div className="flex items-center gap-2 flex-wrap justify-center py-2 shrink-0">
        <Chamber label="Raw Input x" value={stage === 2 ? '12' : 'x'} glow={stage === 2} />
        <FlowArrow />
        <Valve title="Extractor">{'× {2|3}'}</Valve>
        <FlowArrow />
        <Chamber label="Filtered Chamber" value={stage >= 1 ? '8' : '?'} glow={stage >= 1} />
        <FlowArrow />
        <Valve title="Sediment Vent">{'− 1 L'}</Valve>
        <FlowArrow />
        <Chamber label="Pure Output" value="7" glow />
      </div>

      <p className="text-slate-100 font-extrabold text-xs sm:text-sm text-center">
        {stage === 0 && '⏪ Run it in reverse! Step 1: Undo the "− 1 L" sediment vent. What was the liquid volume in the middle chamber?'}
        {stage === 1 && '⏪ Step 2: Undo the "× ⅔" extraction with reciprocal × ³⁄₂. What was the original raw batch volume x?'}
        {stage === 2 && '✅ Botanical synthesiser process fully reversed!'}
      </p>

      {stage === 0 && (
        <div className="flex items-center gap-3 flex-wrap justify-center shrink-0">
          <NumInput value={a1} onChange={setA1} onEnter={check1} placeholder="Middle volume (L)" />
          <button
            onClick={check1}
            className="btn-gold text-xs sm:text-sm font-900 px-7 py-3 shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Check Chamber 2 ✨
          </button>
          <HintBtn onClick={() => setShowHint(h => !h)} active={showHint} />
        </div>
      )}

      {stage === 1 && (
        <div className="flex items-center gap-3 flex-wrap justify-center shrink-0">
          <NumInput value={a2} onChange={setA2} onEnter={check2} placeholder="Input batch x (L)" />
          <button
            onClick={check2}
            className="btn-gold text-xs sm:text-sm font-900 px-7 py-3 shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Check Raw Batch x ✨
          </button>
          <HintBtn onClick={() => setShowHint(h => !h)} active={showHint} />
        </div>
      )}

      {showHint && stage < 2 && (
        <HintBox title="Reverse Machine Rules">
          {stage === 0
            ? 'The inverse (opposite) of subtracting 1 L is adding 1 L: 7 + 1 = ?'
            : 'The inverse of multiplying by ⅔ is multiplying by the reciprocal ³⁄₂ (or divide 8 by 2, then multiply by 3): 8 × 1.5 = ?'}
        </HintBox>
      )}

      {msg && <Feedback success={msg.ok}>{msg.t}</Feedback>}
    </div>
  );
}

/* =========================================================================
   MAIN PHASE COMPONENT — Simulation Stations
   ========================================================================= */
export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);

  const currentActivity = ACTIVITIES[station][actIdx];

  useEffect(() => {
    const actKey = `sim_${station}_${actIdx + 1}`;
    const seg = AUDIO_MAP[actKey] || AUDIO_MAP[`sim_${station}`];
    if (seg) narrate(seg, !muted);
    return () => stopNarration();
  }, [station, actIdx, muted]);

  const nextActivity = () => {
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  const renderActivity = () => {
    const key = `${station}-${actIdx}`;
    if (station === 1) return <BalanceLab key={key} index={actIdx} muted={muted} />;
    if (station === 2) {
      if (actIdx === 0) return <LcdWand key={key} muted={muted} />;
      if (actIdx === 1) return <StepSorter key={key} muted={muted} />;
      return <BalanceHunter key={key} muted={muted} />;
    }
    if (actIdx === 0) return <MistakeDetective key={key} muted={muted} />;
    if (actIdx === 1) return <WordWorkshop key={key} muted={muted} />;
    return <BackwardsMachine key={key} muted={muted} />;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3.5 relative overflow-hidden select-none z-10 w-full max-w-6xl mx-auto">
      <BgSymbols />

      <div className="w-full max-h-[calc(100dvh-5.5rem)] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Glowing Top Indicator Bar */}
        <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-cyan-400 rounded-full mb-1.5 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        <div className="flex items-center justify-between w-full mb-2 shrink-0 px-1">
          <h2 className="font-display font-900 text-xl sm:text-2xl md:text-3xl text-white flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🧪</span>
            <span>Simulation Stations</span>
          </h2>
          <span className="text-[11px] sm:text-xs font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full">
            Grade 7/8 Science Fair Lab
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4.5 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-2.5 shrink-0 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {STATIONS.map(st => (
                <button
                  key={st.n}
                  onClick={() => {
                    setStation(st.n);
                    setActIdx(0);
                  }}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === st.n
                      ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.01]'
                      : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0 ${
                        station === st.n ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                      }`}
                    >
                      {st.icon}
                    </div>
                    <div>
                      <p className="font-display font-900 text-xs sm:text-sm md:text-base leading-tight">{st.name}</p>
                      <p className="text-[11px] sm:text-xs font-extrabold text-slate-300 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm">🔓</span>
                </button>
              ))}
            </div>

            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-xs sm:text-sm md:text-base py-2.5 sm:py-3 px-5 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition mt-1 w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Worlds!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Simulation Arena */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 gap-2">
              {/* Activity Header Bar */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2 shrink-0">
                <h3 className="font-display font-900 text-base sm:text-lg text-cyan-300 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-[11px] sm:text-xs text-slate-200 bg-white/10 px-3 py-0.5 rounded-full border border-white/15 shrink-0">
                  Activity {actIdx + 1} of 3
                </span>
              </div>

              {renderActivity()}
            </div>

            {/* Bottom Sub-Activity Navigation Bar */}
            <div className="flex items-center justify-between border-t border-white/15 pt-2 mt-1 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border border-white/25 text-white font-display font-900 text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[0, 1, 2].map(i => (
                  <button
                    key={i}
                    onClick={() => setActIdx(i)}
                    className={`rounded-full transition-all cursor-pointer ${
                      i === actIdx
                        ? 'w-3 h-3 bg-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextActivity}
                className="btn-gold text-xs sm:text-sm font-900 px-5 sm:px-6 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { BalanceLab, LcdWand, StepSorter, BalanceHunter, MistakeDetective, WordWorkshop, BackwardsMachine };
