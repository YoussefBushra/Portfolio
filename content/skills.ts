import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    name: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "TypeScript", "TypeORM", "Mongoose"],
  },
  {
    name: "Architecture",
    items: [
      "Microservices",
      "Multi-tenant SaaS",
      "Event-driven architecture",
      "Service decomposition",
      "API gateway pattern",
      "Micro-frontends",
    ],
  },
  {
    name: "Messaging and caching",
    items: [
      "RabbitMQ",
      "Redis",
      "Idempotent consumers",
      "Async processing",
      "Query optimization",
    ],
  },
  {
    name: "Data and storage",
    items: ["PostgreSQL", "MongoDB", "MS SQL Server", "PL/SQL", "SQLite"],
  },
  {
    name: "APIs",
    items: ["REST", "GraphQL", "Swagger", "JWT and role-based access"],
  },
  {
    name: "Search and observability",
    items: [
      "Elasticsearch",
      "Kibana",
      "Filebeat",
      "Logstash",
      "Grafana",
      "OpenTelemetry",
    ],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux"],
  },
  {
    name: "Testing and delivery",
    items: ["Jest", "Docker", "GitHub Actions", "Git", "Postman"],
  },
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C#", "C++", "X++"],
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
