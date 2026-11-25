/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Grade 8 · Equations with Fractions
   Every question is generated from exact fraction arithmetic, so each has
   one verified correct answer and distractors that mirror real student
   misconceptions (forgetting to flip the reciprocal, sign slips, wrong LCD…).

   On-screen math uses the markup  {numerator|denominator}  (see MathText).
   ========================================================================= */
import { F, Fr, gcd, lcm, frMarkup } from './fractions.js';
import { PRACTICE_QUESTIONS } from './practiceQuestions.js';

export { PRACTICE_QUESTIONS };

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Balance Bay",         icon: "⚖️", range: "Q1–10",   difficulty: 1, pool: ['inverse_op', 'one_step_div', 'one_step_div'] },
  { id: 1, name: "Pizza Slice Plaza",   icon: "🍕", range: "Q11–20",  difficulty: 1, pool: ['coef_frac', 'one_step_div', 'inverse_op'] },
  { id: 2, name: "Reciprocal Ridge",    icon: "🔄", range: "Q21–30",  difficulty: 2, pool: ['reciprocal', 'coef_frac', 'coef_frac'] },
  { id: 3, name: "Two-Step Tower",      icon: "🏰", range: "Q31–40",  difficulty: 2, pool: ['two_step_add', 'two_step_sub', 'frac_coef_two_step'] },
  { id: 4, name: "LCD Lagoon",          icon: "🌊", range: "Q41–50",  difficulty: 3, pool: ['lcd_pick', 'lcd_sum', 'lcd_sum'] },
  { id: 5, name: "Numerator Nook",      icon: "🧮", range: "Q51–60",  difficulty: 3, pool: ['numerator_group', 'numerator_group', 'frac_coef_two_step'] },
  { id: 6, name: "Word Problem Market", icon: "🛒", range: "Q61–70",  difficulty: 3, pool: ['word'] },
  { id: 7, name: "Both-Sides Bridge",   icon: "🌉", range: "Q71–80",  difficulty: 4, pool: ['both_sides', 'both_sides', 'lcd_sum'] },
  { id: 8, name: "Mistake Mine",        icon: "⛏️", range: "Q81–90",  difficulty: 4, pool: ['find_error', 'verify', 'find_error', 'verify'] },
  {
    id: 9, name: "Champion Summit", icon: "🏔️", range: "Q91–100", difficulty: 4,
    pool: ['one_step_div', 'coef_frac', 'two_step_add', 'two_step_sub', 'frac_coef_two_step', 'lcd_sum', 'numerator_group', 'both_sides', 'word', 'find_error', 'verify']
  }
];

const RULES = {
  inverse_op: "INVERSE OPERATIONS",
  one_step_div: "UNDO THE DIVISION",
  coef_frac: "RECIPROCAL RULE",
  reciprocal: "RECIPROCAL RULE",
  two_step_add: "TWO-STEP ORDER",
  two_step_sub: "TWO-STEP ORDER",
  frac_coef_two_step: "TWO-STEP ORDER",
  lcd_pick: "LCD RULE",
  lcd_sum: "CLEAR WITH THE LCD",
  numerator_group: "CLEAR THE DENOMINATOR",
  both_sides: "COLLECT THE x TERMS",
  word: "WRITE THE EQUATION",
  verify: "SUBSTITUTE & CHECK",
  find_error: "SPOT THE MISTAKE"
};

/* ----------------------------- helpers ----------------------------- */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const toFr = (v) => (v instanceof Fr ? v : F(Math.round(v)));
const MINUS = '−';

/** p/q in lowest terms with p < q */
function coprimePair(qMin, qMax, pMin = 2) {
  for (let i = 0; i < 50; i++) {
    const q = randInt(qMin, qMax);
    const p = randInt(pMin, q - 1);
    if (p >= 1 && gcd(p, q) === 1) return [p, q];
  }
  return [2, 3];
}

