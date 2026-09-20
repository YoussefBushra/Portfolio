import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Group name over its tools. The tags are tinted rather than outlined, so a
 * long list reads as one soft block instead of fifty bordered boxes.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack" variant="wide">
      <dl className="divide-y divide-line">
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="grid grid-cols-1 gap-x-10 gap-y-2 py-3.5 first:pt-0 sm:grid-cols-[220px_minmax(0,1fr)]"
          >
            <dt className="text-[13px] font-semibold tracking-tight text-text">
              {group.name}
            </dt>
            <dd className="text-[13px] leading-relaxed text-muted">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
        <div className="grid grid-cols-1 gap-x-10 gap-y-2 py-3.5 sm:grid-cols-[220px_minmax(0,1fr)]">
          <dt className="text-[13px] font-semibold tracking-tight text-text">
            Languages
          </dt>
          <dd className="text-[13px] leading-relaxed text-muted">
            {spokenLanguages}
          </dd>
        </div>
      </dl>
    </SectionShell>
  );
}
