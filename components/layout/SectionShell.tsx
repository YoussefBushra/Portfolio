"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

interface SectionShellProps {
  id: string;
  /** Section name, shown as the block label above the content. */
  label: string;
  /** Real metadata beside the label, e.g. a range or a count. Never decoration. */
  meta?: string;
  children: ReactNode;
}

/**
 * Every section is a row in one document, built on a single shared grid: the
 * same max-width container, the same horizontal padding, a block label over a
 * hairline rule, then the content — all aligned to one left edge so the page
 * reads as one design system rather than several independently sized sections.
 */
export function SectionShell({ id, label, meta, children }: SectionShellProps) {
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
    <section ref={ref} id={id}>
      <div className="mx-auto max-w-page px-6 py-16 md:px-10 md:py-24">
        {/* Sections are separated by whitespace, not full-width rules. A short
            amber tick (echoing the logo) marks each section start. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="block-label flex items-center gap-2.5">
            <span className="h-[3px] w-5 rounded-full bg-accent" aria-hidden />
            {label}
          </h2>
          {meta ? <p className="text-[12px] text-faint">{meta}</p> : null}
        </div>
        <div className="mt-7 min-w-0">{children}</div>
      </div>
    </section>
  );
}
