import type { WorkFigure } from "@/content/work";

/* Engineer-view exhibits. All colours come from theme tokens, so every figure
   works in light and dark. Amber is reserved for the failure path — the one
   place the accent carries meaning in a diagram. */

function Node({
  x,
  y,
  title,
  sub,
  failure = false,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  failure?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={failure ? 170 : 230}
        height={50}
        rx={3}
        className={failure ? "fill-accent/10 stroke-accent/70" : "fill-bg stroke-line"}
        strokeWidth={1}
        strokeDasharray={failure ? "4 3" : undefined}
      />
      <text
        x={x + 14}
        y={y + 21}
        fontSize={12}
        fontWeight={500}
        className={failure ? "fill-accent-text" : "fill-text"}
      >
        {title}
      </text>
      <text x={x + 14} y={y + 37} fontSize={10.5} className="fill-faint">
        {sub}
      </text>
    </g>
  );
}

/** Service → idempotency check → OData posting → D365, with the compensation path. */
function D365Flow() {
  return (
    <figure>
      <svg
        viewBox="0 0 442 332"
        role="img"
        aria-labelledby="d365-flow-title"
        className="h-auto w-full max-w-[442px] font-mono"
      >
        <title id="d365-flow-title">
          Posting flow: a finance event is checked for an existing document, each line is
          posted to Dynamics 365 over OData, and on failure posted lines are rolled back, with a
          failed rollback flagged as ROLLBACK_FAILED.
        </title>
        <defs>
          <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" className="fill-faint" />
          </marker>
          <marker id="arr-fail" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
          </marker>
        </defs>

        <Node x={1} y={1} title="Finance event" sub="arrives over RabbitMQ" />
        <Node x={1} y={87} title="Already in D365?" sub="yes → skip (idempotent)" />
        <Node x={1} y={173} title="Post each line" sub="OData · OAuth2" />
        <Node x={1} y={281} title="Dynamics 365 F&O" sub="document posted" />

        <g className="stroke-faint" strokeWidth={1.25} fill="none">
          <path d="M116 51 V85" markerEnd="url(#arr)" />
          <path d="M116 137 V171" markerEnd="url(#arr)" />
          <path d="M116 223 V279" markerEnd="url(#arr)" />
        </g>
        <text x={128} y={246} fontSize={10.5} className="fill-muted">
          401 → refresh &amp; retry
        </text>
        <text x={128} y={261} fontSize={10.5} className="fill-muted">
          429 → wait Retry-After
        </text>

        <Node x={271} y={173} title="Compensate" sub="roll back posted lines" failure />
        <Node x={271} y={281} title="ROLLBACK_FAILED" sub="flagged, never lost" failure />

        <g className="stroke-accent" strokeWidth={1.25} fill="none" strokeDasharray="4 3">
          <path d="M232 198 H269" markerEnd="url(#arr-fail)" />
          <path d="M356 223 V279" markerEnd="url(#arr-fail)" />
        </g>
        <text x={236} y={190} fontSize={10} className="fill-accent-text">
          fail
        </text>
        <text x={364} y={254} fontSize={10} className="fill-accent-text">
          undo fails
        </text>
      </svg>
    </figure>
  );
}

/** A numbered sequence — the same numbering device as the section headers. */
function Steps({ caption, steps }: { caption: string; steps: string[] }) {
  return (
    <figure>
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        {caption}
      </figcaption>
      <ol className="mt-4">
        {steps.map((step, i) => (
          <li key={step} className="relative flex items-center gap-3.5 pb-4 last:pb-0">
            {i < steps.length - 1 ? (
              <span className="absolute bottom-0 left-[13px] top-7 w-px bg-line" aria-hidden />
            ) : null}
            <span className="num relative flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-line bg-bg font-mono text-[11px] text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[14.5px] text-text">{step}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function WorkFigureView({ figure }: { figure: WorkFigure }) {
  return figure.kind === "d365-flow" ? (
    <D365Flow />
  ) : (
    <Steps caption={figure.caption} steps={figure.steps} />
  );
}

/** Pseudocode with comments set quieter than the code. */
export function CodeBlock({ code }: { code: string }) {
  return (
    <figure>
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        Pseudocode
      </figcaption>
      <pre className="mt-3 overflow-x-auto rounded-sm bg-bg p-4 font-mono text-[11.5px] leading-[1.7] text-text">
        <code>
          {code.split("\n").map((line, i) => {
            const at = line.indexOf("//");
            return (
              <span key={i} className="block">
                {at === -1 ? (
                  line || " "
                ) : (
                  <>
                    {line.slice(0, at)}
                    <span className="text-faint">{line.slice(at)}</span>
                  </>
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
