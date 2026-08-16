import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Backend-Focused Full Stack Engineer",
  thesis: "I build the services other systems depend on.",
  tagline:
    "Backend and distributed systems: message-driven microservices on a multi-tenant SaaS platform, search at scale, and enterprise integrations.",
  location: "Cairo, Egypt",
  metaDescription:
    "Youssef Bushra Fouad, backend-focused full stack engineer building microservices for a multi-tenant SaaS platform with NestJS, Node.js, TypeScript, RabbitMQ, PostgreSQL and MongoDB. Experienced in event-driven architecture, enterprise integrations and high-volume search.",
  summary: [
    "I build backend services for a production multi-tenant SaaS platform. Services are decomposed by business domain, own their data, and communicate asynchronously through a message broker, behind a single API gateway that resolves authentication and authorization centrally.",
    "Most of my work sits between services: boundaries and message contracts, tenant isolation enforced at the data-access layer, idempotent consumers, and the asynchronous flows that keep independently deployed services consistent under load. I build the interfaces on top of them too, and I care about clean boundaries, measurable performance, and systems that stay legible as they grow.",
  ],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/YoussefBushra",
      handle: "YoussefBushra",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/youssefbushra",
      handle: "in/youssefbushra",
    },
  ],
  availability: "Open to backend and full-stack roles",
  /* Facts, all taken from work described elsewhere on this page. Years of
     experience is computed from the roles, so it never goes stale. */
  facts: [
    {
      value: "~40",
      label: "services and frontends",
      hint: "multi-tenant SaaS platform",
    },
    {
      value: "3+",
      label: "financial systems integrated",
      hint: "enterprise platforms, event-driven",
    },
    {
      value: "10M+",
      label: "records under geo-search",
      hint: "Elasticsearch",
    },
    {
      value: "600ms",
      label: "geo-query response",
      hint: "target under 1s",
    },
  ],
};

export const navNodes: NavNode[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
  { id: "contact", label: "Contact" },
];
