"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\=+*!?$#%&";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  /** ms to fully resolve */
  duration?: number;
  /** start on mount or when scrolled into view */
  trigger?: "mount" | "inView";
  delay?: number;
}

/**
 * Decrypts text: characters shuffle through random glyphs, resolving
 * left-to-right — an on-brand "systems" flourish. Respects reduced motion
 * (renders the final string immediately).
 */
export function ScrambleText({
  text,
  className,
  as,
  duration = 900,
  trigger = "inView",
  delay = 0,
}: ScrambleTextProps) {
  const Tag = (as ?? "span") as ElementType;
  const [display, setDisplay] = useState(trigger === "mount" ? "" : text);
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(text);
      return;
    }

    let raf = 0;
    let startTime = 0;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const animate = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const revealed = Math.floor(progress * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " ") out += " ";
          else if (i < revealed) out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        if (progress < 1) raf = requestAnimationFrame(animate);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(animate);
    };

    const startWithDelay = () => {
      if (delay) setTimeout(run, delay);
      else run();
    };

    if (trigger === "mount") {
      startWithDelay();
    } else {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            startWithDelay();
            io.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return () => io.disconnect();
    }

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
