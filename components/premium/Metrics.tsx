"use client";

import { profile } from "@/content/profile";
import { CountUp } from "@/components/premium/CountUp";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Metrics() {
  return (
    <div className="relative px-5 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="surface grid-bg relative grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
          {profile.facts.map((fact, i) => (
            <RevealOnScroll
              key={fact.label}
              amount={0.4}
              className="relative bg-surface/40 p-6 sm:p-8"
            >
              <div
                className="mb-3 font-mono text-[11px] text-accent"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
                <CountUp value={fact.value} />
              </div>
              <div className="mt-2 text-sm font-medium text-text">
                {fact.label}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-faint">
                {fact.hint}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
