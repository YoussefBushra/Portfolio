"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The signature. A schematic of the architecture described in the Experience
 * section — an API gateway in front of a RabbitMQ message bus that fans out
 * to domain services, each owning its own store — with signal packets
 * travelling the asynchronous hops. It renders the page's thesis, "I build
 * the services other systems depend on," instead of asserting it. Every label
 * is drawn from the real stack; nothing here is invented. Motion stops
 * entirely under prefers-reduced-motion, leaving a clean static diagram.
 */

type Node = { x: number; y: number; label: string; sub?: string };

const GATEWAY: Node = { x: 150, y: 150, label: "API Gateway", sub: "auth · routing" };
const CLIENT: Node = { x: 44, y: 150, label: "Clients" };
const BUS_X = 300;
const BUS_TOP = 78;
const BUS_BOTTOM = 222;

const SERVICES: Node[] = [
  { x: 452, y: 96, label: "Logistics" },
  { x: 452, y: 150, label: "Finance Ops" },
  { x: 452, y: 204, label: "Search" },
];

const STORES: Node[] = [
  { x: 640, y: 96, label: "PostgreSQL" },
  { x: 640, y: 150, label: "MongoDB" },
  { x: 640, y: 204, label: "Elasticsearch" },
];

function Packet({
  from,
  to,
  delay,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
}) {
  return (
    <motion.circle
      r={3}
      fill="rgb(var(--accent))"
      initial={{ opacity: 0 }}
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1.1,
        ease: "easeInOut",
        times: [0, 0.15, 0.85, 1],
      }}
      style={{ filter: "drop-shadow(0 0 4px rgb(var(--accent) / 0.9))" }}
    />
  );
}

export function ServiceTopology() {
  const reduce = useReducedMotion();

  const edgeStroke = "rgb(var(--line))";
  const edgeActive = "rgb(var(--accent) / 0.5)";

  return (
    <svg
      viewBox="0 0 720 300"
      role="img"
      aria-label="Architecture diagram: clients reach an API gateway that fans requests across a RabbitMQ message bus to logistics, finance and search services, each backed by its own datastore."
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ---- edges ---- */}
      {/* client -> gateway */}
      <line x1={CLIENT.x + 10} y1={CLIENT.y} x2={GATEWAY.x - 42} y2={GATEWAY.y} stroke={edgeStroke} strokeWidth={1.5} />
      {/* gateway -> bus */}
      <line x1={GATEWAY.x + 42} y1={GATEWAY.y} x2={BUS_X} y2={GATEWAY.y} stroke={edgeActive} strokeWidth={1.5} />
      {/* bus -> services */}
      {SERVICES.map((s) => (
        <line key={`e-${s.label}`} x1={BUS_X} y1={s.y} x2={s.x - 40} y2={s.y} stroke={edgeActive} strokeWidth={1.5} />
      ))}
      {/* services -> stores */}
      {SERVICES.map((s, i) => (
        <line key={`s-${s.label}`} x1={s.x + 40} y1={s.y} x2={STORES[i].x - 34} y2={STORES[i].y} stroke={edgeStroke} strokeWidth={1.5} strokeDasharray="3 4" />
      ))}

      {/* ---- moving packets (async hops only) ---- */}
      {!reduce && (
        <>
          <Packet from={{ x: GATEWAY.x + 42, y: GATEWAY.y }} to={{ x: BUS_X, y: GATEWAY.y }} delay={0} />
          {SERVICES.map((s, i) => (
            <Packet key={`p-${s.label}`} from={{ x: BUS_X, y: s.y }} to={{ x: s.x - 40, y: s.y }} delay={0.5 + i * 0.45} />
          ))}
        </>
      )}

      {/* ---- message bus ---- */}
      <rect
        x={BUS_X - 7}
        y={BUS_TOP}
        width={14}
        height={BUS_BOTTOM - BUS_TOP}
        rx={7}
        fill="rgb(var(--accent) / 0.12)"
        stroke="rgb(var(--accent) / 0.55)"
        strokeWidth={1.25}
      />
      <text
        x={BUS_X}
        y={BUS_TOP - 12}
        textAnchor="middle"
        className="fill-accent-text font-mono"
        fontSize={11}
        style={{ letterSpacing: "0.12em" }}
      >
        RabbitMQ
      </text>
      <text x={BUS_X} y={BUS_BOTTOM + 22} textAnchor="middle" className="fill-faint font-mono" fontSize={9.5}>
        message bus
      </text>

      {/* ---- client node ---- */}
      <circle cx={CLIENT.x} cy={CLIENT.y} r={5} fill="rgb(var(--surface-2))" stroke="rgb(var(--faint))" strokeWidth={1.5} />
      <text x={CLIENT.x} y={CLIENT.y + 22} textAnchor="middle" className="fill-muted font-mono" fontSize={10}>
        {CLIENT.label}
      </text>

      {/* ---- gateway node ---- */}
      <g>
        <rect x={GATEWAY.x - 42} y={GATEWAY.y - 20} width={84} height={40} rx={6} fill="rgb(var(--surface))" stroke="rgb(var(--accent) / 0.6)" strokeWidth={1.5} />
        <text x={GATEWAY.x} y={GATEWAY.y - 1} textAnchor="middle" className="fill-text font-mono" fontSize={11} fontWeight={600}>
          {GATEWAY.label}
        </text>
        <text x={GATEWAY.x} y={GATEWAY.y + 12} textAnchor="middle" className="fill-faint font-mono" fontSize={8.5}>
          {GATEWAY.sub}
        </text>
      </g>

      {/* ---- service + store nodes ---- */}
      {SERVICES.map((s, i) => (
        <g key={`node-${s.label}`}>
          <rect x={s.x - 40} y={s.y - 16} width={80} height={32} rx={6} fill="rgb(var(--surface))" stroke="rgb(var(--line))" strokeWidth={1.5} />
          <circle cx={s.x - 40 + 11} cy={s.y} r={2.5} fill="rgb(var(--accent))" />
          <text x={s.x + 4} y={s.y + 3.5} textAnchor="middle" className="fill-text font-mono" fontSize={10}>
            {s.label}
          </text>

          {/* store */}
          <g>
            <path
              d={`M ${STORES[i].x - 22} ${STORES[i].y - 11} h 44 v 22 h -44 z`}
              fill="rgb(var(--surface-2))"
              stroke="rgb(var(--line))"
              strokeWidth={1.25}
            />
            <text x={STORES[i].x} y={STORES[i].y + 3.5} textAnchor="middle" className="fill-muted font-mono" fontSize={8.5}>
              {STORES[i].label}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
