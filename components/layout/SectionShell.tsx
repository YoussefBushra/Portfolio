"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

interface SectionShellProps {
  id: string;
  /** Section name, set in the sticky left gutter. */
  label: string;
  /** Real metadata under the label, e.g. a range or a count. Never decoration. */
  meta?: string;
  /** "wide" drops the left gutter and runs the content full width. */
  variant?: "default" | "wide";
  children: ReactNode;
}

/**
 * Every section is a row in one document: a hairline rule, a sticky label
 * gutter, and the content. No centred headings, so vertical space goes to
 * content rather than to titles.
 */
export function SectionShell({
  id,
  label,
  meta,
  variant = "default",
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
    <section ref={ref} id={id} className="border-t border-line">
      {variant === "wide" ? (
        <div className="mx-auto max-w-page px-6 py-11 md:px-10 md:py-14">
          <div className="flex items-baseline gap-3 border-b border-line pb-4">
            <h2 className="block-label">{label}</h2>
            {meta ? <p className="text-[12px] text-faint">{meta}</p> : null}
          </div>
          <div className="mt-6 min-w-0">{children}</div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-page gap-5 px-6 py-11 md:grid-cols-[150px_minmax(0,1fr)] md:gap-12 md:px-10 md:py-14">
          <div className="md:sticky md:top-20 md:self-start">
            <h2 className="block-label">{label}</h2>
            {meta ? (
              <p className="mt-1.5 text-[12px] leading-4 text-faint">{meta}</p>
            ) : null}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      )}
    </section>
  );
}
