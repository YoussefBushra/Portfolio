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
      "Backend and full-stack development for a logistics and freight-forwarding platform, working across CRM, invoicing, Microsoft Dynamics 365 integrations, and document workflows.",
    stack: [
      "TypeScript",
      "NestJS",
      "Node.js",
      "PostgreSQL",
      "RabbitMQ",
      "Redis",
      "React",
      "Next.js",
      "Microsoft Dynamics 365",
    ],
    highlights: [
      "Built CRM features for leads, companies, contacts, activities, and financial accounts, including bulk Excel import and validation.",
      "Integrated Microsoft Dynamics 365 for invoices, payments, customers, and exchange rates.",
      "Built automated generation of shipping documents and document bundles from data collected across multiple services.",
      "Developed and maintained NestJS microservices using RabbitMQ and PostgreSQL.",
    ],
    engineer: {
      summary:
        "Backend-focused full-stack work on a production multi-tenant logistics platform built from independently deployed, domain-oriented services. I work within the existing architecture — its tenancy model, gateway and shared libraries — and build feature services and integrations on top of it.",
      highlights: [
        "Built the CRM service's feature modules (about 10 modules, ~62 message-based RPC handlers), including atomic multi-record domain operations and an ERP-aligned batch-import pipeline.",
        "Owned key parts of the Dynamics 365 Finance & Operations integration client and posting logic: duplicate-safe financial mutations under at-least-once delivery, and compensating recovery from partial failure across the ERP boundary.",
        "Built the document-generation service as asynchronous job orchestration over data aggregated from several services.",
        "Investigated production behaviour with OpenTelemetry traces and Grafana to locate slow paths and failure sources before changing code.",
        "Queried existing MongoDB-backed services alongside PostgreSQL-based work, and built React and Next.js interfaces on top of the services.",
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
      "Built the search APIs and a logging and monitoring pipeline to operate the system.",
      "Implemented authentication and role-based access across the services.",
      "Collaborated with a distributed team across Dubai, India, Romania and Egypt.",
    ],
    engineer: {
      summary:
        "Latency-sensitive geospatial search over a 10M+ record dataset, measured against a one-second response target.",
      highlights: [
        "Worked on Elasticsearch indexing and geo-location queries, reaching ~600 ms average response against the one-second target.",
        "Built search APIs and data-access services on NestJS, PostgreSQL, Redis and GraphQL.",
        "Built the logging and monitoring pipeline (Filebeat, Logstash, Elasticsearch, Kibana) and used it with traces to direct performance work at measured slow paths.",
        "Implemented authentication and role-based access control across the services, in a team distributed across Dubai, India, Romania and Egypt.",
      ],
    },
  },
];
