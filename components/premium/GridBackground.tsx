"use client";

/**
 * Page-wide ambient background: a very fine technical grid, a soft radial
 * glow at the top, and a subtle vignette. Fixed, non-interactive, low opacity —
 * it sits behind everything and never competes with content.
 */
export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* fine grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* one faint glow at the top, very restrained */}
      <div
        className="absolute -top-56 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--accent) / 0.05), transparent 70%)",
        }}
      />
      {/* top + bottom fade to background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--bg)) 0%, transparent 12%, transparent 88%, rgb(var(--bg)) 100%)",
        }}
      />
    </div>
  );
}
