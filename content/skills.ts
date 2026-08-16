import type { SkillGroup } from "@/lib/types";

/**
 * The stack, as a capability index: each group is an eyebrow with its members
 * set as type. Order runs from what the work is built on outward to how it is
 * shaped and shipped.
 */
export const stackGroups: SkillGroup[] = [
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
