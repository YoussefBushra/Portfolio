import { experience } from "@/content/experience";
import type { Experience as Role } from "@/lib/types";
import { careerStartYear } from "@/lib/timeline";
import { SectionShell } from "@/components/layout/SectionShell";

function RoleEntry({ role }: { role: Role }) {
  return (
    <article className="border-t border-line pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-base font-semibold tracking-tight text-text">
          {role.role}
        </h3>
        <p className="num font-mono text-[11px] text-faint">{role.period}</p>
      </div>
      <p className="mt-1 text-[13px] text-accent-text">
        {role.company}
        <span className="text-faint">, {role.location}</span>
      </p>

      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
        {role.summary}
      </p>

      {role.metrics?.length ? (
        <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          {role.metrics.map((m) => (
            <div key={m.label}>
              <div className="num text-lg font-semibold leading-none tracking-tight text-text">
                {m.value}
              </div>
              <div className="mt-1 font-mono text-[11px] text-faint">{m.label}</div>
            </div>
          ))}
        </div>
      ) : null}

      <ul className="mt-6 grid gap-x-10 gap-y-2.5 lg:grid-cols-2">
        {role.highlights.map((h) => (
          <li
            key={h}
            className="border-l border-line pl-3.5 text-[13px] leading-[1.6] text-muted"
          >
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-line pt-3">
        <h4 className="block-label">Stack</h4>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {role.stack.map((s) => (
            <li key={s} className="tag">
              {s}
            </li>
          ))}
        </ul>
      </div>
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
      <div className="space-y-9">
        {experience.map((role) => (
          <RoleEntry key={role.company} role={role} />
        ))}
      </div>
    </SectionShell>
  );
}
