"use client";

import { track } from "@/lib/analytics";

/**
 * Tertiary call to action: a quiet text link rather than a fourth button, so
 * the hero keeps one clear primary action (Download CV).
 */
export function ContactLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="#contact"
      onClick={() => track("cta_click", { cta: "contact", from: "hero" })}
      className={`focus-ring group inline-flex items-center gap-1.5 rounded-sm py-2 text-sm font-medium text-muted transition-colors hover:text-text ${className}`}
    >
      Get in touch
      <span
        className="transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden
      >
        →
      </span>
    </a>
  );
}
