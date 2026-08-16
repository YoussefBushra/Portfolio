import type { Project } from "@/lib/types";

/**
 * Kept deliberately short. Anything added here shows up in the Work section
 * automatically; set `featured: false` to move an entry behind the "earlier
 * projects" disclosure instead of listing it up front.
 */
export const projects: Project[] = [
  {
    name: "Elasticsearch geo-search at scale",
    kind: "Backend and search systems",
    year: "2024",
    featured: true,
    blurb:
      "Optimized geo-location search over a very large dataset at Block Gemini, plus a real-time logging pipeline (Filebeat to Elasticsearch to Kibana) for monitoring and visualization.",
    metrics: [
      { label: "records", value: "10M+" },
      { label: "query p95", value: "600ms" },
    ],
    tech: ["Elasticsearch", "Kibana", "Filebeat", "NestJS", "PostgreSQL", "Redis"],
  },
  {
    name: "Dynamics 365 and Odoo integration",
    kind: "Enterprise integration",
    year: "2024",
    featured: true,
    blurb:
      "Integrations between Microsoft Dynamics 365 Finance, Odoo and custom third-party financial systems, keeping data synchronized through event-driven, reliable async processing.",
    metrics: [{ label: "pattern", value: "Event-driven" }],
    tech: ["Microsoft Dynamics 365", "Odoo", "RabbitMQ", "NestJS", "TypeScript"],
  },
  {
    name: "Accelerated deep neuroevolution",
    kind: "Graduation research",
    year: "2022",
    featured: true,
    blurb:
      "Research designing evolving deep neural networks that use hardware accelerators to solve supervised and reinforcement-learning tasks, tested on MNIST image recognition and simulated 3D robotic training.",
    metrics: [
      { label: "training time", value: "~30% less" },
      { label: "compute", value: "~30% less" },
    ],
    tech: ["Neuroevolution", "Deep Learning", "Hardware Accelerators", "MNIST", "RL"],
  },
];
