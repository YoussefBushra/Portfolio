import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Technologies as supporting evidence — categorized and kept simple. Not the
 * main selling point: no bars, no logo walls, no percentages.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Skills">
      <dl className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[180px_1fr]"
          >
            <dt className="text-[14px] font-semibold tracking-tight text-text">
              {group.name}
            </dt>
            <dd className="text-[13.5px] leading-relaxed text-muted">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-[13.5px] text-muted">
        <span className="font-medium text-text">Languages</span>
        <span className="text-faint"> · </span>
        {spokenLanguages}
      </p>
    </SectionShell>
  );
}
