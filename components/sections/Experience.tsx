"use client";

import { useState } from "react";
import { experience } from "@/content/experience";
import type { Experience as ExperienceType } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { TechChip } from "@/components/ui/TechChip";

const VISIBLE = 4;

function RoleCard({ role }: { role: ExperienceType }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? role.highlights : role.highlights.slice(0, VISIBLE);
  const hidden = role.highlights.length - VISIBLE;

  return (
    <article className="card overflow-hidden p-6 transition-colors hover:border-accent/40 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-text">
            {role.role}
          </h3>
          <p className="mt-0.5 font-mono text-sm text-accent">
            {role.company}
            <span className="text-faint"> · {role.location}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {role.current ? (
            <span className="chip chip-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-blink" />
              active
            </span>
          ) : null}
          <span className="font-mono text-xs text-faint">{role.period}</span>
        </div>
      </div>

      {/* highlight metrics */}
      {role.metrics && role.metrics.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {role.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-lg font-bold tracking-tight text-accent">
                {m.value}
              </div>
              <div className="mono-label">{m.label}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        <div className="mono-label mb-2">dependencies</div>
        <div className="flex flex-wrap gap-2">
          {role.stack.map((s) => (
            <TechChip key={s} label={s} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="mono-label mb-3">logs · impact</div>
        <ul className="space-y-2.5">
          {shown.map((h, hi) => (
            <li
              key={hi}
              className="flex gap-3 text-[15px] leading-relaxed text-muted"
            >
              <span
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2"
                aria-hidden="true"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        {hidden > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            <span className="h-1 w-1 rounded-full bg-accent-2" />
            {expanded ? "show less" : `show ${hidden} more`}
            <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
              ↓
            </span>
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function Experience() {
  return (
    <SectionShell id="experience">
      <SectionHeading
        index="02"
        service="svc/experience"
        title="Deployed services"
        description="Each role is a service I've helped design, ship and keep running in production. Hover a tech to trace it across projects below."
      />

      <div className="relative">
        {/* topology spine */}
        <div
          className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/60 via-border to-transparent sm:block"
          aria-hidden="true"
        />

        <div className="space-y-8">
          {experience.map((role) => (
            <RevealOnScroll key={role.company} className="relative sm:pl-10">
              {/* node */}
              <span
                className="absolute left-0 top-2 hidden h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-accent bg-bg sm:flex"
                aria-hidden="true"
              >
                {role.current ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-blink" />
                ) : null}
              </span>

              <RoleCard role={role} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
