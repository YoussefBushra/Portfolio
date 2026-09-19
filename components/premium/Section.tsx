"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/** Full-width section with consistent gutters + one-time in-view tracking. */
export function Section({ id, children, className }: SectionProps) {
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
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative scroll-mt-24 px-5 sm:px-8 ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

interface EyebrowProps {
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
}

/** Section header: mono index + label, large title, supporting line. */
export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
}: EyebrowProps) {
  return (
    <div className={`max-w-2xl ${className ?? ""}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs text-accent">{index}</span>
        <span className="h-px w-8 bg-border" />
        <span className="mono-label">{label}</span>
      </div>
      <h2 className="text-balance text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
