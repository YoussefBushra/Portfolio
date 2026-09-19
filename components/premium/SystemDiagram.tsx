"use client";

import { useState } from "react";

interface Node {
  id: string;
  label: string;
  meta: string;
  x: number;
  y: number;
  w?: number;
}

const NODES: Node[] = [
  { id: "client", label: "Client", meta: "Next.js · React", x: 180, y: 34, w: 96 },
  { id: "api", label: "API Gateway", meta: "REST · GraphQL · JWT", x: 180, y: 116, w: 120 },
  { id: "auth", label: "Auth", meta: "role-based access", x: 74, y: 196, w: 84 },
  { id: "core", label: "Core Services", meta: "NestJS · TypeScript", x: 186, y: 196, w: 116 },
  { id: "search", label: "Search", meta: "10M docs · 600ms", x: 300, y: 196, w: 84 },
  { id: "cache", label: "Cache", meta: "Redis", x: 74, y: 292, w: 84 },
  { id: "db", label: "Database", meta: "PostgreSQL · Mongo", x: 186, y: 292, w: 116 },
  { id: "queue", label: "Queue", meta: "RabbitMQ", x: 300, y: 292, w: 84 },
  { id: "workers", label: "Workers", meta: "async pipelines", x: 186, y: 380, w: 116 },
];

const EDGES: [string, string][] = [
  ["client", "api"],
  ["api", "auth"],
  ["api", "core"],
  ["api", "search"],
  ["auth", "cache"],
  ["core", "cache"],
  ["core", "db"],
  ["core", "queue"],
  ["search", "db"],
  ["queue", "workers"],
  ["db", "workers"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function SystemDiagram({ className }: { className?: string }) {
  const [hover, setHover] = useState<string | null>(null);

  const neighbors = (id: string) => {
    const set = new Set<string>([id]);
    EDGES.forEach(([a, b]) => {
      if (a === id) set.add(b);
      if (b === id) set.add(a);
    });
    return set;
  };
  const active = hover ? neighbors(hover) : null;
  const edgeOn = (a: string, b: string) =>
    hover != null && (a === hover || b === hover);

  return (
    <svg
      viewBox="0 0 380 420"
      className={className}
      role="img"
      aria-label="Abstract system architecture: client to API to services to data stores and workers"
    >
      <defs>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* edges */}
      <g strokeLinecap="round" fill="none">
        {EDGES.map(([a, b], i) => {
          const na = byId[a];
          const nb = byId[b];
          const on = edgeOn(a, b);
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={on ? "rgb(var(--accent))" : "rgb(var(--border))"}
              strokeWidth={on ? 1.4 : 1}
              strokeDasharray="3 5"
              className="[animation:flow_9s_linear_infinite]"
              style={{
                opacity: hover && !on ? 0.35 : on ? 0.9 : 0.5,
                transition: "opacity .25s, stroke .25s",
              }}
            />
          );
        })}
      </g>

      {/* nodes */}
      {NODES.map((n) => {
        const dim = active && !active.has(n.id);
        const isHover = hover === n.id;
        const w = n.w ?? 96;
        const h = 34;
        return (
          <g
            key={n.id}
            transform={`translate(${n.x - w / 2}, ${n.y - h / 2})`}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              opacity: dim ? 0.4 : 1,
              transition: "opacity .25s",
              cursor: "default",
            }}
          >
            {isHover ? (
              <rect
                x={-3}
                y={-3}
                width={w + 6}
                height={h + 6}
                rx={11}
                fill="rgb(var(--accent) / 0.14)"
                filter="url(#soft)"
              />
            ) : null}
            <rect
              width={w}
              height={h}
              rx={9}
              fill="rgb(var(--surface))"
              stroke={isHover ? "rgb(var(--accent))" : "rgb(var(--border))"}
              strokeWidth="1"
              style={{ transition: "stroke .25s" }}
            />
            <circle
              cx={13}
              cy={h / 2}
              r={3}
              fill={isHover ? "rgb(var(--accent))" : "rgb(var(--accent) / 0.55)"}
            />
            <text
              x={26}
              y={h / 2 - 2}
              fontSize="10"
              fontWeight="600"
              fill="rgb(var(--text))"
              dominantBaseline="middle"
              fontFamily="var(--font-sans)"
            >
              {n.label}
            </text>
            <text
              x={26}
              y={h / 2 + 9}
              fontSize="6.5"
              fill="rgb(var(--muted))"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              style={{ letterSpacing: "0.04em" }}
            >
              {n.meta}
            </text>
          </g>
        );
      })}

      <style>{`@keyframes flow { to { stroke-dashoffset: -32; } }`}</style>
    </svg>
  );
}
