import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Group name against its tools, set as running text. The label/body contrast
 * carries the structure, so nothing needs a box around it and fifty items
 * take five rows rather than fifty.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack">
      <div className="gap-x-14 sm:columns-2">
        {skillGroups.map((group) => (
          <div key={group.name} className="mb-5 break-inside-avoid">
            <h3 className="text-[13px] font-semibold tracking-tight text-text">
              {group.name}
            </h3>
            <p className="mt-0.5 text-[13px] leading-[1.7] text-muted">
              {group.items.join(", ")}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-line pt-4 text-[13px] text-muted">
        Spoken languages: {spokenLanguages}.
      </p>
    </SectionShell>
  );
}
