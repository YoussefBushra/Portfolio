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
        <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-text sm:text-[30px]">
            {profile.name}
          </h1>
          <div className="mt-1 text-[15px] text-muted">{profile.role}</div>

          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-text">
            {profile.thesis} {profile.tagline}
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

      {/* Body: metric tiles + current role */}
      <div className="mx-auto max-w-[1240px] space-y-4 px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {profile.facts.map((f) => (
            <div key={f.label} className="cs-container px-4 py-3.5">
              <div className="text-[13px] text-muted">{f.label}</div>
              <div className="mt-1 text-[24px] font-bold leading-none tracking-tight text-text">
                {f.value}
              </div>
              <div className="mono mt-1.5 text-[11px] text-faint">{f.hint}</div>
            </div>
          ))}
        </div>

        <Container
          title="Current role"
          description="What I'm building right now"
          actions={
            <span className="rounded border border-ok/40 bg-ok/10 px-2 py-0.5 text-[11px] font-semibold text-ok">
              Active
            </span>
          }
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {[
              { k: "Role", v: cur.role },
              { k: "Company", v: cur.company },
              { k: "Location", v: cur.location },
              { k: "Period", v: cur.period },
            ].map((kv) => (
              <div key={kv.k}>
                <div className="kv-label">{kv.k}</div>
                <div className="kv-value">{kv.v}</div>
              </div>
            ))}
          </div>

          <p className="mt-4 border-t border-border-2 pt-4 text-[13px] leading-relaxed text-text">
            {cur.summary}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {cur.stack.slice(0, 8).map((t) => (
              <span
                key={t}
                className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
