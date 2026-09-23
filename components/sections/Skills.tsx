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
            <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-text">
              {group.name}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="text-[15px] leading-snug text-muted">
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
