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
  },
];
