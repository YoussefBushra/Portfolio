import { SectionShell } from "@/components/layout/SectionShell";

/** Request → API → Search layer → 10M+ records → ~600ms */
const FLOW = ["Request", "API", "Search layer", "10M+ records", "~600ms"];

function DataFlow() {
  const W = 780;
  const H = 84;
  const pad = 14;
  const gap = (W - pad * 2) / FLOW.length;
  const widths = FLOW.map((l) => Math.max(78, l.length * 7.2 + 26));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Data flow: request to API to search layer over 10M-plus records, returning in roughly 600 milliseconds"
      fill="none"
    >
      <defs>
        <marker
          id="cs-arrow"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M1 1L6 4L1 7" stroke="rgb(var(--faint))" strokeWidth="1.2" fill="none" />
        </marker>
      </defs>
      {FLOW.map((label, i) => {
        const cx = pad + gap * i + gap / 2;
        const w = widths[i];
        const last = i === FLOW.length - 1;
        const nextCx = pad + gap * (i + 1) + gap / 2;
        return (
          <g key={label}>
            {i < FLOW.length - 1 ? (
              <line
                x1={cx + w / 2 + 4}
                y1={H / 2}
                x2={nextCx - widths[i + 1] / 2 - 8}
                y2={H / 2}
                stroke="rgb(var(--line))"
                strokeWidth="1.2"
                markerEnd="url(#cs-arrow)"
              />
            ) : null}
            <g transform={`translate(${cx - w / 2}, ${H / 2 - 15})`}>
              <rect
                width={w}
                height={30}
                rx={6}
                fill={last ? "rgb(var(--accent) / 0.10)" : "rgb(var(--surface))"}
                stroke={last ? "rgb(var(--accent) / 0.45)" : "rgb(var(--line))"}
                strokeWidth="1"
              />
              <circle
                cx={13}
                cy={15}
                r={2.6}
                fill={last ? "rgb(var(--accent))" : "rgb(var(--faint))"}
              />
              <text
                x={23}
                y={16}
                fontSize="10.5"
                fill={last ? "rgb(var(--accent-text))" : "rgb(var(--muted))"}
                dominantBaseline="middle"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

const STAGES = [
  {
    k: "Problem",
    v: "Geo-location search over a 10-million-record dataset had to return in under a second.",
  },
  {
    k: "Approach",
    v: "Optimized the Elasticsearch queries and indexing for the geo-search workload, behind a NestJS API.",
  },
  {
    k: "Result",
    v: "Reached a ~600 ms average response — comfortably inside the sub-1-second target.",
  },
];

export function CaseStudy() {
  return (
    <SectionShell id="case-study" label="Engineering Case Study" variant="wide">
      <div className="panel p-6 sm:p-8">
        <h3 className="text-[20px] font-semibold tracking-tight text-text sm:text-[24px]">
          Geo-location search at 10M+ records
        </h3>
        <p className="mt-1.5 text-[13px] text-muted">
          Block Gemini · Dubai · Jan–Aug 2024
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-3">
          {STAGES.map((s) => (
            <div key={s.k}>
              <div className="block-label text-accent-text">{s.k}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-text">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <DataFlow />
        </div>

        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-4 text-[12.5px] text-muted">
          <span className="font-medium text-text">Stack</span>
          <span>Elasticsearch · NestJS · PostgreSQL · Redis · Kibana</span>
        </div>
      </div>
    </SectionShell>
  );
}
