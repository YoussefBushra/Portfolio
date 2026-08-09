import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    name: "Frontend",
    service: "svc/frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux"],
  },
  {
    name: "Backend",
    service: "svc/backend",
    items: ["Node.js", "NestJS", "Express.js", "TypeORM", "Mongoose", "Django"],
  },
  {
    name: "Distributed Systems",
    service: "svc/systems",
    items: [
      "Microservices",
      "Event-driven architecture",
      "RabbitMQ",
      "RMI",
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
    items: ["TypeScript", "JavaScript", "Python", "Java", "C#", "C++", "X++"],
  },
  {
    name: "ML & Data",
    service: "svc/ml",
    items: ["PyTorch", "Google Cloud AI", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  {
    name: "Testing & Tooling",
    service: "svc/quality",
    items: ["Jest", "Selenium", "Git", "GitHub", "Bitbucket", "Postman"],
  },
];
