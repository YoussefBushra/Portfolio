import { SectionShell } from "@/components/layout/SectionShell";

/**
 * A quick read of scope and strengths for a recruiter — a mix of a measurable
 * result, a performance figure, and the kinds of systems and business domains
 * worked in. No repository or commit statistics; only verifiable career facts.
 */
const HIGHLIGHTS = [
  { value: "10M+", label: "Records searched", note: "geo-location search dataset" },
  { value: "~600ms", label: "Average search response", note: "against a one-second target" },
  { value: "Production", label: "Backend systems", note: "live business platforms" },
  {
    value: "Finance & logistics",
    label: "Business systems",
    note: "CRM, invoicing, integrations",
  },
];

export function Highlights() {
  return (
    <SectionShell id="highlights" label="Professional Highlights" variant="wide">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="panel p-6">
            <dt className="num text-balance text-[26px] font-semibold leading-[1.05] tracking-tight text-text sm:text-[30px]">
              {h.value}
            </dt>
            <dd className="mt-3 text-[14px] font-medium text-text">{h.label}</dd>
            <dd className="mt-1 text-[13px] leading-snug text-muted">{h.note}</dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
