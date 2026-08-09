import { profile } from "@/content/profile";
import { education, credentials } from "@/content/education";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const kindStyles: Record<string, string> = {
  award: "border-accent/40 bg-accent/10 text-accent",
  certification: "border-accent-2/40 bg-accent-2/10 text-accent-2",
  internship: "border-border bg-surface-2/60 text-muted",
  volunteer: "border-border bg-surface-2/60 text-muted",
};

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

          <div className="card mt-8 p-5">
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

        <RevealOnScroll className="space-y-3">
          <div className="mono-label mb-1">awards · roles</div>
          {credentials.map((c) => (
            <div
              key={c.title}
              className="card group p-4 transition-colors hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`chip shrink-0 ${kindStyles[c.kind] ?? ""}`}
                >
                  {c.kind}
                </span>
                <span className="font-mono text-[11px] text-faint">{c.period}</span>
              </div>
              <h3 className="mt-3 text-sm font-medium leading-snug text-text">
                {c.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{c.issuer}</p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </SectionShell>
  );
}
