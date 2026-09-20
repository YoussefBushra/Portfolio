import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * The stack, read as engineering domains. Backend, data, search and
 * architecture lead as cards; frontend and tooling sit below as quiet lines,
 * because the positioning is backend-focused.
 */
export function Skills() {
  const primary = skillGroups.filter((g) => g.emphasis !== "secondary");
  const secondary = skillGroups.filter((g) => g.emphasis === "secondary");

  return (
    <SectionShell id="skills" label="Stack">
      <div className="grid gap-4 sm:grid-cols-2">
        {primary.map((group) => (
          <div key={group.name} className="panel p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-[14px] font-semibold tracking-tight text-text">
                {group.name}
              </h3>
              {group.evidence ? (
                <a href={group.evidence.href} className="link text-[12px]">
                  {group.evidence.label} →
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              {group.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>

      <dl className="mt-5 space-y-2 border-t border-line pt-5">
        {secondary.map((group) => (
          <div
            key={group.name}
            className="grid grid-cols-1 gap-x-4 sm:grid-cols-[130px_1fr]"
          >
            <dt className="text-[13px] font-medium text-text">{group.name}</dt>
            <dd className="text-[13px] text-muted">{group.items.join(" · ")}</dd>
          </div>
        ))}
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[130px_1fr]">
          <dt className="text-[13px] font-medium text-text">Languages</dt>
          <dd className="text-[13px] text-muted">{spokenLanguages}</dd>
        </div>
      </dl>
    </SectionShell>
  );
}
