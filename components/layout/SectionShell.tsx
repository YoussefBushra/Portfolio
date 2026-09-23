"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

interface SectionShellProps {
  id: string;
  /** Two-digit section number, e.g. "01". Shown in amber before the label. */
  index: string;
  /** Section name, shown as the small uppercase label. */
  label: string;
  /** Real metadata beside the label, e.g. a range or a count. Never decoration. */
  meta?: string;
  /** Give the section a subtle full-bleed background band. Use sparingly. */
  tint?: boolean;
  children: ReactNode;
}

/**
 * Sections share one grid, one header treatment ("01 / SELECTED WORK") and one
 * spacing rhythm — but no separator rules. Each section gets its identity from
 * its own layout; the numbered header and whitespace mark where it starts.
 */
export function SectionShell({
  id,
  index,
  label,
  meta,
  tint = false,
  children,
}: SectionShellProps) {
  const ref = useRef<HTMLElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !seen.current) {
          seen.current = true;
          track("section_view", { section: id });
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return (
    // Anchor clearance comes from `scroll-padding-top` on <html>; a
    // scroll-margin here as well would stack into a double offset.
    <section ref={ref} id={id} className={tint ? "bg-surface" : undefined}>
      <div className="mx-auto max-w-page px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="block-label flex items-baseline gap-2">
            <span className="num text-accent-text">{index}</span>
            <span aria-hidden>/</span>
            <span>{label}</span>
          </h2>
          {meta ? <p className="text-[12px] text-faint">{meta}</p> : null}
        </div>
        <div className="mt-10 min-w-0 md:mt-12">{children}</div>
      </div>
    </section>
  );
}
