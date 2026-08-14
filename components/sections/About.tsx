import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { SectionShell } from "@/components/layout/SectionShell";

export function About() {
  return (
    <SectionShell id="about" label="About" meta={profile.location}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
        <div className="space-y-4">
          {profile.summary.map((p, i) => (
            <p key={i} className="max-w-prose text-[15px] leading-[1.7] text-muted">
              {p}
            </p>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="block-label">Education</h3>
            {education.map((e) => (
              <div key={e.institution} className="mt-2">
                <p className="text-sm font-medium leading-snug text-text">
                  {e.degree}
                </p>
                <p className="mt-1 text-sm leading-snug text-muted">
                  {e.institution}
                </p>
                <p className="mt-1 text-sm text-accent-text">{e.detail}</p>
                <p className="mt-1 font-mono text-[11px] text-faint">{e.period}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="block-label">Languages</h3>
            <p className="mt-2 text-sm leading-snug text-muted">
              Arabic (native), English (C1), German (A1)
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