/** Assemble 4 shuffled options. correct/wrongs are Fr|number; fmt turns an Fr into text. */
function numChoices(correct, wrongs, fmt, fillers = []) {
  const c = toFr(correct);
  const cStr = fmt(c);
  const seen = new Set([cStr]);
  const picked = [];
  const consider = (w) => {
    const f = toFr(w);
    if (f.n <= 0) return;
    const s = fmt(f);
    if (seen.has(s)) return;
    seen.add(s);
    picked.push(s);
  };
  wrongs.forEach(consider);
  fillers.forEach(consider);
  let step = 1;
  while (picked.length < 3 && step < 40) {
    consider(c.add(F(step)));
    consider(c.sub(F(step)));
    step += 1;
  }
  const opts = [cStr, ...picked.slice(0, 3)];
  const shuffled = shuffle(opts);
  return { options: shuffled, correctIndex: shuffled.indexOf(cStr) };
}

/** Assemble options from literal strings */
function textChoices(correct, wrongs) {
  const unique = [...new Set(wrongs)].filter(w => w !== correct).slice(0, 3);
  const opts = shuffle([correct, ...unique]);
  return { options: opts, correctIndex: opts.indexOf(correct) };
}

const cx = (n) => (n === 1 ? 'x' : `${n}x`);
const xEq = (f) => `x = ${frMarkup(f)}`;

function fmtPlain(v) {
  if (Number.isInteger(v)) return String(v);
  return String(Number(v.toFixed(2)));
}

