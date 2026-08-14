import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Backend-Focused Full Stack Engineer",
  thesis: "I build the services other systems depend on.",
  tagline:
    "Backend and distributed systems: message-driven microservices on a multi-tenant SaaS platform, search at scale, and enterprise integrations.",
  location: "Cairo, Egypt",
  email: "Youssefbushra16.4@gmail.com",
  phone: "+20 120 149 3395",
  metaDescription:
    "Youssef Bushra Fouad, backend-focused full stack engineer building microservices for a multi-tenant SaaS platform with NestJS, Node.js, TypeScript, RabbitMQ, PostgreSQL and MongoDB. Experienced in event-driven architecture, enterprise integrations and high-volume search.",
  summary: [
    "I build backend services for a production multi-tenant SaaS platform, where roughly 40 services and frontend applications talk over RabbitMQ message patterns behind a single API gateway rather than calling each other directly. My work sits in service decomposition, message contracts, tenant-isolated data models, and the asynchronous flows that keep them consistent.",
    "I have integrated Microsoft Dynamics 365 Finance and Odoo with custom financial systems, optimized geo-search across 10M+ records with Elasticsearch, and built the Next.js frontends that consume the services I ship. I care about clean service boundaries, measurable performance, and interfaces that feel effortless.",
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
    {
      label: "Email",
      href: "mailto:Youssefbushra16.4@gmail.com",
      handle: "Youssefbushra16.4@gmail.com",
    },
  ],
  /* Three facts, all taken from work described elsewhere on this page. */
  facts: [
    {
      value: "~40",
      label: "services and frontends",
      hint: "multi-tenant SaaS platform, message-driven",
    },
    {
      value: "10M+",
      label: "records under geo-search",
      hint: "Elasticsearch, at Block Gemini",
    },
    {
      value: "600ms",
      label: "average geo-query response",
      hint: "against a target under 1s",
    },
  ],
};

export const navNodes: NavNode[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "contact", label: "Contact" },
];
