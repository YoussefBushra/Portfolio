import { forwardRef, type SVGProps } from "react";

/* The energy seal that forms around the portrait for the finale of a view
   switch: segmented arc rings, a dashed counter-rotating ring, crosshair ticks
   and a hexagonal core with nodes. Every line uses pathLength=1 so it can be
   "drawn on" by animating stroke-dashoffset from 1 to 0.

   Each ring is its own <svg> and turns with a CSS transform. The glow is not a
   blur filter (re-rasterised every frame while lines draw on — too slow on
   phones): every line is drawn twice, a wide faint halo under a crisp core,
   which costs no more than the line itself. */

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

function polygon(sides: number, r: number, offset: number) {
  return (
    Array.from(
      { length: sides },
      (_, i) => `${i ? "L" : "M"}${pt(r, offset + (360 / sides) * i)}`,
    ).join(" ") + " Z"
  );
}

const OUTER_ARCS = arcs(92, [-35, 55, 145, 235], 70);
const OUTER_TICKS = ticks(72, 85.5, 88, 6);
const CONTAIN = arcs(98, [0, 180], 180);
const DASH_RING = arcs(
  76,
  Array.from({ length: 30 }, (_, i) => i * 12),
  7,
);
const MARKERS = [0, 120, 240]
  .map((a) => `M${pt(68, a - 3)} L${pt(72.5, a)} L${pt(68, a + 3)}`)
  .join(" ");
const INNER_RING = arcs(58, [0, 90, 180, 270], 80);
const CROSS = [0, 90, 180, 270]
  .map((a) => `M${pt(49, a)} L${pt(66, a)}`)
  .join(" ");
const HEX = polygon(6, 40, -90);
const SPOKES = Array.from({ length: 6 }, (_, i) => {
  const a = -90 + i * 60;
  return `M${pt(40, a)} L${pt(49, a)}`;
}).join(" ");
const NODES = Array.from({ length: 6 }, (_, i) => -90 + i * 60);

const LINE = {
  fill: "none",
  stroke: "currentColor",
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
} as const;

/** A line with its halo; the finale draws both on together. */
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

/** A ring's own layer, only as large as the ring (extent `e` in seal units):
 *  a smaller layer is cheaper to spin. */
function box(e: number) {
  const pad = `${50 - e / 2}%`;
  return {
    viewBox: `${-e} ${-e} ${e * 2} ${e * 2}`,
    style: { left: pad, top: pad, width: `${e}%`, height: `${e}%` },
    "aria-hidden": true,
  } as const;
}

export const Seal = forwardRef<HTMLDivElement>(function Seal(_, ref) {
  return (
    <div ref={ref} className="seal" aria-hidden>
      <svg data-ring="outer" {...box(100)}>
        <Glow d={CONTAIN} w={0.4} />
        <Glow d={OUTER_ARCS} w={0.9} strokeLinecap="round" />
        <Glow d={OUTER_TICKS} w={0.4} />
      </svg>

      <svg data-ring="middle" {...box(80)}>
        <Glow d={DASH_RING} w={0.6} />
        <Glow d={MARKERS} w={0.6} strokeLinejoin="round" />
      </svg>

      <svg data-ring="inner" {...box(68)}>
        <Glow d={INNER_RING} w={0.5} />
        <Glow d={CROSS} w={0.5} />
      </svg>

      <svg data-ring="core" {...box(52)}>
        <Glow d={HEX} w={0.6} strokeLinejoin="round" />
        <Glow d={SPOKES} w={0.5} />
        {NODES.map((a) => {
          const [x, y] = pt(40, a).split(" ");
          return (
            <circle
              key={a}
              cx={x}
              cy={y}
              r={1.6}
              data-node=""
              fill="currentColor"
            />
          );
        })}
      </svg>
    </div>
  );
});
