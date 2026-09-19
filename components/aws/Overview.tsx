import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { Container, Status } from "@/components/aws/Container";
import { CvButton } from "@/components/aws/CvButton";

export function Overview() {
  const cur = experience[0];

  return (
    <section id="overview" className="scroll-mt-12">
      {/* Console page header — full-width white band under the service bar */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-7">
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-text sm:text-[29px]">
            {profile.name}
          </h1>
          <div className="mt-1 text-[15px] text-muted">{profile.role}</div>

          <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-snug text-text">
            {profile.thesis}
          </p>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            {profile.tagline}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Status kind="success">Available — open to roles</Status>
            <span className="text-[13px] text-muted">
              <span className="font-semibold text-text">Location:</span>{" "}
              {profile.location}
            </span>
            <span className="text-[13px] text-muted">
              <span className="font-semibold text-text">Focus:</span> Backend ·
              Distributed systems
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <CvButton from="overview" variant="primary" />
            <a href="#contact" className="btn-normal focus-ring">
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Body: KPI tiles + a slim current-role pointer */}
      <div className="mx-auto max-w-[1240px] space-y-4 px-4 pt-5 sm:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {profile.facts.map((f) => (
            <div key={f.label} className="cs-container flex flex-col px-4 py-3.5">
              <div className="min-h-[2.6em] text-[13px] leading-snug text-muted">
                {f.label}
              </div>
              <div className="mt-1 text-[26px] font-bold leading-none tracking-tight text-text">
                {f.value}
              </div>
              <div className="mt-1.5 text-[12px] text-faint">{f.hint}</div>
            </div>
          ))}
        </div>

        <Container title="Current role">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="text-[14px]">
              <span className="font-bold text-text">{cur.role}</span>
              <span className="text-muted">
                {" "}
                · {cur.company} · {cur.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Status kind="success">Active</Status>
              <span className="text-[12px] text-faint">{cur.period}</span>
            </div>
          </div>
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
            {cur.summary}
          </p>
          <a href="#experience" className="cs-link mt-2.5 inline-block text-[13px]">
            View full history in Experience ↓
          </a>
        </Container>
      </div>
    </section>
  );
}
