import React from 'react';

/* ---------- tiny SVG math layout: supports {num|den} fraction markup ---------- */
const CHAR_W = 0.6;

function tokenize(text) {
  const out = [];
  String(text).split(/(\{[^{}|]+\|[^{}|]+\})/g).forEach(p => {
    if (!p) return;
    const m = p.match(/^\{([^{}|]+)\|([^{}|]+)\}$/);
    if (m) out.push({ t: 'f', n: m[1], d: m[2] });
    else out.push({ t: 's', s: p });
  });
  return out;
}

function textWidth(s, size) {
  let w = 0;
  for (const ch of s) w += (ch === ' ' ? 0.34 : CHAR_W) * size;
  return w;
}

export function measureMath(text, size) {
  const fs = size * 0.78;
  return tokenize(text).reduce((acc, tk) => {
    if (tk.t === 's') return acc + textWidth(tk.s, size);
    return acc + Math.max(textWidth(tk.n, fs), textWidth(tk.d, fs)) + size * 0.34;
  }, 0);
}

export function SvgMath({ text, x, y, size = 24, fill = '#fff', weight = 900 }) {
  const toks = tokenize(text);
  const fs = size * 0.78;
  const total = measureMath(text, size);
  let cur = x - total / 2;
  const els = [];
  toks.forEach((tk, i) => {
    if (tk.t === 's') {
      const w = textWidth(tk.s, size);
      const lead = tk.s.length - tk.s.trimStart().length;
      const trimmed = tk.s.trim();
      els.push(
        <text key={i} x={cur + lead * 0.34 * size} y={y + size * 0.36} fill={fill} fontSize={size} fontWeight={weight}
          fontFamily="Fredoka One, Nunito, sans-serif">{trimmed}</text>
      );
      cur += w;
    } else {
      const w = Math.max(textWidth(tk.n, fs), textWidth(tk.d, fs)) + size * 0.34;
      const mid = cur + w / 2;
      els.push(
        <g key={i}>
          <text x={mid} y={y - size * 0.1} fill={fill} fontSize={fs} fontWeight={weight} textAnchor="middle"
            fontFamily="Fredoka One, Nunito, sans-serif">{tk.n}</text>
          <line x1={cur + size * 0.08} x2={cur + w - size * 0.08} y1={y} y2={y} stroke={fill} strokeWidth={Math.max(2, size * 0.08)} strokeLinecap="round" />
          <text x={mid} y={y + fs * 0.72 + size * 0.1} fill={fill} fontSize={fs} fontWeight={weight} textAnchor="middle"
            fontFamily="Fredoka One, Nunito, sans-serif">{tk.d}</text>
        </g>
      );
      cur += w;
    }
  });
  return <g>{els}</g>;
}

/**
 * Animated balance scale.
 *  tilt > 0  => right pan heavier (goes down)
 *  tilt < 0  => left pan heavier
 */
export function BalanceScale({
  left = 'x',
  right = '0',
  tilt = 0,
  maxWidth = 520,
  leftColor = '#a78bfa',
  rightColor = '#38bdf8',
  glow = true,
  leftLabel,
  rightLabel,
  leftItem,
  rightItem
}) {
  const t = Math.max(-16, Math.min(16, tilt));
  const L = 175;
  const PY = 62;
  const CX = 260;

  const fit = (txt) => {
    const w = measureMath(txt, 28);
    if (w <= 128) return 28;
    return Math.max(16, Math.floor(28 * (128 / w)));
  };

  const Pan = ({ side, text, color, label, item }) => {
    const sgn = side === 'L' ? -1 : 1;
    const size = fit(text);
    const heavier = (side === 'R' && t > 1) || (side === 'L' && t < -1);
    return (
      <g transform={`translate(${sgn * L}, 0)`}>
        <g style={{ transform: `rotate(${-t}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.7s cubic-bezier(.3,1.4,.5,1)' }}>
          {/* strings */}
          <line x1="0" y1="0" x2="-82" y2="100" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="0" y1="0" x2="82" y2="100" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="6" fill="#facc15" />
          {/* pan bowl */}
          <path d="M -92 104 L 92 104 Q 84 140 0 140 Q -84 140 -92 104 Z" fill={color} stroke="#ffffff" strokeWidth="2.5" opacity="0.95" />
          {item && (
            <text x="0" y="126" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="Nunito, sans-serif" dropShadow="0 1px 3px rgba(0,0,0,0.5)">
              {item}
            </text>
          )}
          {/* expression card */}
          <rect x="-80" y="42" width="160" height="58" rx="16" fill="#12072b" stroke={heavier ? '#facc15' : color} strokeWidth={heavier ? 4 : 2.5} />
          <SvgMath text={text} x={0} y={71} size={size} fill="#ffffff" />
          {label && (
            <text x="0" y="168" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontWeight="800" fontFamily="Nunito, sans-serif">{label}</text>
          )}
        </g>
      </g>
    );
  };

  return (
    <svg viewBox="-24 0 568 285" style={{ width: '100%', maxWidth }} className={glow ? 'drop-shadow-[0_0_18px_rgba(139,92,246,0.45)]' : ''}>
      {/* stand */}
      <path d="M 200 270 L 320 270 L 296 244 L 224 244 Z" fill="#4c1d95" stroke="#c4b5fd" strokeWidth="2.5" />
      <rect x="252" y={PY} width="16" height={244 - PY} rx="6" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
      {/* beam + pans (rotating group) */}
      <g transform={`translate(${CX}, ${PY})`}>
        <g style={{ transform: `rotate(${t}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.7s cubic-bezier(.3,1.4,.5,1)' }}>
          <rect x={-L - 8} y="-8" width={(L + 8) * 2} height="16" rx="8" fill="#facc15" stroke="#fef08a" strokeWidth="2.5" />
          <Pan side="L" text={left} color={leftColor} label={leftLabel} item={leftItem} />
          <Pan side="R" text={right} color={rightColor} label={rightLabel} item={rightItem} />
        </g>
        {/* pivot */}
        <circle cx="0" cy="0" r="15" fill="#fde047" stroke="#b45309" strokeWidth="3" />
        <circle cx="0" cy="0" r="5" fill="#78350f" />
      </g>
    </svg>
  );
}
