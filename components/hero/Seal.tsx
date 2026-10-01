import { forwardRef, type SVGProps } from "react";

/* The gate that forms around the portrait for the finale of a view switch:
   a hexagonal frame of heavy bars, six chevrons at its corners that lock one
   by one as it powers up, a dashed outer guide and an inner segmented ring
   that turns with the portal. Straight edges and corners throughout — a
   doorway, not a sphere. The portal's aperture opens to the gate's size.

   Every line uses pathLength=1 so it can be "drawn on" by animating
   stroke-dashoffset from 1 to 0. The glow is drawn into the SVG — a wide
   faint halo under each crisp line — rather than a blur filter, which would
   be re-rasterised every frame while lines draw on. */

const rad = (deg: number) => (deg * Math.PI) / 180;
const xy = (r: number, deg: number) =>
  [Math.cos(rad(deg)) * r, Math.sin(rad(deg)) * r] as const;
const pt = (r: number, deg: number) =>
  xy(r, deg)
    .map((v) => v.toFixed(2))
    .join(" ");

/** Hex corner angles, first corner pointing up. */
const CORNERS = Array.from({ length: 6 }, (_, i) => -90 + i * 60);

function hex(r: number) {
  return CORNERS.map((a, i) => `${i ? "L" : "M"}${pt(r, a)}`).join(" ") + " Z";
}

/** The part of each side between u0 and u1 (0 = corner, 1 = next corner). */
function sides(r: number, u0: number, u1: number) {
  return CORNERS.map((a) => {
    const [x0, y0] = xy(r, a);
    const [x1, y1] = xy(r, a + 60);
    const p = (u: number) =>
      `${(x0 + (x1 - x0) * u).toFixed(2)} ${(y0 + (y1 - y0) * u).toFixed(2)}`;
    return `M${p(u0)} L${p(u1)}`;
  }).join(" ");
}

/** Short ticks across each side, pointing at the centre. */
function sideTicks(r: number, per: number, len: number) {
  const out: string[] = [];
  CORNERS.forEach((a) => {
    const [x0, y0] = xy(r, a);
    const [x1, y1] = xy(r, a + 60);
    for (let k = 1; k <= per; k++) {
      const u = k / (per + 1);
      const x = x0 + (x1 - x0) * u;
      const y = y0 + (y1 - y0) * u;
      const d = Math.hypot(x, y);
      out.push(
        `M${x.toFixed(2)} ${y.toFixed(2)} L${(x - (x / d) * len).toFixed(2)} ${(y - (y / d) * len).toFixed(2)}`,
      );
    }
  });
  return out.join(" ");
}

const GUIDE = hex(99);
const GATE_OUTER = sides(95, 0.1, 0.9);
const GATE_INNER = sides(89.5, 0.16, 0.84);
const GATE_TICKS = sideTicks(89.5, 5, 3.5);
const INNER_SEGMENTS = sides(80, 0.3, 0.7);
const INNER_GUIDE = hex(80);

/** A chevron at each corner, pointing into the gate. */
const CHEVRONS = CORNERS.map((a) =>
  [`M${pt(99, a - 4.2)}`, `L${pt(90, a)}`, `L${pt(99, a + 4.2)}`].join(" "),
);

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
 *  a smaller layer is cheaper to transform. */
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
      {/* dashed outer guide: drifts slowly against the portal's spin */}
      <svg data-ring="outer" {...box(100)}>
        <Glow d={GUIDE} w={0.35} />
      </svg>

      {/* the gate: heavy double bars, ticks, and the chevrons that lock */}
      <svg data-ring="gate" {...box(100)}>
        <Glow d={GATE_OUTER} w={1.4} strokeLinecap="square" />
        <Glow d={GATE_INNER} w={0.5} />
        <Glow d={GATE_TICKS} w={0.4} />
        {CHEVRONS.map((d, i) => (
          <path
            key={i}
            d={d}
            data-chevron=""
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinejoin="miter"
          />
        ))}
      </svg>

      {/* inner ring: turns with the aperture */}
      <svg data-ring="inner" {...box(82)}>
        <Glow d={INNER_GUIDE} w={0.3} />
        <Glow d={INNER_SEGMENTS} w={0.9} strokeLinecap="square" />
        {CORNERS.map((a) => {
          const [x, y] = xy(80, a);
          return (
            <circle
              key={a}
              cx={x.toFixed(2)}
              cy={y.toFixed(2)}
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
