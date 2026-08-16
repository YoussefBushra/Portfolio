"use client";

import { useEffect } from "react";

/**
 * Feeds the pointer position into whichever glass panel the cursor is over,
 * as CSS variables the `.glass::after` highlight reads. The visual is pure
 * CSS; this only reports coordinates. No-op on touch/coarse pointers and
 * when the visitor prefers reduced motion.
 */
export function PointerGlow() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const target = e.target as HTMLElement | null;
        const card = target?.closest<HTMLElement>(".glass, .glass-strong");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
