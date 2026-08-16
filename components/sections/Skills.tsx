import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * An index, not a tag cloud. Grouping carries the structure, so the items
 * themselves need no boxes around them.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack">
      {/* Columns rather than a grid, so a short group does not leave a gap
          under it waiting for the tallest group in its row. */}
      <div className="gap-x-10 sm:columns-2 lg:columns-3">
        {skillGroups.map((group) => (
          <div key={group.name} className="mb-7 break-inside-avoid">
            <h3 className="border-b border-line pb-2 text-[13px] font-medium text-text">
              {group.name}
            </h3>
            <ul className="mt-2.5 space-y-1">
              {group.items.map((item) => (
                <li key={item} className="text-[13px] leading-5 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 border-t border-line pt-4 text-[13px] text-muted">
        Spoken languages: {spokenLanguages}.
      </p>
    </SectionShell>
  );
}
