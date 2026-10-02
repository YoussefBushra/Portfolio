/**
 * Skills: the tools, from the CV, told twice.
 *
 * Recruiter view: the tools, grouped under plain category names (`plain`);
 * groups that are practices rather than tools (`practice`) are left out.
 * Developer view: every group, with a one-line note on where each part was
 * used (a factual "where", not an opinionated "why").
 */

export interface StackRow {
  name: string;
  /** The category name in the recruiter view, if it differs. */
  plain?: string;
  /** Practices rather than tools: shown in the developer view only. */
  practice?: boolean;
  items: string[];
  note?: string;
}

export const stack: StackRow[] = [
  {
    name: "Backend",
    items: [
      "NestJS",
      "Node.js",
      "Express.js",
      "TypeScript",
      "TypeORM",
      "Mongoose",
    ],
    note: "NestJS microservices that talk over RabbitMQ RPC rather than REST.",
  },
  {
    name: "Data & search",
    plain: "Databases & search",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    note: "PostgreSQL + TypeORM with migrations and data backfills; Elasticsearch for geo-search and audit history.",
  },
  {
    name: "Messaging & integration",
    plain: "Integrations",
    items: ["RabbitMQ", "Microsoft Dynamics 365", "REST", "GraphQL", "Swagger"],
    note: "Dynamics 365 Finance & Operations over OData, with OAuth2 client-credentials.",
  },
  {
    name: "Reliability patterns",
    practice: true,
    items: [
      "Microservices",
      "Transactional inbox / outbox",
      "Idempotent consumers",
      "Compensating rollback",
      "Database locking",
      "Multi-tenancy",
    ],
  },
  {
    name: "Observability",
    plain: "Monitoring",
    items: ["OpenTelemetry", "Grafana", "Kibana", "Logstash", "Filebeat"],
    note: "Logs and traces used to investigate issues and guide performance decisions.",
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
    note: "Next.js micro-frontends embedded in a host shell over iframe + postMessage.",
  },
  {
    name: "Testing & delivery",
    plain: "Testing & deployment",
    items: ["Jest", "Testcontainers", "Docker", "GitHub Actions"],
    note: "Unit and e2e tests against a real Postgres; multi-stage Docker builds; build and release pipelines.",
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
