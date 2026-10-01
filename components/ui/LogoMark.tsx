/**
 * The logo mark: the favicon's geometry and colours — a near-black square
 * with two stacked bars — with a hairline edge so the square holds its shape
 * on the dark page. The bars follow the accent: amber in Recruiter view, cyan
 * in Developer view, both high-contrast on the dark square.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="4"
        fill="#0e1116"
        className="stroke-line"
        strokeWidth="1"
      />
      <rect x="5" y="9" width="22" height="4" rx="1" className="fill-accent" />
      <rect
        x="9"
        y="19"
        width="14"
        height="4"
        rx="1"
        className="fill-accent"
        opacity="0.55"
      />
    </svg>
  );
}
