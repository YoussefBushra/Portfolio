import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    name: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "TypeORM", "Mongoose", "Django"],
  },
  {
    name: "Distributed systems",
    items: [
      "Microservices",
      "Event-driven architecture",
      "RabbitMQ",
      "RMI",
      "Service design",
    ],
  },
  {
    name: "Data and storage",
    items: ["PostgreSQL", "MongoDB", "MS SQL Server", "PL/SQL", "SQLite", "Redis"],
  },
  {
    name: "APIs",
    items: ["REST", "GraphQL", "Swagger", "JWT and auth"],
  },
  {
    name: "Search and observability",
    items: ["Elasticsearch", "Kibana", "Filebeat", "Logstash", "Grafana"],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux"],
  },
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C#", "C++", "X++"],
  },
  {
    name: "ML and data",
    items: ["PyTorch", "Google Cloud AI", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  {
    name: "Testing and tooling",
    items: ["Jest", "Selenium", "Git", "GitHub", "Bitbucket", "Postman"],
  },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
