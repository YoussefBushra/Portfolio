"use client";

import { profile } from "@/content/profile";
import { CountUp } from "@/components/premium/CountUp";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Metrics() {
  return (
    <div className="relative px-5 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="surface relative grid grid-cols-2 gap-px overflow-hidden rounded-xl md:grid-cols-4">
          {profile.facts.map((fact) => (
            <RevealOnScroll
              key={fact.label}
              amount={0.4}
              className="relative bg-surface/40 p-5 sm:p-6"
            >
              <div className="text-3xl font-bold tracking-tight text-text sm:text-[2rem]">
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
