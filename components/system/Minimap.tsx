"use client";

import { useEffect, useState } from "react";
import { navNodes } from "@/content/profile";

const SECTIONS = [
  { id: "hero", label: "Top" },
  ...navNodes.map((n) => ({ id: n.id as string, label: n.label })),
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function Minimap() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section map"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-end gap-1.5">
        {/* connective spine */}
        <span
          className="absolute right-[5px] top-2 -z-10 h-[calc(100%-1rem)] w-px bg-border"
          aria-hidden="true"
        />
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              aria-label={s.label}
              aria-current={isActive ? "true" : undefined}
              className="focus-ring group flex items-center gap-2 rounded py-1"
            >
              <span
                className={`whitespace-nowrap font-mono text-[10px] transition-all duration-200 ${
                  isActive
                    ? "text-accent opacity-100"
                    : "text-faint opacity-0 group-hover:opacity-100"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "scale-110 border-accent bg-accent shadow-glow-sm"
                    : "border-border bg-bg group-hover:border-accent-2"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
