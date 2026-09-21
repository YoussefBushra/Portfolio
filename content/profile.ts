import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Backend-Focused Software Engineer",
  thesis: "I build backend systems for logistics and finance.",
  tagline:
    "Software engineer working on production business systems, ERP integrations, CRM workflows, and backend services.",
  location: "Cairo, Egypt",
  metaDescription:
    "Youssef Bushra Fouad — backend-focused software engineer building production systems for logistics and finance: Microsoft Dynamics 365 integrations, CRM workflows, invoicing and payments, and backend services with NestJS, Node.js, TypeScript, PostgreSQL, RabbitMQ, Redis and Elasticsearch.",
  summary: [
    "I'm a backend-focused software engineer working on production systems for logistics and financial operations. My work includes CRM features, Microsoft Dynamics 365 integrations, invoicing and payment workflows, and automated shipping-document generation.",
    "I work primarily with NestJS, PostgreSQL, RabbitMQ and TypeScript, and also contribute to the React/Next.js applications built around these services.",
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
