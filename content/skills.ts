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
        "Domain-oriented services that are deployed independently, own their data and expose explicit message contracts — request/response over a broker rather than direct HTTP calls between services.",
    },
  },
  {
    name: "Data & search",
    plain: "Databases & search",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    engineer: {
      name: "Data & consistency",
      concerns:
        "Transactional boundaries around multi-record domain operations, tenant-aware data access, schema migrations with data backfills, and Elasticsearch for geospatial search and audit history.",
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
      "Idempotent consumers",
      "Transactional inbox / outbox",
      "Compensating transactions",
      "Database locking",
      "Tenant-aware data access",
    ],
    engineer: {
      name: "Distributed consistency",
      concerns:
        "The patterns that keep independently deployed services consistent when messages repeat, writers compete and downstream calls fail partway.",
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
        "Backend-first full-stack work: React and Next.js interfaces over the services, including micro-frontends embedded in a host shell.",
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
