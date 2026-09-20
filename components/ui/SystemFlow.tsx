/**
 * A restrained system-flow diagram used as the portfolio's decorative
 * language — thin lines, small nodes, monospace labels, one accent. Pure SVG,
 * no animation beyond a single optional reveal handled by the caller. It reads
 * as engineering documentation, not a hero graphic.
 *
 * Client → API → Services → Cache / DB / Queue → Workers
 */

interface NodeSpec {
  id: string;
  label: string;
  x: number;
  y: number;
  accent?: boolean;
}

const W = 260;
const H = 360;

const NODES: NodeSpec[] = [
  { id: "client", label: "Client", x: 130, y: 26, accent: true },
  { id: "api", label: "API gateway", x: 130, y: 100 },
  { id: "services", label: "Services", x: 130, y: 174, accent: true },
  { id: "cache", label: "Cache", x: 42, y: 252 },
  { id: "db", label: "Database", x: 130, y: 252 },
  { id: "queue", label: "Queue", x: 218, y: 252 },
  { id: "workers", label: "Workers", x: 130, y: 330 },
];

const EDGES: [string, string][] = [
  ["client", "api"],
  ["api", "services"],
  ["services", "cache"],
  ["services", "db"],
  ["services", "queue"],
  ["cache", "workers"],
  ["db", "workers"],
  ["queue", "workers"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function SystemFlow({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="System architecture flow: client to API gateway to services to cache, database and queue, then workers"
      fill="none"
    >
      {/* edges */}
      <g
        stroke="rgb(var(--line))"
        strokeWidth="1"
        strokeLinecap="round"
      >
        {EDGES.map(([a, b], i) => {
          const na = byId[a];
          const nb = byId[b];
          return <line key={i} x1={na.x} y1={na.y + 10} x2={nb.x} y2={nb.y - 10} />;
        })}
      </g>

      {/* nodes */}
      {NODES.map((n) => {
        const w = Math.max(58, n.label.length * 6.2 + 22);
        return (
          <g key={n.id} transform={`translate(${n.x - w / 2}, ${n.y - 11})`}>
            <rect
              width={w}
              height={22}
              rx={5}
              fill="rgb(var(--surface))"
              stroke="rgb(var(--line))"
              strokeWidth="1"
            />
            <circle
              cx={11}
              cy={11}
              r={2.5}
              fill={n.accent ? "rgb(var(--accent))" : "rgb(var(--faint))"}
            />
            <text
              x={20}
              y={12}
              fontSize="8.5"
              fill="rgb(var(--muted))"
              dominantBaseline="middle"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
