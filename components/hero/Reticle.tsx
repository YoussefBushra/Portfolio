import { forwardRef, type SVGProps } from "react";

/* The HUD that locks onto the portrait during a view switch: segmented arc
   rings, a dashed counter-rotating ring, crosshair ticks, target-lock brackets
   and mono readouts. Every line uses pathLength=1 so it can be "drawn on" by
   animating stroke-dashoffset from 1 to 0.

   Each rotating ring is its own <svg> and turns with a CSS transform. The glow
   is not a blur filter (re-rasterised every frame while lines draw on — too
   slow on phones): every line is drawn twice, a wide faint halo under a crisp
   core, which costs no more than the line itself. The brackets and readouts
   sit on a layer that doesn't rotate. */

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) =>
  `${(Math.cos(rad(deg)) * r).toFixed(2)} ${(Math.sin(rad(deg)) * r).toFixed(2)}`;

/** Arc segments of `len` degrees starting at each angle in `starts`. */
function arcs(r: number, starts: number[], len: number) {
  return starts
    .map((a) => `M${pt(r, a)} A${r} ${r} 0 0 1 ${pt(r, a + len)}`)
    .join(" ");
}

function ticks(count: number, r1: number, r2: number, every = 1) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (360 / count) * i;
    const long = i % every === 0;
    out.push(`M${pt(r1, a)} L${pt(long ? r2 + 1.5 : r2, a)}`);
  }
  return out.join(" ");
}

const OUTER_ARCS = arcs(92, [-35, 55, 145, 235], 70);
const OUTER_TICKS = ticks(72, 85.5, 88, 6);
const DASH_RING = arcs(
  76,
  Array.from({ length: 30 }, (_, i) => i * 12),
  7,
);
const INNER_RING = arcs(58, [0, 90, 180, 270], 80);
const CROSS = [0, 90, 180, 270]
  .map((a) => `M${pt(49, a)} L${pt(66, a)}`)
  .join(" ");
const MARKERS = [0, 120, 240]
  .map((a) => `M${pt(68, a - 3)} L${pt(72.5, a)} L${pt(68, a + 3)}`)
  .join(" ");

/** Target-lock brackets around the face. */
const B = 22;
const L = 8;
const BRACKETS = [
  `M${-B} ${-B + L} V${-B} H${-B + L}`,
  `M${B - L} ${-B} H${B} V${-B + L}`,
  `M${-B} ${B - L} V${B} H${-B + L}`,
  `M${B - L} ${B} H${B} V${B - L}`,
].join(" ");

const LINE = {
  fill: "none",
  stroke: "currentColor",
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
} as const;

/** A line with its halo; cast.ts draws both on together. */
function Glow({
  d,
  w,
  ...rest
}: { d: string; w: number } & SVGProps<SVGPathElement>) {
  return (
    <>
      <path
        d={d}
        data-halo=""
        strokeWidth={w * 4}
        strokeOpacity={0.16}
        strokeLinecap="round"
        {...LINE}
      />
      <path d={d} data-core="" strokeWidth={w} {...rest} {...LINE} />
    </>
  );
}

export const Reticle = forwardRef<HTMLDivElement>(function Reticle(_, ref) {
  const box = { viewBox: "-100 -100 200 200", "aria-hidden": true } as const;

  return (
    <div ref={ref} className="reticle" aria-hidden>
      <svg data-ring="outer" {...box}>
        <Glow d={OUTER_ARCS} w={0.9} strokeLinecap="round" />
        <Glow d={OUTER_TICKS} w={0.4} />
      </svg>

      <svg data-ring="middle" {...box}>
        <Glow d={DASH_RING} w={0.6} />
        <Glow d={MARKERS} w={0.6} strokeLinejoin="round" />
      </svg>

      <svg data-ring="inner" {...box}>
        <Glow d={INNER_RING} w={0.5} />
        <Glow d={CROSS} w={0.5} />
      </svg>

      {/* Non-rotating: lock brackets and readouts (below the photo frame). */}
      <svg data-part="lock" {...box}>
        <Glow d={BRACKETS} w={0.9} strokeLinecap="square" />
        <text
          data-part="target"
          x={0}
          y={71}
          textAnchor="middle"
          className="reticle-label"
        >
          TARGET // Y.BUSHRA
        </text>
        <text
          data-part="status"
          x={0}
          y={77.5}
          textAnchor="middle"
          className="reticle-label"
        >
          RECOMPILE 000%
        </text>
      </svg>
    </div>
  );
});
