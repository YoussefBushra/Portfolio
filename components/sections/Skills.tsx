import { skillGroups } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Skills as a CV-style table: one row per category, name on the left and the
 * technologies inline on the right at reading size. Rows (not columns of short
 * lists) keep it from reading like a footer sitemap. No pills, bars or logos.
 */
export function Skills() {
  return (
    <SectionShell id="skills" index="04" label="Skills" tint>
      <dl className="grid gap-y-7">
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="grid gap-y-2 sm:grid-cols-[260px_minmax(0,1fr)] sm:gap-x-10"
          >
            <dt className="text-[17px] font-bold tracking-tight text-text">
              {group.name}
            </dt>
            <dd className="flex flex-wrap gap-x-7 gap-y-1.5 text-[16px] text-faint">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
