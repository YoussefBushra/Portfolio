import { caseStudies } from "@/content/work";
import type { CaseStudy } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";
import { FlowDiagram } from "@/components/view/FlowDiagram";
import { Eng, EngInline, Rec, Stagger } from "@/components/view/Layers";

/**
 * Case studies, one full-width row each. The shared layer is a plain-language
 * outcome; the engineer layer opens underneath with the flow, the mechanisms,
 * the numbers, a trade-off and a lesson. Rows are full width so the diagram has
 * room without the grid reflowing between views.
 */
export function SelectedWork() {
  return (
    <SectionShell
      id="work"
      index="01"
      label="Selected Work"
      meta={
        <>
          <Rec>What was built and why it mattered</Rec>
          <EngInline>Architecture · trade-offs · lessons</EngInline>
        </>
      }
    >
      <div className="space-y-4">
        {caseStudies.map((c, i) => (
          <CaseRow key={c.id} c={c} n={i + 1} />
        ))}
      </div>
    </SectionShell>
  );
}

function CaseRow({ c, n }: { c: CaseStudy; n: number }) {
  const e = c.engineer;
  // Stagger indices continue after the diagram so the layer reads top-down.
  const base = e.flow.length * 2 + 1;

  return (
    <article className="panel p-6 sm:p-8">
      <div className="grid gap-x-10 gap-y-4 md:grid-cols-[190px_minmax(0,1fr)]">
        <div className="text-[13px] leading-snug">
          <p className="num font-mono text-[11px] text-accent-text">
            {String(n).padStart(2, "0")}
          </p>
          <p className="mt-2 font-medium text-text">{c.company}</p>
          <p className="text-faint">{c.domain}</p>
          <p className="num mt-0.5 text-faint">{c.period}</p>
        </div>

        <div className="min-w-0">
          <h3 className="text-[20px] font-semibold leading-snug tracking-tight text-text sm:text-[22px]">
            {c.title}
          </h3>
          <p className="mt-3 max-w-3xl text-[15.5px] leading-[1.7] text-muted">{c.outcome}</p>
          <p className="mt-4 text-[13px] text-faint">{c.tech.join(" · ")}</p>
        </div>
      </div>

      <Eng className="pt-6">
        <div className="eng-panel space-y-6 md:ml-[230px]">
          <div>
            <p className="eng-label">How it flows</p>
            <div className="mt-3">
              <FlowDiagram steps={e.flow} failure={e.failure} />
            </div>
          </div>

          <dl className="grid gap-x-8 gap-y-3.5 lg:grid-cols-2">
            {e.notes.map((note, i) => (
              <Stagger key={note.k} i={base + i}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-text">
                  {note.k}
                </dt>
                <dd className="mt-0.5 font-sans text-[13.5px] leading-[1.6]">{note.v}</dd>
              </Stagger>
            ))}
          </dl>

          {e.code ? (
            <Stagger i={base + e.notes.length}>
              <pre className="overflow-x-auto rounded-sm border border-line bg-bg p-4 text-[12px] leading-[1.7] text-text">
                <code>{e.code}</code>
              </pre>
            </Stagger>
          ) : null}

          <Stagger i={base + e.notes.length + 1} className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
            <div>
              <p className="eng-label">Trade-off</p>
              <p className="mt-1.5 font-sans text-[13.5px] leading-[1.6]">{e.tradeoff}</p>
            </div>
            <div>
              <p className="eng-label">What I&apos;d do differently</p>
              <p className="mt-1.5 font-sans text-[13.5px] leading-[1.6]">{e.differently}</p>
            </div>
          </Stagger>

          {e.figures ? (
            <Stagger i={base + e.notes.length + 2}>
              <p className="num flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-4 text-[11.5px] text-faint">
                {e.figures.map((f) => (
                  <span key={f}>
                    <span className="text-accent-text">▸</span> {f}
                  </span>
                ))}
              </p>
            </Stagger>
          ) : null}
        </div>
      </Eng>
    </article>
  );
}
