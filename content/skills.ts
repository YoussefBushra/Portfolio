/**
 * Skills, told twice.
 *
 * Recruiter view: what I can do, in plain language.
 * Engineer view: the actual stack, from the CV, with a one-line note on where
 * each part was used (a factual "where", not an opinionated "why").
 */

export interface Capability {
  name: string;
  text: string;
}

export interface StackRow {
  name: string;
  items: string[];
  note?: string;
}

export const capabilities: Capability[] = [
  {
    name: "Connecting business systems",
    text: "Linking the logistics platform with the accounting system (Microsoft Dynamics 365) and the CRM, so records move between them automatically.",
  },
  {
    name: "Reliable financial processing",
    text: "Invoices, payments and exchange rates handled so nothing is posted twice and nothing is left half-posted.",
  },
  {
    name: "Backend services",
    text: "The services and APIs behind a live logistics platform used by many client companies.",
  },
  {
    name: "Document automation",
    text: "Shipping paperwork generated automatically from shipment data.",
  },
  {
    name: "Search & data",
    text: "Large datasets and fast search — 10 million+ records in about 600 ms.",
  },
  {
    name: "Web applications",
    text: "React and Next.js screens built on top of those services.",
  },
];

export const stack: StackRow[] = [
  {
    name: "Backend",
    items: ["NestJS", "Node.js", "Express.js", "TypeScript", "TypeORM", "Mongoose"],
    note: "NestJS microservices that talk over RabbitMQ RPC rather than REST.",
  },
  {
    name: "Data & search",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    note: "PostgreSQL + TypeORM with migrations and data backfills; Elasticsearch for geo-search and audit history.",
  },
  {
    name: "Messaging & integration",
    items: ["RabbitMQ", "Microsoft Dynamics 365", "REST", "GraphQL", "Swagger"],
    note: "Dynamics 365 Finance & Operations over OData, with OAuth2 client-credentials.",
  },
  {
    name: "Reliability patterns",
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
    items: ["Jest", "Testcontainers", "Docker", "GitHub Actions"],
    note: "Unit and e2e tests against a real Postgres; multi-stage Docker builds; build and release pipelines.",
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
