import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    name: "Backend",
    service: "svc/backend",
    items: ["Node.js", "NestJS", "Express.js", "TypeORM", "Mongoose"],
  },
  {
    name: "Distributed Systems",
    service: "svc/systems",
    items: [
      "Microservices",
      "Event-driven architecture",
      "RabbitMQ",
      "Service design",
    ],
  },
  {
    name: "Data & Storage",
    service: "svc/data",
    items: ["PostgreSQL", "MongoDB", "MS SQL Server", "PL/SQL", "SQLite", "Redis"],
  },
  {
    name: "APIs",
    service: "svc/apis",
    items: ["REST", "GraphQL", "Swagger", "JWT / Auth"],
  },
  {
    name: "Search & Observability",
    service: "svc/observability",
    items: ["Elasticsearch", "Kibana", "Filebeat", "Logstash", "Grafana"],
  },
  {
    name: "Languages",
    service: "svc/languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C#", "C++"],
  },
  {
    name: "Frontend",
    service: "svc/frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
  },
  {
    name: "Testing & Tooling",
    service: "svc/quality",
    items: ["Jest", "Selenium", "Git", "GitHub", "Bitbucket", "Postman"],
  },
];
