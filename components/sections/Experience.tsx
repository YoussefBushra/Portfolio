import { experience } from "@/content/experience";
import { careerStartYear } from "@/lib/timeline";
import { SectionShell } from "@/components/layout/SectionShell";
import { RoleEntry } from "@/components/sections/RoleEntry";

export function Experience() {
  return (
    <SectionShell
      id="experience"
      label="Experience"
      meta={`${careerStartYear()} to present`}
    >
      <div className="space-y-5 md:space-y-9">
        {experience.map((role) => (
          <RoleEntry key={role.company} role={role} />
        ))}
      </div>

      {/* The site carries a curated set of highlights; the CV is the full record. */}
      <a
        href="/portfolio.pdf"
        download="Youssef-Bushra-Fouad-CV.pdf"
        className="focus-ring group mt-6 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-accent-text"
      >
        View full CV
        <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
          →
        </span>
      </a>
    </SectionShell>
  );
}
