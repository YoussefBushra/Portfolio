import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const HIGHLIGHTS = [
  { v: "2+ yrs", k: "building production systems" },
  { v: "10M+ @ 600ms", k: "records searched (Elasticsearch)" },
  { v: "Event-driven", k: "microservices & integrations" },
];

const KEY_SKILLS = [
  "NestJS",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
  "Microservices",
  "RabbitMQ",
  "Redis",
  "Elasticsearch",
  "React",
  "Next.js",
];

export function About() {
  return (
    <SectionShell id="about">
      <SectionHeading index="01" title="About" />

      <RevealOnScroll className="space-y-5">
        {profile.summary.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </RevealOnScroll>

      {/* highlights */}
      <RevealOnScroll className="mt-8 grid grid-cols-1 gap-4 border-y border-border py-6 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <div key={h.k}>
            <div className="font-display text-lg font-bold tracking-tight text-text">
              {h.v}
            </div>
            <div className="mt-1 text-sm text-muted">{h.k}</div>
          </div>
        ))}
      </RevealOnScroll>

      {/* core stack */}
      <RevealOnScroll className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-faint">
          Core stack
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {KEY_SKILLS.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </RevealOnScroll>

      {/* education */}
      <RevealOnScroll className="mt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-faint">
          Education
        </div>
        {education.map((e) => (
          <div key={e.institution} className="mt-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-text">{e.degree}</h3>
              <span className="font-mono text-xs text-faint">{e.period}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{e.institution}</p>
            <p className="mt-1 font-mono text-xs text-accent">{e.detail}</p>
          </div>
        ))}
      </RevealOnScroll>
    </SectionShell>
  );
}
