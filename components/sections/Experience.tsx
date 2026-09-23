import type { ReactNode } from "react";
import { experience } from "@/content/experience";
import type { Experience as Role } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Measurable results shouldn't disappear into prose. These phrases get a quiet
 * weight bump — no colour, no separate counter — so a skim still catches them.
 */
const EMPHASIS = ["10M+", "600 ms", "one-second target"];
const EMPHASIS_RE = new RegExp(
  `(${EMPHASIS.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g"
);

function emphasize(text: string): ReactNode[] {
  return text.split(EMPHASIS_RE).map((part, i) =>
    EMPHASIS.includes(part) ? (
      <strong key={i} className="font-semibold text-text">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * One timeline entry. No card: the date, role and company establish the
 * structure. The current role carries a thin amber rail; past roles keep the
 * same indent so everything lines up.
 */
function RoleEntry({ role }: { role: Role }) {
  return (
    <article
      className={`border-l-2 pl-6 sm:pl-8 ${
        role.current ? "border-l-accent" : "border-l-transparent"
      }`}
    >
      <p className="num text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
        {role.period.replace(" - ", " — ")}
      </p>
      <h3 className="mt-2.5 text-[20px] font-semibold tracking-tight text-text">
        {role.role}
      </h3>
      <p className="mt-1 text-[14px] font-medium text-text">
        {role.company}
        <span className="font-normal text-faint"> · {role.location}</span>
      </p>

      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
        {emphasize(role.summary)}
      </p>

      <ul className="mt-6 grid max-w-4xl gap-x-12 gap-y-4 lg:grid-cols-2">
        {role.highlights.map((h) => (
          <li
            key={h}
            className="relative pl-5 text-[15px] leading-[1.65] text-muted before:absolute before:left-0 before:top-[0.72em] before:h-[5px] before:w-[5px] before:rounded-full before:bg-faint before:content-['']"
          >
            {emphasize(h)}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[12.5px] text-faint">
        {role.stack.slice(0, 7).join(" · ")}
      </p>
    </article>
  );
}

export function Experience() {
  return (
    <SectionShell id="experience" index="03" label="Experience">
      <div className="space-y-16">
        {experience.map((role) => (
          <RoleEntry key={role.company} role={role} />
        ))}
      </div>
    </SectionShell>
  );
}
