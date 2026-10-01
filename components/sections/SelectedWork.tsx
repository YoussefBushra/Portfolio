import { SectionShell } from "@/components/layout/SectionShell";
import { Engineer, withCode } from "@/components/view/Layer";
import { CodeBlock, WorkFigureView } from "@/components/work/Figures";
import { work, type WorkItem } from "@/content/work";

const monoLabel =
  "font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-faint";

/**
 * Recruiter view: a 2×2 grid of outcomes in plain language.
 * Engineer view: the same cards widen into full-width case studies, and an
 * "Under the hood" layer expands beneath each outcome — notes on one side, a
 * figure (and pseudocode) on the other. The outcome text never changes.
 */
export function SelectedWork() {
  return (
    <SectionShell id="work" index="01" label="Selected Work">
      <div
        className="work-grid grid grid-cols-1 gap-4 lg:grid-cols-2"
        data-reflow-fit
      >
        {work.map((w) => (
          <article
            key={w.title}
            data-reflow
            className="panel flex flex-col p-7 transition-all duration-200 hover:border-faint hover:shadow-md sm:p-9"
          >
            <h3 className="text-[20px] font-semibold leading-snug tracking-tight text-text">
              {w.title}
            </h3>
            <p className="mt-2 text-[13px] text-faint">{w.context}</p>

            <p className="mt-4 max-w-3xl text-[15.5px] leading-[1.7] text-muted">
              {w.summary}
            </p>

            <p className="mt-6 text-[13px] text-faint">{w.tech.join(" · ")}</p>

            <Engineer className="pt-9" label="under-the-hood">
              <UnderTheHood item={w} />
            </Engineer>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function UnderTheHood({ item }: { item: WorkItem }) {
  const { points, figure, code, tradeoff, differently } = item.engineer;

  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent-text">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        Under the hood
      </p>

      {/* minmax(0, …) on every track: the <pre> must scroll inside its own box,
          never widen the column (which the layer would then clip). */}
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,442px)] lg:gap-14">
        <div>
          <ul className="space-y-3.5">
            {points.map((p) => (
              <li
                key={p}
                className="relative pl-5 text-[14.5px] leading-[1.65] text-muted before:absolute before:left-0 before:top-[0.7em] before:h-[5px] before:w-[5px] before:rounded-full before:bg-faint before:content-['']"
              >
                {withCode(p)}
              </li>
            ))}
          </ul>

          {tradeoff ? (
            <div className="mt-8">
              <p className={monoLabel}>Trade-off</p>
              <p className="mt-2.5 text-[14.5px] leading-[1.65] text-text">{tradeoff}</p>
            </div>
          ) : null}

          {differently ? (
            <div className="mt-8">
              <p className={monoLabel}>What I&rsquo;d do differently</p>
              <p className="mt-2.5 text-[14.5px] leading-[1.65] text-text">{differently}</p>
            </div>
          ) : null}
        </div>

        {figure || code ? (
          <div className="space-y-8">
            {figure ? <WorkFigureView figure={figure} /> : null}
            {code ? <CodeBlock code={code} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
