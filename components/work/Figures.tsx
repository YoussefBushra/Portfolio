import type { WorkFigure } from "@/content/work";

/* Engineer-view exhibits. All colours come from the palette tokens. Amber is
   reserved for the failure path — the one place the accent carries meaning in
   a diagram. */

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
        className={
          failure ? "fill-accent/10 stroke-accent/70" : "fill-bg stroke-line"
        }
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
          Posting across a consistency boundary: a finance event, delivered at
          least once, is checked against the ERP so a redelivery is a no-op;
          each line is posted across the boundary to Dynamics 365, which shares
          no transaction with the platform; on partial failure the accepted
          lines are compensated, and a failed compensation becomes the explicit
          state ROLLBACK_FAILED.
        </title>
        <defs>
          <marker
            id="arr"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 z" className="fill-faint" />
          </marker>
          <marker
            id="arr-fail"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
          </marker>
        </defs>

        <Node x={1} y={1} title="Finance event" sub="at-least-once delivery" />
        <Node
          x={1}
          y={87}
          title="Already in the ERP?"
          sub="yes → no-op (duplicate-safe)"
        />
        <Node
          x={1}
          y={173}
          title="Post each line"
          sub="one financial document"
        />
        <Node x={1} y={281} title="Dynamics 365 F&O" sub="document posted" />

        <g className="stroke-faint" strokeWidth={1.25} fill="none">
          <path d="M116 51 V85" markerEnd="url(#arr)" />
          <path d="M116 137 V171" markerEnd="url(#arr)" />
          <path d="M116 223 V279" markerEnd="url(#arr)" />
        </g>
        {/* The consistency boundary: no transaction spans it. */}
        <path
          d="M1 251 H262"
          className="stroke-line"
          strokeWidth={1}
          strokeDasharray="2 4"
          fill="none"
        />
        <text x={128} y={246} fontSize={10} className="fill-muted">
          consistency boundary
        </text>
        <text x={128} y={265} fontSize={10} className="fill-faint">
          no shared transaction
        </text>

        <Node
          x={271}
          y={173}
          title="Compensate"
          sub="reverse accepted lines"
          failure
        />
        <Node
          x={271}
          y={281}
          title="ROLLBACK_FAILED"
          sub="explicit, visible state"
          failure
        />

        <g
          className="stroke-accent"
          strokeWidth={1.25}
          fill="none"
          strokeDasharray="4 3"
        >
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

export function WorkFigureView({ figure }: { figure: WorkFigure }) {
  return figure.kind === "d365-flow" ? <D365Flow /> : null;
}
