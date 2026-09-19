import { experience } from "@/content/experience";
import { Container } from "@/components/aws/Container";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16">
      <Container title="Experience">
        <div className="divide-y divide-border-2">
          {experience.map((job) => (
            <article key={job.company} className="py-6 first:pt-0 last:pb-0">
              {/* header row — dates alone signal current vs past */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[15px] font-semibold text-text">
                  {job.role}
                  <span className="font-normal text-muted">
                    {"  "}· {job.company} · {job.location}
                  </span>
                </h3>
                <span className="text-[12.5px] text-muted">{job.period}</span>
              </div>

              {job.metrics?.length ? (
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
                  {job.metrics.map((m) => (
                    <div key={m.label} className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-semibold text-text">
                        {m.value}
                      </span>
                      <span className="text-[12.5px] text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-text">
                {job.summary}
              </p>

              {/* highlights as a compact property list */}
              <dl className="mt-3.5 space-y-2">
                {job.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 gap-x-4 sm:grid-cols-[140px_1fr]"
                  >
                    <dt className="text-[12.5px] font-semibold text-text">
                      {h.lead}
                    </dt>
                    <dd className="max-w-2xl text-[13px] leading-relaxed text-muted">
                      {h.text}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* primary tools, as plain text — the full index lives in Stack */}
              <p className="mt-4 text-[12.5px] text-faint">
                <span className="font-semibold text-muted">Stack&nbsp;·&nbsp;</span>
                {job.stack.slice(0, 7).join(", ")}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
