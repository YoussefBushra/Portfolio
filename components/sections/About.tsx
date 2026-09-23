import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

const FACTS = [
  { k: "Focus", v: "Backend · Full-stack" },
  { k: "Domains", v: "Logistics · Freight forwarding · Financial operations" },
  { k: "Languages", v: spokenLanguages },
];

/**
 * Editorial, not a card: a large lead paragraph carries the section, with a
 * compact metadata column beside it. No borders or boxes.
 */
export function About() {
  const [lead, ...rest] = profile.summary;

  return (
    <SectionShell id="about" index="02" label="About" tint>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <div className="max-w-3xl">
          <p className="text-pretty text-[21px] font-medium leading-[1.5] tracking-tight text-text sm:text-[24px]">
            {lead}
          </p>
          {rest.map((p, i) => (
            <p key={i} className="mt-6 max-w-2xl text-[16px] leading-[1.75] text-muted">
              {p}
            </p>
          ))}
        </div>

        <dl className="space-y-7">
          {education.map((e) => (
            <div key={e.institution}>
              <dt className="block-label">Education</dt>
              <dd className="mt-2 text-[14px] font-medium leading-snug text-text">
                {e.degree}
              </dd>
              <dd className="mt-1 text-[14px] leading-snug text-muted">{e.institution}</dd>
              <dd className="mt-1 text-[14px] leading-snug text-muted">{e.detail}</dd>
              <dd className="num mt-1 text-[12px] text-faint">{e.period}</dd>
            </div>
          ))}
          {FACTS.map((f) => (
            <div key={f.k}>
              <dt className="block-label">{f.k}</dt>
              <dd className="mt-2 text-[14px] leading-snug text-text">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}
