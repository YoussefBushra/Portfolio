import type { SkillGroup } from "@/lib/types";

/** Supporting evidence, kept simple and categorized — not the main selling point. */
export const skillGroups: SkillGroup[] = [
  { name: "Backend", items: ["NestJS", "Node.js", "TypeScript"] },
  {
    name: "Data & search",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
  },
  {
    name: "Architecture & integration",
    items: ["Microservices", "RabbitMQ", "Microsoft Dynamics 365"],
  },
  { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { name: "Testing & delivery", items: ["Jest", "Docker", "GitHub Actions"] },
];

export const spokenLanguages = "Arabic (native), English (C1), German (A1)";
