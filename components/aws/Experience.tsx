import { experience } from "@/content/experience";
import { Container } from "@/components/aws/Container";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16">
      <Container
        title="Experience"
        description="Production systems shipped across teams in Cairo and Dubai"
        counter={`(${experience.length})`}
      >
        <div className="divide-y divide-border-2">
          {experience.map((job) => (
            <article key={job.company} className="py-5 first:pt-0 last:pb-0">
              {/* header row */}
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div>
                  <h3 className="text-[15px] font-bold text-text">
                    {job.role}
                  </h3>
                  <div className="mt-0.5 text-[13px] text-muted">
                    {job.company} · {job.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${
                      job.current
                        ? "border-ok/40 bg-ok/10 text-ok"
                        : "border-border bg-surface-2 text-muted"
                    }`}
                  >
                    {job.current ? "Active" : "Completed"}
                  </span>
                  <span className="mono text-[12px] text-faint">
                    {job.period}
                  </span>
                </div>
              </div>

              {/* metrics */}
              {job.metrics?.length ? (
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {job.metrics.map((m) => (
                    <div key={m.label} className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-bold text-text">
                        {m.value}
                      </span>
                      <span className="text-[12px] text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              <p className="mt-3 text-[13px] leading-relaxed text-text">
                {job.summary}
              </p>

              {/* highlights as a compact property list */}
              <dl className="mt-3 space-y-1.5">
                {job.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 gap-x-3 sm:grid-cols-[128px_1fr]"
                  >
                    <dt className="text-[12.5px] font-semibold text-accent">
                      {h.lead}
                    </dt>
                    <dd className="text-[13px] leading-relaxed text-muted">
                      {h.text}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* stack */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.stack.map((t) => (
                  <span
                    key={t}
                    className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
