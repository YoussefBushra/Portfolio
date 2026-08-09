"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

interface SectionShellProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionShell({ id, children, className }: SectionShellProps) {
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
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 ${
        className ?? ""
      }`}
    >
      {children}
    </section>
  );
}
