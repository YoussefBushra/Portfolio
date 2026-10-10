import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import { Engineer, Recruiter } from "@/components/view/Layer";

const COLUMNS = [
  { k: "Focus", items: ["Backend", "Full-stack"] },
  {
    k: "Domains",
    items: ["Logistics", "Freight forwarding", "Financial operations"],
  },
  { k: "Languages", items: spokenLanguages.split(", ") },
];

/**
 * A full-width editorial block: the text spans the section at a readable
 * measure, and the supporting facts sit underneath in one compact row. No
 * cards, no borders, no sidebar.
 */
export function About() {
  return (
    <SectionShell id="about" index="02" label="About" tint>
      {/* Told per view: the recruiter text as it is; for developers, the
          kinds of problems the work involves. The facts below are shared. */}
      <Recruiter label="about">
        <Summary paragraphs={profile.summary} />
      </Recruiter>
      <Engineer label="about">
        <Summary paragraphs={profile.engineer.summary} />
      </Engineer>

      {/* The facts span the full width: first column at the left edge, last
          at the right, even space between (two-by-two on small screens). */}
      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-9 lg:flex lg:justify-between lg:gap-x-12">
        {COLUMNS.slice(0, 2).map((c) => (
          <Column key={c.k} label={c.k} items={c.items} />
        ))}

        {education.map((e) => (
          <div key={e.institution} className="lg:max-w-[18rem]">
            <dt className="block-label">Education</dt>
            <dd className="mt-3 text-[14px] font-medium leading-snug text-text">
              {e.degree}
            </dd>
            <dd className="mt-1 text-[14px] leading-snug text-muted">
              {e.institution}
            </dd>
            <dd className="mt-1 text-[14px] leading-snug text-muted">
              {e.detail}
            </dd>
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
        <dd
          key={item}
          className="mt-1.5 text-[14px] leading-snug text-text first-of-type:mt-3"
        >
          {item}
        </dd>
      ))}
    </div>
  );
}

/** The lead spans the content width; the supporting paragraphs are smaller
 *  and capped at a comfortable measure so they never read as stretched. */
function Summary({ paragraphs }: { paragraphs: string[] }) {
  const [lead, ...rest] = paragraphs;
  return (
    <>
      <p className="text-pretty text-[20px] font-medium leading-[1.55] tracking-tight text-text sm:text-[22px]">
        {lead}
      </p>
      {rest.map((p, i) => (
        <p
          key={i}
          className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-muted"
        >
          {p}
        </p>
      ))}
    </>
  );
}
