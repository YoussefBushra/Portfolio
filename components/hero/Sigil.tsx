import { forwardRef } from "react";

/* The seal cast around the portrait: counter-rotating rings of runes, an
   eight-point star of two squares, and fine tick rings. Everything is drawn
   as strokes with pathLength=1, so GSAP can "draw" each line on by animating
   stroke-dashoffset from 1 to 0.

   Runes are generated from a fixed seed: server and client render identical
   markup (no hydration mismatch) and there is no font to load. */

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

/** A rune: a stem plus two or three strokes, inside a 4×7 unit cell. */
function rune(r: () => number): string {
  const segs = ["M0 -3.5 V3.5"];
  const n = 2 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const y1 = -3.5 + Math.floor(r() * 5) * 1.5;
    const y2 = y1 + (r() > 0.5 ? 1.5 : -1.5);
    const side = r() > 0.5 ? 2 : -2;
    const k = r();
    segs.push(
      k < 0.45
        ? `M0 ${y1} L${side} ${y2}` // branch
        : k < 0.75
          ? `M${-side} ${y1} L${side} ${y2}` // crossing diagonal
          : `M0 ${y1} Q${side * 1.4} ${(y1 + y2) / 2} 0 ${y2}` // hook
    );
  }
  return segs.join(" ");
}

function runeRing(count: number, radius: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => ({
    d: rune(r),
    angle: (360 / count) * i,
    radius,
  }));
}

const OUTER_RUNES = runeRing(30, 84, 7);
const INNER_RUNES = runeRing(16, 47, 29);

function ticks(count: number, r1: number, r2: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (Math.PI * 2 * i) / count;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return `M${(c * r1).toFixed(2)} ${(s * r1).toFixed(2)} L${(c * r2).toFixed(2)} ${(s * r2).toFixed(2)}`;
  }).join(" ");
}

const S = 52; // half-size of the squares that form the eight-point star

export const Sigil = forwardRef<HTMLDivElement>(function Sigil(_, ref) {
  const line = {
    fill: "none",
    stroke: "currentColor",
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
  };
  const box = { viewBox: "-100 -100 200 200", "aria-hidden": true } as const;

  // One <svg> per ring. Each is its own compositor layer and turns with a CSS
  // transform, so its glow is rasterised once and spun on the GPU — the
  // expensive drop-shadow is not recomputed every frame.
  return (
    <div ref={ref} className="sigil text-accent" aria-hidden>
      {/* Outer ring: double circle with a band of runes. Rotates clockwise. */}
      <svg data-ring="outer" {...box}>
        <circle r={96} strokeWidth={0.7} {...line} />
        <circle r={91} strokeWidth={0.5} {...line} />
        <circle r={77} strokeWidth={0.5} {...line} />
        {OUTER_RUNES.map((g, i) => (
          <path
            key={i}
            d={g.d}
            strokeWidth={0.55}
            strokeLinecap="round"
            transform={`rotate(${g.angle}) translate(0 ${-g.radius})`}
            {...line}
          />
        ))}
        <path d={ticks(90, 91, 94)} strokeWidth={0.4} {...line} />
      </svg>

      {/* Middle: the eight-point star inside a circle. Counter-rotates. */}
      <svg data-ring="middle" {...box}>
        <circle r={72} strokeWidth={0.5} {...line} />
        <rect x={-S} y={-S} width={S * 2} height={S * 2} strokeWidth={0.55} {...line} />
        <rect
          x={-S}
          y={-S}
          width={S * 2}
          height={S * 2}
          strokeWidth={0.55}
          transform="rotate(45)"
          {...line}
        />
      </svg>

      {/* Inner ring of smaller runes and a fine tick scale. */}
      <svg data-ring="inner" {...box}>
        <circle r={54} strokeWidth={0.45} {...line} />
        <circle r={40} strokeWidth={0.45} {...line} />
        {INNER_RUNES.map((g, i) => (
          <path
            key={i}
            d={g.d}
            strokeWidth={0.5}
            strokeLinecap="round"
            transform={`rotate(${g.angle}) translate(0 ${-g.radius}) scale(0.8)`}
            {...line}
          />
        ))}
        <path d={ticks(60, 36, 38.5)} strokeWidth={0.35} {...line} />
      </svg>
    </div>
  );
});
