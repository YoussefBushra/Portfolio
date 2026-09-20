import { experience } from "@/content/experience";
import type { Experience as Role } from "@/lib/types";
import { careerStartYear } from "@/lib/timeline";
import { SectionShell } from "@/components/layout/SectionShell";

function RoleEntry({ role }: { role: Role }) {
  return (
    <article className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-base font-semibold tracking-tight text-text">
          {role.role}
        </h3>
        <p className="num text-[12px] text-faint">{role.period}</p>
      </div>
      <p className="mt-1 text-[13px] font-medium text-text">
        {role.company}
        <span className="font-normal text-faint">, {role.location}</span>
      </p>

      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
        {role.summary}
      </p>

      <ul className="mt-5 grid gap-x-12 gap-y-2.5 lg:grid-cols-2">
        {role.highlights.map((h) => (
          <li
            key={h}
            className="border-l border-line pl-3.5 text-[13px] leading-[1.6] text-muted"
          >
            {h}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[12px] text-faint">
        {role.stack.slice(0, 7).join(" · ")}
      </p>
    </article>
  );
}

export function Experience() {
  return (
    <SectionShell
      id="experience"
      label="Experience"
      meta={`${careerStartYear()} to present`}
    >
      <div className="space-y-4">
        {experience.map((role) => (
          <RoleEntry key={role.company} role={role} />
        ))}
      </div>
    </SectionShell>
  );
}
