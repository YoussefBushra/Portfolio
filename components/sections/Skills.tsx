import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Capability index. Each group is a quiet card — the same panel used for the
 * experience entries — so the section reads as part of one system rather than
 * a one-off table.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack">
      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.name} className="panel p-5">
            <h3 className="text-[13px] font-semibold tracking-tight text-text">
              {group.name}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {group.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[13px] text-muted">
        Spoken languages: {spokenLanguages}.
      </p>
    </SectionShell>
  );
}
