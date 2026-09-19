"use client";

import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { Section, SectionHeader } from "@/components/premium/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const PRINCIPLES = [
  {
    title: "Clean service boundaries",
    body: "Microservices that stay decoupled through events and clear contracts — easy to reason about, safe to change.",
  },
  {
    title: "Measurable performance",
    body: "Caching, indexing and query tuning driven by numbers: p95 latency, throughput, and load behaviour, not guesswork.",
  },
  {
    title: "Observability first",
    body: "Logging and dashboards wired in from the start, so issues surface fast and diagnosis isn't archaeology.",
  },
  {
    title: "Interfaces that feel effortless",
    body: "The Next.js layer on top should be quiet and quick — the system's complexity never leaks to the user.",
  },
];

export function About() {
  return (
    <Section id="about" className="py-24 md:py-32">
      <SectionHeader
        index="01"
        label="about"
        title="Engineering for scale, built to stay reliable"
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <RevealOnScroll className="space-y-5">
          {profile.summary.map((para, i) => (
            <p
              key={i}
              className="text-pretty text-base leading-relaxed text-muted"
            >
              {para}
            </p>
          ))}

          <div className="!mt-8 surface p-5">
            <div className="mono-label mb-3">education</div>
            {education.map((e) => (
              <div key={e.institution}>
                <div className="text-sm font-semibold text-text">
                  {e.degree}
                </div>
                <div className="mt-1 text-sm text-muted">{e.institution}</div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
                  <span className="text-accent">{e.detail}</span>
                  <span>·</span>
                  <span>{e.period}</span>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* principles bento */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <RevealOnScroll
              key={p.title}
              amount={0.3}
              className="surface surface-hover flex flex-col p-5"
            >
              <span className="mb-3 font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[15px] font-semibold text-text">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {p.body}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </Section>
  );
}