/* ------------------------- question archetypes ------------------------- */
const BUILDERS = {
  /* conceptual: which inverse operation? */
  inverse_op(ctx) {
    const a = randInt(2, 9);
    const b = randInt(2, 12);
    const { options, correctIndex } = textChoices(
      `Multiply both sides by ${a}`,
      [`Divide both sides by ${a}`, `Add ${a} to both sides`, `Subtract ${a} from both sides`]
    );
    return {
      prompt: `${ctx.name} wants to solve {x|${a}} = ${b}. What should ${ctx.name} do to both sides to get x alone?`,
      options, correctIndex,
      diagram: { left: `{x|${a}}`, right: `${b}`, tilt: 0 },
      explanation: `x is divided by ${a}, so undo it by multiplying both sides by ${a}: x = ${a} × ${b} = ${a * b}.`
    };
  },

  one_step_div(ctx) {
    const d = ctx.diff;
    const a = randInt(2, 4 + 2 * d);
    const b = randInt(2, 6 + 3 * d);
    const x = a * b;
    const { options, correctIndex } = numChoices(x,
      [a + b, F(b, a), x + a, Math.abs(x - a), b], xEq, [x * 2]);
    return {
      prompt: `Solve for x:   {x|${a}} = ${b}`,
      options, correctIndex,
      diagram: { left: `{x|${a}}`, right: `${b}`, tilt: 0 },
      explanation: `Multiply both sides by ${a}: x = ${b} × ${a} = ${x}.`
    };
  },

  coef_frac(ctx) {
    const d = ctx.diff;
    const [p, q] = d === 1 ? coprimePair(3, 5) : coprimePair(3, 8);
    const k = randInt(2, 3 + 2 * d);
    const c = p * k;
    const x = q * k;
    const { options, correctIndex } = numChoices(x,
      [F(c * p, q), c * q, c + q, x + q, Math.abs(x - q)], xEq, [c + p]);
    return {
      prompt: `Solve for x:   {${p}x|${q}} = ${c}`,
      options, correctIndex,
      diagram: { left: `{${p}x|${q}}`, right: `${c}`, tilt: 0 },
      explanation: `Multiply both sides by the reciprocal {${q}|${p}}: x = ${c} × {${q}|${p}} = ${x}.`
    };
  },

  reciprocal(ctx) {
    const [p, q] = coprimePair(3, 9);
    const k = randInt(2, 6);
    const c = p * k;
    const { options, correctIndex } = textChoices(`{${q}|${p}}`,
      [`{${p}|${q}}`, `-{${p}|${q}}`, `${p * q}`, `${q}`, `${p}`]);
    return {
      prompt: `${ctx.name} is solving {${p}x|${q}} = ${c}. What should both sides be multiplied by to leave x alone?`,
      options, correctIndex,
      diagram: { left: `{${p}x|${q}}`, right: `${c}`, tilt: 0 },
      explanation: `The reciprocal of {${p}|${q}} is {${q}|${p}}, because {${p}|${q}} × {${q}|${p}} = 1. That leaves x alone.`
    };
  },

  two_step_add(ctx) {
    const d = ctx.diff;
    const a = randInt(2, 4 + d);
    const b = randInt(1, 6 + d);
    const k = randInt(2, 4 + 2 * d);
    const c = k + b;
    const x = a * k;
    const { options, correctIndex } = numChoices(x,
      [a * c - b, a * (c + b), c - b, F(c - b, a), a * c], xEq, [x + a]);
    return {
      prompt: `Solve for x:   {x|${a}} + ${b} = ${c}`,
      options, correctIndex,
      diagram: { left: `{x|${a}} + ${b}`, right: `${c}`, tilt: 0 },
      explanation: `Subtract ${b}: {x|${a}} = ${k}. Then multiply by ${a}: x = ${a} × ${k} = ${x}.`
    };
  },

  two_step_sub(ctx) {
    const d = ctx.diff;
    const a = randInt(2, 4 + d);
    const b = randInt(1, 5 + d);
    const k = b + randInt(1, 5 + d);
    const c = k - b;
    const x = a * k;
    const { options, correctIndex } = numChoices(x,
      [a * c + b, a * (c - b), c + b, F(c + b, a), a * c], xEq, [x + a]);
    return {
      prompt: `Solve for x:   {x|${a}} ${MINUS} ${b} = ${c}`,
      options, correctIndex,
      diagram: { left: `{x|${a}} ${MINUS} ${b}`, right: `${c}`, tilt: 0 },
      explanation: `Add ${b}: {x|${a}} = ${k}. Then multiply by ${a}: x = ${a} × ${k} = ${x}.`
    };
  },

  frac_coef_two_step(ctx) {
    const [p, q] = coprimePair(3, 6);
    const b = randInt(1, 8);
    const sub = Math.random() < 0.4;
    let kk = randInt(2, 3 + ctx.diff);
    while (sub && p * kk <= b) kk += 1;
    const r = p * kk;                 // value of the fraction term
    const c = sub ? r - b : r + b;    // right-hand side
    const x = q * kk;
    const rWrong = sub ? c - b : c + b;
    const { options, correctIndex } = numChoices(x,
      [q * r, F(r * p, q), F(q * rWrong, p), F(c * q, p), x + q], xEq, [x + 2 * q]);
    const sym = sub ? MINUS : '+';
    return {
      prompt: `Solve for x:   {${p}x|${q}} ${sym} ${b} = ${c}`,
      options, correctIndex,
      diagram: { left: `{${p}x|${q}} ${sym} ${b}`, right: `${c}`, tilt: 0 },
      explanation: `${sub ? 'Add' : 'Subtract'} ${b}: {${p}x|${q}} = ${r}. Multiply by {${q}|${p}}: x = ${r} × {${q}|${p}} = ${x}.`
    };
  },

  lcd_pick() {
    const [a, b] = pick([[4, 6], [6, 8], [3, 4], [2, 5], [6, 9], [4, 10], [8, 12], [9, 12], [3, 5], [5, 6], [4, 14], [6, 10]]);
    const L = lcm(a, b);
    const { options, correctIndex } = numChoices(L,
      [a * b, Math.max(a, b), a + b, L * 2, L + a], v => String(v.n), [L + b]);
    return {
      prompt: `What is the lowest common denominator (LCD) of {1|${a}} and {1|${b}}?`,
      options, correctIndex,
      diagram: { left: `{1|${a}}`, right: `{1|${b}}`, tilt: 0 },
      explanation: `The smallest number that both ${a} and ${b} divide into is ${L}, so the LCD is ${L}.`
    };
  },

  lcd_sum(ctx) {
    const pairs = ctx.diff >= 4
      ? [[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [4, 5]]
      : [[2, 3], [3, 4], [2, 4], [3, 6], [2, 5], [4, 6]];
    const [a, b] = pick(pairs);
    const L = lcm(a, b);
    const minus = ctx.diff >= 4 && Math.random() < 0.5;
    const [pa, pb] = minus ? [Math.min(a, b), Math.max(a, b)] : [a, b];
    const k = randInt(1, 4);
    const x = L * k;
    const ca = L / pa, cb = L / pb;
    const total = minus ? ca - cb : ca + cb;
    const c = total * k;
    const sym = minus ? MINUS : '+';
    const { options, correctIndex } = numChoices(x,
      [c * (a + b), c * L, c * a * b, x + L, Math.abs(x - L)], xEq, [x * 2]);
    return {
      prompt: `Solve for x:   {x|${pa}} ${sym} {x|${pb}} = ${c}`,
      options, correctIndex,
      diagram: { left: `{x|${pa}} ${sym} {x|${pb}}`, right: `${c}`, tilt: 0 },
      explanation: `LCD = ${L}. Multiply every term by ${L}: ${cx(ca)} ${sym} ${cx(cb)} = ${L * c}, so ${cx(total)} = ${L * c} and x = ${x}.`
    };
  },

  numerator_group() {
    const a = randInt(2, 6);
    const b = randInt(1, 9);
    const c = randInt(3, 9);
    const minus = Math.random() < 0.5;
    const x = minus ? a * c + b : a * c - b;
    const sym = minus ? MINUS : '+';
    const { options, correctIndex } = numChoices(x,
      [minus ? c + b : c - b, minus ? a * c - b : a * c + b, minus ? a * (c + b) : a * (c - b), a * c], xEq, [x + a]);
    return {
      prompt: `Solve for x:   {x ${sym} ${b}|${a}} = ${c}`,
      options, correctIndex,
      diagram: { left: `{x ${sym} ${b}|${a}}`, right: `${c}`, tilt: 0 },
      explanation: `Multiply both sides by ${a}: x ${sym} ${b} = ${a * c}. Then ${minus ? 'add' : 'subtract'} ${b}: x = ${x}.`
    };
  },

  both_sides() {
    const [m, n] = pick([[2, 3], [2, 4], [3, 4], [2, 5], [3, 5], [3, 6], [4, 6]]);   // m < n
    const L = lcm(m, n);
    const per = L / m - L / n;
    const k = randInt(2, 5);
    const x = L * k;
    const D = k * per;
    const b = randInt(1, D - 1);
    const dd = D - b;
    const { options, correctIndex } = numChoices(x,
      [x + L, Math.abs(x - L), D * m * n, x * 2, L * (k + 2)], xEq, [x + 2 * L]);
    return {
      prompt: `Solve for x:   {x|${n}} + ${b} = {x|${m}} ${MINUS} ${dd}`,
      options, correctIndex,
      diagram: { left: `{x|${n}} + ${b}`, right: `{x|${m}} ${MINUS} ${dd}`, tilt: 0 },
      explanation: `LCD = ${L}. Multiply every term: ${cx(L / n)} + ${L * b} = ${cx(L / m)} ${MINUS} ${L * dd}. Collect x: ${L * D} = ${cx(per)}, so x = ${x}.`
    };
  },

  word(ctx) {
    const kind = pick(['share', 'spend', 'ribbon', 'two']);
    const name = ctx.name;
    if (kind === 'share') {
      const a = randInt(3, 6), b = randInt(2, 9), k = randInt(2, 8);
      const c = k + b, x = a * k;
      const { options, correctIndex } = numChoices(x, [a * c - b, a * (c + b), c - b, a * c], v => `${v.n} marbles`, [x + a]);
      return {
        prompt: `${name} shares a bag of marbles equally among ${a} friends. One friend's share plus ${b} extra marbles makes ${c} marbles. How many marbles were in the bag?`,
        options, correctIndex,
        diagram: { left: `?`, right: `${c}`, tilt: 0, rightLabel: 'total marbles' },
        explanation: `Let x = marbles in the bag. {x|${a}} + ${b} = ${c}, so {x|${a}} = ${k} and x = ${x} marbles.`
      };
    }
    if (kind === 'spend') {
      const [p, q] = coprimePair(3, 6);
      const k = randInt(2, 9);
      const c = p * k, x = q * k;
      const { options, correctIndex } = numChoices(x, [F(c * p, q), c * q, c + q, x + q], v => `$${v.n}`, [x + 2]);
      return {
        prompt: `${name} spent {${p}|${q}} of her savings on a game that cost $${c}. How much were her savings?`,
        options, correctIndex,
        diagram: { left: `?`, right: `$${c}`, tilt: 0, rightLabel: `{${p}|${q}} of savings` },
        explanation: `Let x = savings. {${p}x|${q}} = ${c}, so x = ${c} × {${q}|${p}} = $${x}.`
      };
    }
    if (kind === 'ribbon') {
      const [p, q] = coprimePair(3, 5);
      const b = randInt(1, 5);
      let k = randInt(2, 7);
      while (p * k - b <= 0) k += 1;
      const c = p * k - b, x = q * k;
      const { options, correctIndex } = numChoices(x, [q * (c - b > 0 ? c - b : c), F((c + b) * p, q), q * c, c + b], v => `${v.n} m`, [x + q]);
      return {
        prompt: `A ribbon is cut so that {${p}|${q}} of its length, minus ${b} m for a bow, leaves ${c} m. How long was the ribbon?`,
        options, correctIndex,
        diagram: { left: `?`, right: `${c} m`, tilt: 0, rightLabel: 'left over' },
        explanation: `Let x = ribbon length. {${p}x|${q}} ${MINUS} ${b} = ${c}, so {${p}x|${q}} = ${c + b} and x = ${x} m.`
      };
    }
    const [a, b] = pick([[2, 3], [3, 4], [2, 4], [3, 6], [2, 5]]);
    const L = lcm(a, b), k = randInt(1, 4);
    const x = L * k, c = (L / a + L / b) * k;
    const { options, correctIndex } = numChoices(x, [c * (a + b), c * L, c * a * b, x + L], v => `${v.n} m`, [x * 2]);
    return {
      prompt: `${name} uses {1|${a}} of a ribbon for a bow and {1|${b}} of it for a card. Together these use ${c} m. How long was the whole ribbon?`,
      options, correctIndex,
      diagram: { left: `?`, right: `${c} m`, tilt: 0, rightLabel: 'ribbon used' },
      explanation: `Let x = ribbon length. {x|${a}} + {x|${b}} = ${c}. LCD ${L}: ${cx(L / a)} + ${cx(L / b)} = ${L * c}, so x = ${x} m.`
    };
  },

  verify(ctx) {
    const a = randInt(2, 5), b = randInt(1, 8), k = randInt(2, 7);
    const c = k + b;
    const xTrue = a * k;
    const isSol = Math.random() < 0.5;
    let v = isSol ? xTrue : xTrue + pick([-1, 1]) * a * randInt(1, 2);
    if (v <= 0) v = xTrue + a;
    const solved = v === xTrue;
    const left = v / a + b;
    const { options, correctIndex } = solved
      ? textChoices(`Yes: both sides equal ${c}`,
        [`No: the left side is ${c + 1} but the right side is ${c}`, `No: the left side is ${c - 1} but the right side is ${c}`, `Yes: both sides equal ${left + 1}`])
      : textChoices(`No: the left side is ${fmtPlain(left)} but the right side is ${c}`,
        [`Yes: both sides equal ${c}`, `Yes: both sides equal ${fmtPlain(left)}`, `No: the left side is ${fmtPlain(left + 2)} but the right side is ${c}`]);
    return {
      prompt: `${ctx.name} says x = ${v} solves {x|${a}} + ${b} = ${c}. Substitute x = ${v} to check. Is ${ctx.name} right?`,
      options, correctIndex,
      diagram: { left: `{${v}|${a}} + ${b}`, right: `${c}`, tilt: solved ? 0 : (left > c ? -9 : 9) },
      explanation: `Left side: {${v}|${a}} + ${b} = ${fmtPlain(v / a)} + ${b} = ${fmtPlain(left)}. Right side = ${c}. ${solved ? `They match, so x = ${v} is a solution.` : `They are not equal, so x = ${v} is not a solution.`}`
    };
  },

  find_error(ctx) {
    const [p, q] = coprimePair(3, 6);
    const b = randInt(1, 8), k = randInt(2, 5);
    const c = p * k + b;
    const errIdx = pick([0, 1, 2, 3, 0, 1, 2]);    // 3 = no mistake
    const t1 = errIdx === 0 ? c + b : c - b;
    const m = errIdx === 1 ? p : q;
    const t2 = m * t1;
    const div = errIdx === 2 ? q : p;
    const t3 = F(t2, div);
    const s1 = `Step 1:  {${p}x|${q}} = ${c} ${errIdx === 0 ? '+' : MINUS} ${b} = ${t1}`;
    const s2 = `Step 2:  ${p}x = ${m} × ${t1} = ${t2}`;
    const s3 = `Step 3:  x = ${t2} ÷ ${div} = ${frMarkup(t3)}`;
    const answer = errIdx === 3 ? 'There is no mistake' : `Step ${errIdx + 1}`;
    const { options, correctIndex } = textChoices(answer, ['Step 1', 'Step 2', 'Step 3', 'There is no mistake']);
    const reasons = [
      `In Step 1 the ${b} must be subtracted from both sides (${c} ${MINUS} ${b} = ${c - b}), not added.`,
      `In Step 2 both sides must be multiplied by the denominator ${q}, not by ${p}.`,
      `In Step 3 divide by the coefficient ${p}, not by ${q}.`,
      `Every step is correct, so x = ${q * k}.`
    ];
    return {
      prompt: `${ctx.name} solved {${p}x|${q}} + ${b} = ${c} like this:\n${s1}\n${s2}\n${s3}\nWhich step contains the first mistake?`,
      options, correctIndex,
      diagram: { left: `{${p}x|${q}} + ${b}`, right: `${c}`, tilt: 0 },
      explanation: reasons[errIdx]
    };
  }
};

/**
 * Generate a procedural question for a given world.
 * `avoid` = prompts already used in this run, so a world never repeats a question.
 */
export function makeQuestion(worldIndex = 0, avoid = [], qIndex = 0) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const idx = worldIndex * 10 + (qIndex % 10);
  if (PRACTICE_QUESTIONS && PRACTICE_QUESTIONS[idx]) {
    return { ...PRACTICE_QUESTIONS[idx], world };
  }
  let q = null;
  for (let attempt = 0; attempt < 12; attempt++) {
    const name = pick(WESTERN_NAMES);
    const archetype = pick(world.pool);
    const ctx = { name, diff: world.difficulty };
    q = { ...BUILDERS[archetype](ctx), world, name, archetype, rule: RULES[archetype] };
    if (!avoid.includes(q.prompt)) break;
  }
  return q;
}
