"use client";

import { track } from "@/lib/analytics";

/** Secondary call to action. One label for this intent, used everywhere. */
export function ContactLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="#contact"
      onClick={() => track("cta_click", { cta: "contact", from: "hero" })}
      className={`btn-ghost ${className}`}
    >
      Get in touch
    </a>
  );
}
