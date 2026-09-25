"use client";

import { useEffect, useRef, useState } from "react";
import { useView } from "@/components/view/ViewProvider";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_{}=+*";
const DURATION = 420;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Text that "decodes" when the page shifts into engineer view: glyphs scramble
 * and resolve left to right. Shifting back to recruiter view only dips the
 * opacity. The real text stays in the DOM throughout, for screen readers and
 * for layout; the scramble is an aria-hidden overlay.
 */
export function Decode({ text }: { text: string }) {
  const { lastShift } = useView();
  const ref = useRef<HTMLSpanElement>(null);
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!lastShift || !el || reducedMotion() || !inViewport(el)) return;

    if (lastShift.to === "recruiter") {
      el.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], {
        duration: 300,
        easing: "ease-out",
      });
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const settled = Math.floor(p * text.length);
      setScrambled(
        p >= 1
          ? null
          : text
              .split("")
              .map((ch, i) =>
                i < settled || ch === " "
                  ? ch
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              )
              .join("")
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setScrambled(null);
    };
  }, [lastShift, text]);

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className={scrambled ? "opacity-0" : undefined}>{text}</span>
      {scrambled ? (
        <span aria-hidden className="absolute inset-y-0 left-0 font-mono">
          {scrambled}
        </span>
      ) : null}
    </span>
  );
}
