"use client";

import { stackGroups } from "@/content/skills";
import { Section, SectionHeader } from "@/components/premium/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Skills() {
  return (
    <Section id="skills" className="py-20 md:py-28">
      <SectionHeader
        index="03"
        label="stack"
        title="What the work is built on"
        description="From core services outward — depth in backend and distributed systems, with the full-stack range to carry a feature end to end."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stackGroups.map((group, i) => (
          <RevealOnScroll
            key={group.name}
            amount={0.2}
            className="surface surface-hover flex flex-col p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text">
                {group.name}
              </h3>
              <span className="font-mono text-[11px] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border/70 bg-surface-2/40 px-2.5 py-1 text-[13px] text-muted transition-colors hover:border-accent/40 hover:text-text"
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
