"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FOCI = [
  "designing event-driven services",
  "optimizing query performance",
  "integrating enterprise systems",
  "shipping responsive interfaces",
  "tuning caches & observability",
];

const BARS = 24;

export function StatusTicker() {
  const [focusIndex, setFocusIndex] = useState(0);
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BARS }, (_, i) => 0.3 + ((i * 37) % 60) / 100)
  );
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return; // keep the static frame, no timers

    const focusTimer = setInterval(() => {
      setFocusIndex((i) => (i + 1) % FOCI.length);
    }, 3600);

    const barTimer = setInterval(() => {
      setBars((prev) => {
        const next = prev.slice(1);
        next.push(0.2 + Math.random() * 0.8);
        return next;
      });
    }, 180);

    return () => {
      clearInterval(focusTimer);
      clearInterval(barTimer);
    };
  }, []);

  return (
    <div className="flex w-full max-w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 font-mono text-xs backdrop-blur-sm sm:w-auto">
      <span className="flex min-w-0 flex-1 items-center gap-2 text-muted sm:flex-none">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2 animate-blink" />
        <span className="shrink-0 text-faint">focus:</span>
        {/* fixed-height, clipped phrase box so text swaps never shift layout */}
        <span className="relative block h-4 min-w-0 flex-1 sm:w-[13.5rem] sm:flex-none">
          <AnimatePresence mode="wait">
            <motion.span
              key={focusIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 truncate text-accent"
            >
              {FOCI[focusIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>

      {/* fixed-height bar track; bars animate via transform (no reflow) */}
      <span
        className="hidden h-5 shrink-0 items-end gap-[2px] sm:flex"
        aria-hidden="true"
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="h-5 w-[3px] origin-bottom rounded-sm bg-accent/60 transition-transform duration-200 ease-out"
            style={{
              transform: `scaleY(${0.22 + h * 0.78})`,
              opacity: 0.4 + h * 0.6,
            }}
          />
        ))}
      </span>
    </div>
  );
}
