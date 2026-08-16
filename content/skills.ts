import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    name: "Core",
    items: [
      "Node.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "RabbitMQ",
      "React",
      "Next.js",
    ],
  },
  {
    name: "Architecture",
    items: [
      "Microservices",
      "Multi-tenant SaaS",
      "Event-driven architecture",
      "API gateway",
      "Micro-frontends",
    ],
  },
  {
    name: "Observability and infrastructure",
    items: ["Elasticsearch", "OpenTelemetry", "Grafana", "Docker", "GitHub Actions"],
  },
  {
    name: "APIs and testing",
    items: ["REST", "GraphQL", "Jest", "Swagger"],
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
