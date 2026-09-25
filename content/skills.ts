import type { SkillGroup } from "@/lib/types";

/** Supporting evidence, kept simple and categorized — not the main selling point. */
export const skillGroups: SkillGroup[] = [
  {
    name: "Integrating business systems",
    items: ["Microsoft Dynamics 365", "REST", "GraphQL", "OData", "Swagger"],
    why: "Every vendor API goes behind one typed client, so auth, retries and rate limits live in one place instead of in every caller.",
  },
  {
    name: "Reliable financial processing",
    items: ["RabbitMQ", "Inbox / outbox", "Idempotent consumers", "decimal.js"],
    why: "Assume every message arrives twice. Guard with business keys, lock only where ordering matters, and never use floats for money.",
  },
  {
    name: "Backend services",
    items: ["NestJS", "Node.js", "TypeScript", "TypeORM", "Express"],
    why: "NestJS microservices talking over RabbitMQ RPC, with one gateway at the edge; TypeORM migrations with explicit backfills.",
  },
  {
    name: "Search & data",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    why: "Postgres by default. Elasticsearch when the query is search-shaped (geo, full-text, nested). Redis for hot, disposable data.",
  },
  {
    name: "Observability",
    items: ["OpenTelemetry", "Grafana", "Kibana", "Logstash", "Filebeat"],
    why: "Measure before tuning: traces and logs decide what to optimise, not intuition.",
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
    why: "Micro-frontends embedded in a host shell; validation that mirrors backend rules so errors surface before submit.",
  },
  {
    name: "Testing & delivery",
    items: ["Jest", "Testcontainers", "Docker", "GitHub Actions"],
    why: "Real Postgres in tests via Testcontainers; conventional commits and release-it for versioned packages.",
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
