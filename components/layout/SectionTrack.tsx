"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navNodes } from "@/content/profile";

/**
 * Small screens only: a slim bar under the nav that says which section you
 * are in ("02 / About") and how far through the page you are — one segment
 * per section, earlier ones filled, the current one filling as you read it.
 * Shown once you are past the hero; tapping it opens the section menu.
 */
export function SectionTrack({
  active,
  hidden,
  onOpen,
}: {
  active: string;
  hidden: boolean;
  onOpen: () => void;
}) {
  const index = navNodes.findIndex((n) => n.id === active);
  const node = navNodes[index];
  const track = useRef<HTMLDivElement>(null);

  // Fill each segment with how far through its section the reader is.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const line = window.innerHeight * 0.5;
      navNodes.forEach((n, i) => {
        const sec = document.getElementById(n.id);
        const seg = el.children[i] as HTMLElement | undefined;
        if (!sec || !seg) return;
        const r = sec.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
        seg.style.setProperty("--fill", p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const shown = !!node && !hidden;

  return (
    <div
      className={`section-track lg:hidden ${shown ? "is-shown" : ""}`}
      aria-hidden={!shown}
    >
      <button
        type="button"
        onClick={onOpen}
        tabIndex={shown ? 0 : -1}
        aria-label={
          node
            ? `Current section: ${node.label}. Open sections menu`
            : undefined
        }
        className="focus-ring mx-auto flex h-9 w-full max-w-page items-center gap-3 px-6 md:px-10"
      >
        <span className="relative h-4 min-w-0 flex-1 overflow-hidden text-left">
          <AnimatePresence initial={false} mode="popLayout">
            {node ? (
              <motion.span
                key={node.id}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-baseline gap-2 text-[11.5px] font-semibold uppercase leading-4 tracking-[0.12em] text-text"
              >
                <span className="num text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-faint" aria-hidden>
                  /
                </span>
                <span className="truncate">{node.label}</span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
        <span
          ref={track}
          className="flex shrink-0 items-center gap-1"
          aria-hidden
        >
          {navNodes.map((n) => (
            <span key={n.id} className="section-seg" />
          ))}
        </span>
      </button>
    </div>
  );
}
