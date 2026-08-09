"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FOCI = [
  "designing event-driven services",
  "optimizing query performance",
  "integrating enterprise systems",
  "shipping responsive interfaces",
  "tuning caches & observability",
];

const BARS = 28;

export function StatusTicker() {
  const [focusIndex, setFocusIndex] = useState(0);
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BARS }, () => 0.35)
  );
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current) {
      // one settled frame, no motion
      setBars(Array.from({ length: BARS }, (_, i) => 0.3 + ((i * 37) % 60) / 100));
      return;
    }

    const focusTimer = setInterval(() => {
      setFocusIndex((i) => (i + 1) % FOCI.length);
    }, 3200);

    const barTimer = setInterval(() => {
      setBars((prev) => {
        const next = prev.slice(1);
        next.push(0.2 + Math.random() * 0.8);
        return next;
      });
    }, 140);

    return () => {
      clearInterval(focusTimer);
      clearInterval(barTimer);
    };
  }, []);

  const peak = useMemo(() => Math.max(...bars), [bars]);

  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 font-mono text-xs backdrop-blur-sm">
      <span className="flex items-center gap-2 text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-2 animate-blink" />
        <span className="text-faint">focus:</span>
        <span className="relative inline-block min-w-[13.5rem]">
          <AnimatePresence mode="wait">
            <motion.span
              key={focusIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-accent"
            >
              {FOCI[focusIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>

      <span className="hidden items-end gap-[2px] sm:flex" aria-hidden="true">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-sm bg-accent/60 transition-[height] duration-150 ease-out"
            style={{
              height: `${6 + h * 18}px`,
              opacity: 0.35 + (h / (peak || 1)) * 0.65,
            }}
          />
        ))}
      </span>
    </div>
  );
}
