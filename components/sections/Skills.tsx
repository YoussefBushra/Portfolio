import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Group name over its tools. The tags are tinted rather than outlined, so a
 * long list reads as one soft block instead of fifty bordered boxes.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack">
      <div className="glass-strong rounded-xl p-6 sm:p-8">
        <div className="gap-x-14 sm:columns-2">
          {skillGroups.map((group) => (
            <div key={group.name} className="mb-6 break-inside-avoid">
              <h3 className="font-display text-[13px] font-bold tracking-tight text-text">
                {group.name}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-4 border-t border-white/15 pt-4 text-[13px] text-muted">
          Spoken languages: {spokenLanguages}.
        </p>
      </div>
    </SectionShell>
  );
}
