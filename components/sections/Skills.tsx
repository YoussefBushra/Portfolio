import { skillGroups } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * The quietest section: a typographic matrix. Category headings with items
 * stacked beneath — the type does the organising, no boxes, bars or logos.
 */
export function Skills() {
  return (
    <SectionShell id="skills" index="04" label="Skills" tint>
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-[14px] font-semibold tracking-tight text-text">
              {group.name}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="text-[14px] leading-snug text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
