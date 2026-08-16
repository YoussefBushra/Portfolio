import type { SkillGroup } from "@/lib/types";

/**
 * Concrete tools, grouped. These render as brand logos in the Stack section.
 * Every name here must have a matching icon in the Stack component's map.
 */
export const skillTools: SkillGroup[] = [
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
    name: "Observability and infrastructure",
    items: ["Elasticsearch", "OpenTelemetry", "Grafana", "Docker", "GitHub Actions"],
  },
  {
    name: "APIs and testing",
    items: ["GraphQL", "Jest", "Swagger"],
  },
];

/**
 * Approaches and patterns — not products, so they have no logo and are set as
 * plain text rather than dressed up as tools.
 */
export const practices = [
  "Microservices",
  "Event-driven architecture",
  "Multi-tenant SaaS",
  "API gateway",
  "Micro-frontends",
  "REST",
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
