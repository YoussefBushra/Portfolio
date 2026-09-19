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
      "Backend services for a production multi-tenant SaaS platform, where domain services communicate asynchronously over RabbitMQ message patterns behind a single API gateway.",
    stack: [
      "TypeScript",
      "NestJS",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "TypeORM",
      "RabbitMQ",
      "Redis",
      "React",
      "Next.js",
      "OpenTelemetry",
      "Grafana",
      "Docker",
      "GitHub Actions",
      "Jest",
    ],
    metrics: [
      { label: "services and frontends", value: "~40" },
      { label: "service messaging", value: "Event-driven" },
      { label: "platforms integrated", value: "D365 + Odoo" },
    ],
    highlights: [
      {
        lead: "Platform",
        text: "backend services for a production multi-tenant SaaS platform spanning roughly 40 service and frontend applications, across logistics and financial-operations domains.",
      },
      {
        lead: "Microservices",
        text: "service boundaries, message contracts, tenant isolation, and event-driven communication over RabbitMQ with idempotent consumers, in TypeScript and NestJS.",
      },
      {
        lead: "Integrations",
        text: "Microsoft Dynamics 365 Finance, Odoo and custom third-party financial systems, synchronized through asynchronous, message-based flows.",
      },
      {
        lead: "Data & observability",
        text: "PostgreSQL, MongoDB and Redis, with OpenTelemetry tracing and Grafana dashboards, to keep production systems reliable and observable under load.",
      },
      {
        lead: "Delivery",
        text: "features across independently deployed Next.js applications behind a shared shell, shipped as Docker images through GitHub Actions CI.",
      },
    ],
  },
  {
    company: "Block Gemini",
    role: "Full Stack Software Engineer",
    location: "Dubai, UAE",
    period: "Jan 2024 - Aug 2024",
    start: "2024-01",
    end: "2024-08",
    summary:
      "Led geo-search optimization over a 10M-record dataset and built the logging pipeline the team monitored it with.",
    stack: [
      "NestJS",
      "TypeORM",
      "PostgreSQL",
      "GraphQL",
      "Redis",
      "Elasticsearch",
      "Kibana",
      "Filebeat",
      "JWT",
      "Swagger",
      "Next.js 14",
      "Tailwind CSS",
    ],
    metrics: [
      { label: "records searched", value: "10M+" },
      { label: "geo-query p95, target under 1s", value: "600ms" },
    ],
    highlights: [
      {
        lead: "Geo-search",
        text: "optimized geo-location search over a 10-million-record Elasticsearch dataset to a 600 ms average, against a sub-1-second target.",
      },
      {
        lead: "APIs",
        text: "RESTful APIs with NestJS, TypeORM and PostgreSQL, plus GraphQL over a Redis cache to streamline client-side querying.",
      },
      {
        lead: "Access control",
        text: "JWT authentication and role-based authorization across microservices, kept consistent between services without sacrificing scalability.",
      },
      {
        lead: "Logging pipeline",
        text: "Filebeat, Elasticsearch and Kibana for real-time log collection, monitoring and visualization, integrated with DevOps into backend services.",
      },
      {
        lead: "Frontend",
        text: "Next.js 14 and Tailwind features integrated with the NestJS APIs, with a multi-national team across Dubai, India, Romania and Egypt.",
      },
    ],
  },
];
