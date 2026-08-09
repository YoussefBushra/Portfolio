import { experience } from "@/content/experience";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { TechTag } from "@/components/ui/TechTag";

export function Experience() {
  return (
    <SectionShell id="experience">
      <SectionHeading
        index="02"
        service="svc/experience"
        title="Deployed services"
        description="Each role is a service I've helped design, ship and keep running in production."
      />

      <div className="relative">
        {/* topology spine */}
        <div
          className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/60 via-border to-transparent sm:block"
          aria-hidden="true"
        />

        <div className="space-y-8">
          {experience.map((role, i) => (
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
                    <span className="font-mono text-xs text-faint">
                      {role.period}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mono-label mb-2">dependencies</div>
                  <div className="flex flex-wrap gap-2">
                    {role.stack.map((s) => (
                      <TechTag key={s}>{s}</TechTag>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mono-label mb-3">logs · impact</div>
                  <ul className="space-y-2.5">
                    {role.highlights.map((h, hi) => (
                      <li
                        key={hi}
                        className="flex gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2"
                          aria-hidden="true"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
