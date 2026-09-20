import type { SkillGroup } from "@/lib/types";

/**
 * The stack as engineering domains, not a tool list. Backend, data,
 * architecture and search lead; frontend and tooling are present but
 * secondary, matching the backend-focused positioning. Evidence links tie a
 * domain to where it was actually used on this page.
 */
export const skillGroups: SkillGroup[] = [
  {
    name: "Backend",
    emphasis: "primary",
    items: ["Node.js", "NestJS", "TypeScript", "RabbitMQ", "REST", "GraphQL"],
  },
  {
    name: "Data",
    emphasis: "primary",
    items: ["PostgreSQL", "MongoDB", "Redis"],
    evidence: { label: "Production backend systems", href: "#experience" },
  },
  {
    name: "Search & observability",
    emphasis: "primary",
    items: ["Elasticsearch", "OpenTelemetry", "Grafana", "Kibana"],
    evidence: { label: "10M-record geo-search", href: "#case-study" },
  },
  {
    name: "Architecture",
    emphasis: "primary",
    items: [
      "Microservices",
      "Event-driven architecture",
      "Multi-tenant SaaS",
      "API gateway",
    ],
  },
  {
    name: "Frontend",
    emphasis: "secondary",
    items: ["React", "Next.js", "Micro-frontends"],
  },
  {
    name: "Tooling",
    emphasis: "secondary",
    items: ["Docker", "GitHub Actions", "Jest", "Swagger"],
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
