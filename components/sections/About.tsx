import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { SectionShell } from "@/components/layout/SectionShell";

export function About() {
  return (
    <SectionShell id="about" label="About">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
        <div>
          <div className="max-w-2xl space-y-6">
            {profile.summary.map((p, i) => (
              <p key={i} className="text-[16px] leading-[1.75] text-muted">
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2.5 border-t border-line pt-6 sm:grid-cols-[110px_1fr]">
            {[
              { k: "Focus", v: "Backend · Full-stack" },
              {
                k: "Domains",
                v: "Logistics · Freight forwarding · Financial operations",
              },
            ].map((row) => (
              <div key={row.k} className="contents">
                <dt className="block-label pt-0.5">{row.k}</dt>
                <dd className="text-[14px] text-text">{row.v}</dd>
              </div>
            ))}
          </dl>
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
                <p className="mt-1 text-sm font-medium text-text">{e.detail}</p>
                <p className="mt-1 text-[12px] text-faint">{e.period}</p>
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
