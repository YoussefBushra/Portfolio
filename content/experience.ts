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
    engineering: [
      "Transactional inbox/outbox, idempotency guards, compensating rollback and pessimistic_write locks, so financial events survive RabbitMQ redelivery without double-posting.",
      "D365 Finance & Operations over OData: OAuth2 client credentials, 401 refresh-and-retry, 429 back-off honouring Retry-After, decimal.js for every amount.",
      "Micro-frontends in Next.js embedded via iframe, with postMessage events to the host shell; ISO 6346 container check-digit validation.",
      "Operator-attributed audit logging threaded through the in-house CRUD generator, in both runtime and ts-morph-generated code, and fault-isolated from business writes.",
      "History index in Elasticsearch moved from flat subject strings to nested entities, enabling id-scoped audit lookups.",
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
    engineering: [
      "Elasticsearch geo-location queries tuned against a 10M+ document index to ~600 ms average.",
      "NestJS services with GraphQL and TypeORM over PostgreSQL, Redis for hot data.",
      "JWT authentication with role-based authorization enforced across services.",
      "Filebeat → Logstash → Elasticsearch → Kibana pipeline; logs and traces used to find slow paths before changing code.",
    ],
  },
];
