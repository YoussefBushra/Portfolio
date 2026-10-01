import { forwardRef, type SVGProps } from "react";

/* The gate that forms around the portrait for the finale of a view switch:
   one clean hexagon, with a chevron at each corner that locks as it powers
   up. Straight edges and corners — a doorway, not a sphere; the portal's
   aperture opens to the gate's size.

   The line uses pathLength=1 so it can be "drawn on" by animating
   stroke-dashoffset from 1 to 0. Its glow is drawn into the SVG — a wide
   faint halo under the crisp line — rather than a blur filter, which would
   be re-rasterised every frame while it draws on. */

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) =>
  `${(Math.cos(rad(deg)) * r).toFixed(2)} ${(Math.sin(rad(deg)) * r).toFixed(2)}`;

/** Hex corner angles, first corner pointing up. */
const CORNERS = Array.from({ length: 6 }, (_, i) => -90 + i * 60);

const GATE =
  CORNERS.map((a, i) => `${i ? "L" : "M"}${pt(93, a)}`).join(" ") + " Z";

/** A chevron outside each corner, pointing into the gate. */
const CHEVRONS = CORNERS.map((a) =>
  [`M${pt(99.5, a - 4)}`, `L${pt(96.5, a)}`, `L${pt(99.5, a + 4)}`].join(" "),
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
        strokeLinecap="round"
        {...LINE}
      />
      <path d={d} data-core="" strokeWidth={w} {...rest} {...LINE} />
    </>
  );
}

export const Seal = forwardRef<HTMLDivElement>(function Seal(_, ref) {
  return (
    <div ref={ref} className="seal" aria-hidden>
      <svg data-ring="gate" viewBox="-100 -100 200 200" aria-hidden>
        <Glow d={GATE} w={1.2} strokeLinejoin="round" />
        {CHEVRONS.map((d, i) => (
          <path
            key={i}
            d={d}
            data-chevron=""
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinejoin="miter"
          />
        ))}
      </svg>
    </div>
  );
});
