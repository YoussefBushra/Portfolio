import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHead } from "@/components/ui/SectionHead";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function About() {
  return (
    <SectionShell id="about">
      <SectionHead title="Clean service boundaries, measurable performance." />

      <RevealOnScroll className="max-w-prose space-y-6">
        {profile.summary.map((p, i) => (
          <p key={i} className="text-lg leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </RevealOnScroll>

      <RevealOnScroll className="mt-16">
        <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-3">
          {profile.facts.map((f) => (
            <div
              key={f.label}
              className="border-b border-line py-6 sm:border-b-0 sm:border-r sm:pr-6 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-6"
            >
              <dt className="font-display text-4xl font-bold tracking-tight text-text">
                {f.value}
              </dt>
              <dd className="mt-2 text-sm text-text">{f.label}</dd>
              <dd className="mt-1 font-mono text-xs text-faint">{f.hint}</dd>
            </div>
          ))}
        </dl>
      </RevealOnScroll>

      <RevealOnScroll className="mt-12">
        {education.map((e) => (
          <div
            key={e.institution}
            className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div>
              <h3 className="text-base font-semibold text-text">{e.degree}</h3>
              <p className="mt-1 text-sm text-muted">{e.institution}</p>
              <p className="mt-1 text-sm text-accent-text">{e.detail}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-faint">{e.period}</span>
          </div>
        ))}
      </RevealOnScroll>
    </SectionShell>
  );
}
