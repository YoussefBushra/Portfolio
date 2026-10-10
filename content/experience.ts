import type { Experience } from "@/lib/types";

export const experience: Experience[] = [
  {
    company: "Skil-Dev",
    role: "Full Stack Software Engineer",
    location: "Cairo, Egypt",
    period: "Aug 2024 - Present",
    start: "2024-08",
    current: true,
    summary:
      "Backend-focused full-stack development on a production logistics and freight-forwarding platform: financial integration with Microsoft Dynamics 365, CRM and business workflows, document automation, and the user-facing applications on top.",
    stack: [
      "TypeScript",
      "NestJS",
      "Node.js",
      "PostgreSQL",
      "RabbitMQ",
      "React",
      "Next.js",
      "Microsoft Dynamics 365",
    ],
    highlights: [
      "Built core parts of the integration with Microsoft Dynamics 365 Finance & Operations — the connection layer and the posting of invoices, payments and customer records — so that a failure is undone or clearly flagged instead of leaving the accounting records half-updated.",
      "Built the CRM's business workflows for leads, companies, contacts, activities and financial accounts, including lead-to-customer conversion, validated bulk import from Excel, and a complete audit trail.",
      "Built automated generation of shipping documents from data held by several services, running as background jobs rather than inside a user's request.",
      "Built user-facing CRM and catalog screens in React and Next.js, delivering features end to end across frontend and backend.",
      "Supported junior-engineer development through onboarding, task assignment, pull-request reviews, and progress evaluation.",
    ],
    engineer: {
      summary:
        "Backend-focused full-stack work on a production multi-tenant logistics platform of independently deployed, domain-oriented services. I develop business-domain services, integrations and user-facing applications within its established architecture, integrating with the existing tenant-isolation and authorization mechanisms.",
      highlights: [
        "Built the Dynamics 365 F&O integration client — authentication, retries and rate-limit handling behind one OData layer — and the posting pipelines for customer records, invoices and custody payments, and co-developed others: duplicate-safe mutations under at-least-once delivery, compensating rollback across the ERP boundary, decimal-precise amounts.",
        "Created the CRM service's 10 feature modules (~62 message-based RPC handlers): an atomic, audited lead-to-customer conversion, validation aligned with the ERP's rules, and a validated batch-import pipeline.",
        "Built the catalog service's document-generation subsystem as asynchronous jobs over data aggregated from several services, with consignee-data masking and scheduled clean-up of finished jobs.",
        "Made a finance event consumer retry-safe under redelivery (transactional stamping with row locking), and added audit logging to finance confirmation flows and to the platform's CRUD generator.",
        "Built micro-frontend features in React and Next.js: the CRM's company and lead experience end to end, and container management in the catalog.",
        "Supported junior engineers and interns through onboarding, task assignment, pull-request reviews and progress evaluation.",
      ],
    },
  },
  {
    company: "Block Gemini",
    role: "Full Stack Software Engineer",
    location: "Dubai, UAE",
    period: "Jan 2024 - Aug 2024",
    start: "2024-01",
    end: "2024-08",
    summary:
      "Optimized geo-location search over a 10M+ record dataset, reaching approximately 600 ms average response against a one-second target.",
    stack: [
      "NestJS",
      "PostgreSQL",
      "Elasticsearch",
      "Redis",
      "GraphQL",
      "Kibana",
    ],
    highlights: [
      "Tuned Elasticsearch indexing and queries to bring geo-location search under the one-second target.",
      "Built the search APIs, and a logging pipeline with the DevOps team to monitor them.",
      "Implemented authentication and role-based access across the services.",
      "Collaborated with a distributed team across Dubai, India, Romania and Egypt.",
    ],
    engineer: {
      summary:
        "Search APIs and geospatial search performance for a large location dataset, in a team distributed across Dubai, India, Romania and Egypt.",
      highlights: [
        "Tuned Elasticsearch indexing and geo-location queries against a one-second response target (see Selected Work).",
        "Built REST and GraphQL APIs and data-access services on NestJS, TypeORM and PostgreSQL, documented with Swagger.",
        "Built and maintained the logging pipeline (Filebeat, Elasticsearch, Kibana) with the DevOps team, used to see where time was being spent.",
        "Implemented JWT authentication and role-based authorization across the services.",
      ],
    },
  },
];
