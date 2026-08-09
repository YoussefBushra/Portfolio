import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function About() {
  return (
    <SectionShell id="about">
      <SectionHeading
        index="01"
        service="svc/about"
        title="The engineer behind the services"
        description="A quick primer on how I approach building software — and the record behind it."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
        <RevealOnScroll className="space-y-5">
          {profile.summary.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
              {p}
            </p>
          ))}
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="card p-5">
            <div className="mono-label mb-3">education</div>
            {education.map((e) => (
              <div key={e.institution}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-text">{e.degree}</h3>
                  <span className="font-mono text-xs text-faint">{e.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{e.institution}</p>
                <p className="mt-1 font-mono text-xs text-accent">{e.detail}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </SectionShell>
  );
}
