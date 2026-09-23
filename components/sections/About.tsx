import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

const COLUMNS = [
  { k: "Focus", items: ["Backend", "Full-stack"] },
  { k: "Domains", items: ["Logistics", "Freight forwarding", "Financial operations"] },
  { k: "Languages", items: spokenLanguages.split(", ") },
];

/**
 * A full-width editorial block: the text spans the section at a readable
 * measure, and the supporting facts sit underneath in one compact row. No
 * cards, no borders, no sidebar.
 */
export function About() {
  const [lead, ...rest] = profile.summary;

  return (
    <SectionShell id="about" index="02" label="About" tint>
      {/* The lead spans the content width; the supporting paragraph is smaller
          and capped at a comfortable measure so it never reads as stretched. */}
      <p className="text-pretty text-[20px] font-medium leading-[1.55] tracking-tight text-text sm:text-[22px]">
        {lead}
      </p>
      {rest.map((p, i) => (
        <p key={i} className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-muted">
          {p}
        </p>
      ))}

      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-4">
        {COLUMNS.slice(0, 2).map((c) => (
          <Column key={c.k} label={c.k} items={c.items} />
        ))}

        {education.map((e) => (
          <div key={e.institution}>
            <dt className="block-label">Education</dt>
            <dd className="mt-3 text-[14px] font-medium leading-snug text-text">
              {e.degree}
            </dd>
            <dd className="mt-1 text-[14px] leading-snug text-muted">{e.institution}</dd>
            <dd className="mt-1 text-[14px] leading-snug text-muted">{e.detail}</dd>
            <dd className="num mt-1 text-[13px] text-faint">{e.period}</dd>
          </div>
        ))}

        {COLUMNS.slice(2).map((c) => (
          <Column key={c.k} label={c.k} items={c.items} />
        ))}
      </dl>
    </SectionShell>
  );
}

function Column({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <dt className="block-label">{label}</dt>
      {items.map((item) => (
        <dd key={item} className="mt-1.5 text-[14px] leading-snug text-text first-of-type:mt-3">
          {item}
        </dd>
      ))}
    </div>
  );
}
