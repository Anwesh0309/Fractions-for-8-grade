import React from 'react';

/** One stacked fraction */
export function Frac({ n, d, small = false }) {
  return (
    <span
      className="inline-flex flex-col items-center align-middle mx-[0.12em] leading-none"
      style={{ verticalAlign: '-0.45em' }}
    >
      <span className="px-[0.18em] pb-[0.08em] border-b-[0.09em] border-current text-[0.82em]">{n}</span>
      <span className={`px-[0.18em] pt-[0.08em] ${small ? 'text-[0.78em]' : 'text-[0.82em]'}`}>{d}</span>
    </span>
  );
}

/**
 * Renders strings that contain {num|den} markup as stacked fractions.
 * Everything else is rendered as normal text (newlines preserved).
 */
export function MathText({ text, className = '' }) {
  if (text == null) return null;
  const str = String(text);
  const parts = str.split(/(\{[^{}|]+\|[^{}|]+\})/g);
  return (
    <span className={`whitespace-pre-line ${className}`}>
      {parts.map((p, i) => {
        const m = p.match(/^\{([^{}|]+)\|([^{}|]+)\}$/);
        if (m) return <Frac key={i} n={m[1]} d={m[2]} />;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </span>
  );
}

/** Strip markup to a plain, speakable / readable string */
export function plainMath(text) {
  return String(text).replace(/\{([^{}|]+)\|([^{}|]+)\}/g, '($1)/($2)');
}
