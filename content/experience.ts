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
      "Backend and full-stack development on a production logistics and freight-forwarding platform, supporting financial and operational workflows across CRM, invoicing and system integrations.",
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
      "Built and maintained backend services for a live logistics and freight-forwarding platform used in production.",
      "Developed core CRM features — leads, companies, contacts, activities, documents and financial accounts — with bulk data import and validation.",
      "Built integrations with Microsoft Dynamics 365 to synchronize invoices, payments, customers and exchange rates between systems.",
      "Automated logistics document generation, producing shipping documents, commercial invoices and manifests from data across several systems.",
      "Focused on reliability and data integrity in how independently deployed services communicate.",
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
      "Optimized large-scale geo-location search and built the tooling the team used to run and monitor it.",
    stack: [
      "NestJS",
      "PostgreSQL",
      "Elasticsearch",
      "Redis",
      "GraphQL",
      "Kibana",
    ],
    highlights: [
      "Optimized geo-location search over a 10-million-record dataset, reaching a 600 ms average response against a sub-1-second target.",
      "Built the APIs and the logging and monitoring pipeline the team used to operate the search system.",
      "Handled authentication and role-based access across the services.",
      "Worked with a multi-national team across Dubai, India, Romania and Egypt.",
    ],
  },
];
