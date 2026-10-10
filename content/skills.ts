/**
 * Skills: the tools, from the CV, told twice.
 *
 * Recruiter view: the tools, grouped under plain category names (`plain`,
 * else `name`); groups that are practices rather than tools (`practice`) are
 * left out.
 * Developer view: every group under `engineer.name`, led by what the tools
 * were used for — the engineering concerns — with the tools themselves
 * underneath. Every concern traces to work described on this page.
 */

export interface StackRow {
  name: string;
  /** The category name in the recruiter view, if it differs from `name`. */
  plain?: string;
  /** Practices rather than tools: shown in the developer view only. */
  practice?: boolean;
  items: string[];
  engineer: {
    name: string;
    /** What these were used for, as engineering concerns. */
    concerns: string;
  };
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
    engineer: {
      name: "Service design",
      concerns:
        "Business-domain services built within an existing multi-tenant architecture: explicit message contracts, request/response over a broker rather than direct HTTP calls, and integration with the platform's established tenant-isolation and authorization mechanisms.",
    },
  },
  {
    name: "Data & search",
    plain: "Databases & search",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    engineer: {
      name: "Data & consistency",
      concerns:
        "Transactional boundaries around multi-record domain operations, schema migrations with historical data backfills, and Elasticsearch for geospatial search and audit-history lookups.",
    },
  },
  {
    name: "Messaging & integration",
    plain: "Integrations",
    items: ["RabbitMQ", "Microsoft Dynamics 365", "REST", "GraphQL", "Swagger"],
    engineer: {
      name: "Messaging & external systems",
      concerns:
        "Consumers that tolerate at-least-once delivery, and integration with an ERP that cannot join a local transaction — kept consistent through duplicate-safe mutations and compensating actions.",
    },
  },
  {
    name: "Reliability patterns",
    practice: true,
    items: [
      "Idempotent processing",
      "Compensating operations",
      "Row-level locking",
      "Transactional inbox / outbox",
      "Audit logging",
    ],
    engineer: {
      name: "Distributed consistency",
      concerns:
        "Patterns applied in feature code — on top of the platform's shared messaging and audit libraries — so a workflow stays consistent when messages repeat, writers compete and downstream calls fail partway.",
    },
  },
  {
    name: "Observability",
    plain: "Monitoring",
    items: ["OpenTelemetry", "Grafana", "Kibana", "Logstash", "Filebeat"],
    engineer: {
      name: "Observability",
      concerns:
        "Trace- and log-driven investigation of production behaviour — locating slow paths and failure sources before changing code, and judging performance work against measured targets.",
    },
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
    engineer: {
      name: "Interfaces",
      concerns:
        "Backend-first full-stack work: user-facing React and Next.js features over the services, built as micro-frontends embedded in a shared host shell, with forms that enforce the same business rules as the backend.",
    },
  },
  {
    name: "Testing & delivery",
    plain: "Testing & deployment",
    items: ["Jest", "Testcontainers", "Docker", "GitHub Actions"],
    engineer: {
      name: "Testing & delivery",
      concerns:
        "Integration tests against a real PostgreSQL instance rather than mocks, multi-stage container builds, and automated build and release pipelines.",
    },
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
