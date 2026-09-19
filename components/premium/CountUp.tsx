"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Full display value, e.g. "10M+", "600ms", "4.00", "2+". */
  value: string;
  durationMs?: number;
  className?: string;
}

/**
 * Counts a numeric value up from zero when it scrolls into view, preserving any
 * prefix/suffix in the source string (e.g. "10M+", "600ms"). Respects
 * prefers-reduced-motion by rendering the final value immediately.
 */
export function CountUp({ value, durationMs = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() => zeroed(value));
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      done.current = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();
        animate();
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    function animate() {
      const parsed = parseValue(value);
      if (!parsed) {
        setDisplay(value);
        return;
      }
      const { num, prefix, suffix, decimals } = parsed;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const current = num * eased;
        setDisplay(prefix + current.toFixed(decimals) + suffix);
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    }

    return () => io.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function parseValue(value: string) {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return { prefix, num: parseFloat(digits), suffix, decimals };
}

function zeroed(value: string) {
  const parsed = parseValue(value);
  if (!parsed) return value;
  return parsed.prefix + (0).toFixed(parsed.decimals) + parsed.suffix;
}
