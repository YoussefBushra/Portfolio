import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Backend-Focused Full Stack Engineer",
  thesis: "I build the services other systems depend on.",
  tagline:
    "Backend-focused engineer experienced in production systems, business applications, integrations, and scalable backend services.",
  location: "Cairo, Egypt",
  metaDescription:
    "Youssef Bushra Fouad, backend-focused full stack engineer building microservices for a multi-tenant SaaS platform with NestJS, Node.js, TypeScript, RabbitMQ, PostgreSQL and MongoDB. Experienced in event-driven architecture, enterprise integrations and high-volume search.",
  summary: [
    "I'm a backend-focused software engineer who builds and maintains the systems behind real business products — the services, integrations and data workflows that keep a platform running reliably.",
    "I work mostly on production systems in logistics and finance, and I build the interfaces on top of them too. What I care about most is reliability, data integrity, and keeping systems clear as they grow.",
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
  availability: "Open to Backend / Software Engineer roles",
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
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
