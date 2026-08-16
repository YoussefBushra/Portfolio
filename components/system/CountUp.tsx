"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const RE = /^(\D*)(\d[\d,]*)(.*)$/;

/**
 * Counts a figure up to its value the first time it scrolls into view. Splits
 * the label into a numeric core and any prefix/suffix ("~40", "10M+", "600ms")
 * so only the number animates. Renders the final value immediately under
 * reduced motion, and is tabular so the width never jitters mid-count.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const initial = (() => {
    const m = value.match(RE);
    return reduce || !m ? value : `${m[1]}0${m[3]}`;
  })();
  const [display, setDisplay] = useState(initial);

  // Depend only on stable inputs (value is a string) so re-renders from the
  // count itself don't restart the animation.
  useEffect(() => {
    if (!inView || reduce) return;
    const m = value.match(RE);
    if (!m) return;
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${m[1]}${Math.round(v)}${m[3]}`),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
