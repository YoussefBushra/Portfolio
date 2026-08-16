import { skillGroups } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import { Tag } from "@/components/ui/Tag";

/** A spec table, not a card grid: group name left, its tools right. */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack">
      <dl>
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="grid gap-x-8 gap-y-2 border-t border-line py-4 sm:grid-cols-[minmax(0,168px)_minmax(0,1fr)] sm:items-baseline"
          >
            <dt className="text-[13px] font-medium text-text">{group.name}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Tag key={item} label={item} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
