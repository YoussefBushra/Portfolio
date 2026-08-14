"use client";

import { track } from "@/lib/analytics";

/** Primary call to action. One label for this intent, used everywhere. */
export function WorkLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="#projects"
      onClick={() => track("cta_click", { cta: "work", from: "hero" })}
      className={`btn-primary group ${className}`}
    >
      See selected work
      <span
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
    </a>
  );
}
