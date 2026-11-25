/* =========================================================================
   FRACTION + LINEAR-EXPRESSION HELPERS
   Exact rational arithmetic so every equation in the module is computed
   without floating-point rounding errors.
   Fraction markup used in all on-screen strings:   {numerator|denominator}
   e.g.  "{x|3} + 4 = {2x|5} - 1"  ->  stacked fractions in <MathText/>
   ========================================================================= */

export const gcd = (a, b) => {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

export class Fr {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('Zero denominator');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    this.n = n / g;
    this.d = d / g;
  }
  add(o) { return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Fr(this.n * o.n, this.d * o.d); }
  div(o) { return new Fr(this.n * o.d, this.d * o.n); }
  neg() { return new Fr(-this.n, this.d); }
  isZero() { return this.n === 0; }
  isInt() { return this.d === 1; }
  eq(o) { return this.n === o.n && this.d === o.d; }
  val() { return this.n / this.d; }
}
export const F = (n, d = 1) => new Fr(n, d);

/** "5" or "{3|4}" markup for a (possibly negative) fraction */
export function frMarkup(f) {
  if (f.d === 1) return String(f.n);
  return `${f.n < 0 ? '-' : ''}{${Math.abs(f.n)}|${f.d}}`;
}

/** plain number-or-fraction formatting for answer options */
export const fmtNum = (v) => {
  if (Number.isInteger(v)) return String(v);
  return String(Number(v.toFixed(2)));
};

/* -------------------- linear expression  (a·x + c) -------------------- */
export const lin = (xn = 0, xd = 1, cn = 0, cd = 1) => ({ x: F(xn, xd), c: F(cn, cd) });

/** markup for the x-term, e.g. x, 3x, {x|2}, {3x|5} */
export function xTerm(coef) {
  if (coef.isZero()) return '';
  const sign = coef.n < 0 ? -1 : 1;
  const n = Math.abs(coef.n), d = coef.d;
  const body = d === 1
    ? (n === 1 ? 'x' : `${n}x`)
    : (n === 1 ? `{x|${d}}` : `{${n}x|${d}}`);
  return { sign, body };
}

/** markup for a whole linear side, e.g. "{x|2} + 3" or "x - 4" or "0" */
export function linMarkup(e) {
  const parts = [];
  const xt = xTerm(e.x);
  if (xt) parts.push({ sign: xt.sign, body: xt.body });
  if (!e.c.isZero()) {
    const cs = e.c.n < 0 ? -1 : 1;
    const cn = Math.abs(e.c.n);
    parts.push({ sign: cs, body: e.c.d === 1 ? String(cn) : `{${cn}|${e.c.d}}` });
  }
  if (!parts.length) return '0';
  return parts
    .map((p, i) => (i === 0 ? (p.sign < 0 ? `-${p.body}` : p.body) : `${p.sign < 0 ? '-' : '+'} ${p.body}`))
    .join(' ');
}

export const evalLin = (e, xv) => e.x.val() * xv + e.c.val();

/** apply an operation to one side */
export function applyOp(e, op, k) {
  switch (op) {
    case 'add': return { x: e.x, c: e.c.add(k) };
    case 'sub': return { x: e.x, c: e.c.sub(k) };
    case 'mul': return { x: e.x.mul(k), c: e.c.mul(k) };
    case 'div': return { x: e.x.div(k), c: e.c.div(k) };
    default: return e;
  }
}

export const OP_SYMBOL = { add: '+', sub: '−', mul: '×', div: '÷' };
