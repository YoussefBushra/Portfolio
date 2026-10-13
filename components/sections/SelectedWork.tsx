import { SectionShell } from "@/components/layout/SectionShell";
import { Engineer } from "@/components/view/Layer";
import { WorkFigureView } from "@/components/work/Figures";
import { work, type WorkItem } from "@/content/work";

const monoLabel =
  "font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-faint";

/**
 * Recruiter view: a 2×2 grid of outcomes in plain language.
 * Developer view: the same cards widen into full-width case studies. The
 * outcome and tool line give way to the engineering problem and the technical
 * areas it touches (`rec-only` / `dev-only`), and an "Under the hood" layer
 * expands beneath: design decisions and failure modes, a figure where one
 * explains the design, and the trade-off.
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

            <p className="rec-only mt-4 max-w-3xl text-[15.5px] leading-[1.7] text-muted">
              {w.summary}
            </p>
            {w.engineer.question ? (
              <p className="dev-only mt-5 max-w-3xl text-pretty text-[17px] font-medium leading-[1.5] tracking-tight text-text">
                {w.engineer.question}
              </p>
            ) : null}
            <p className="dev-only mt-4 max-w-3xl text-[15.5px] leading-[1.7] text-muted">
              {w.engineer.problem}
            </p>

            <p className="rec-only mt-6 text-[13px] text-faint">
              {w.tech.join(" · ")}
            </p>
            <TechnicalAreas item={w} />

            <Engineer className="pt-9" label="under-the-hood">
              <UnderTheHood item={w} />
            </Engineer>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/** Engineering concepts first, then the technologies, as one compact block. */
function TechnicalAreas({ item }: { item: WorkItem }) {
  const { concepts, stack } = item.engineer;
  return (
    <div className="dev-only mt-6">
      <p className={monoLabel}>Technical areas</p>
      <p className="mt-2.5 max-w-3xl text-[14px] leading-relaxed text-text">
        {concepts.join(" · ")}
      </p>
      <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-faint">
        {stack.join(" · ")}
      </p>
    </div>
  );
}

function UnderTheHood({ item }: { item: WorkItem }) {
  const { points, figure, note } = item.engineer;

  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent-text">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        Under the hood
      </p>

      <ul className="mt-6 grid gap-x-12 gap-y-5 lg:grid-cols-2">
        {points.map((p) => (
          <li
            key={p.lead}
            className="relative pl-5 text-[14.5px] leading-[1.65] text-muted before:absolute before:left-0 before:top-[0.7em] before:h-[5px] before:w-[5px] before:rounded-full before:bg-faint before:content-['']"
          >
            <span className="font-medium text-text">{p.lead}</span> {p.text}
          </li>
        ))}
      </ul>

      {/* The figure sits to the right of the note it illustrates (the trade-off is
          about the boundary the diagram draws), so neither leaves a column
          of empty space next to the points. */}
      {figure || note ? (
        <div
          className={`mt-9 grid grid-cols-[minmax(0,1fr)] gap-9 ${
            figure && note
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,442px)] lg:items-center lg:gap-14"
              : ""
          }`}
        >
          {note ? (
            <div className="max-w-3xl border-l-2 border-l-accent/60 pl-5">
              <p className={monoLabel}>{note.label}</p>
              <p className="mt-2.5 text-[14.5px] leading-[1.65] text-text">
                {note.text}
              </p>
            </div>
          ) : null}
          {figure ? <WorkFigureView figure={figure} /> : null}
        </div>
      ) : null}
    </div>
  );
}
