"use client";

import { skillGroups } from "@/content/skills";
import { Section, SectionHeader } from "@/components/premium/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Skills() {
  return (
    <Section id="skills" className="py-24 md:py-32">
      <SectionHeader
        index="04"
        label="capabilities"
        title="The toolkit, organized by domain"
        description="Depth in backend and distributed systems, with the full-stack range to carry a feature from database to interface."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <RevealOnScroll
            key={group.name}
            amount={0.2}
            className="surface surface-hover flex flex-col p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text">
                {group.name}
              </h3>
              <span className="font-mono text-[11px] text-faint">
                {group.service}
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-surface-2/40 px-2.5 py-1 text-[13px] text-muted transition-colors hover:border-accent/40 hover:text-text"
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
