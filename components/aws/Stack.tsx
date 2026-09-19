import { stackGroups } from "@/content/skills";
import { Tag } from "@/components/aws/Container";

export function Stack() {
  return (
    <section id="stack" className="scroll-mt-16">
      <div className="rule-head">Stack</div>

      <dl className="grid grid-cols-1 gap-x-12 gap-y-6 pt-6 sm:grid-cols-2">
        {stackGroups.map((group) => (
          <div key={group.name} className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr]">
            <dt className="text-[13px] font-semibold text-text">{group.name}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
