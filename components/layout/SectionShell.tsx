"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics";

interface SectionShellProps {
  id: string;
  /** Section name, set in the sticky left gutter. */
  label: string;
  /** Real metadata under the label, e.g. a range or a count. Never decoration. */
  meta?: string;
  children: ReactNode;
}

/**
 * Every section is a row in one document: a hairline rule, a sticky label
 * gutter, and the content. No centred headings, so vertical space goes to
 * content rather than to titles.
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
    // Anchor clearance comes from `scroll-padding-top` on <html>. The shell is
    // transparent: each section supplies its own glass so panels never nest.
    <section ref={ref} id={id}>
      <div className="mx-auto grid max-w-page gap-4 px-5 py-8 sm:gap-5 sm:px-6 md:grid-cols-[160px_minmax(0,1fr)] md:gap-12 md:px-10 md:py-12">
        <div className="md:sticky md:top-24 md:self-start">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgb(var(--accent)/0.7)]"
            />
            <h2 className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-text">
              {label}
            </h2>
          </div>
          {meta ? (
            <p className="mt-2 pl-5 font-mono text-[11px] leading-4 text-muted">{meta}</p>
          ) : null}
        </div>
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
