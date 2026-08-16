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
    name: "Observability & infrastructure",
    items: ["Elasticsearch", "OpenTelemetry", "Grafana", "Docker", "GitHub Actions"],
  },
  {
    name: "APIs & testing",
    items: ["REST", "GraphQL", "Swagger", "Jest"],
  },
  {
    name: "Architecture",
    items: [
      "Microservices",
      "Event-driven architecture",
      "Multi-tenant SaaS",
      "API gateway",
      "Micro-frontends",
    ],
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
