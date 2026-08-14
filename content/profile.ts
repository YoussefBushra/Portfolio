import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Full-Stack Systems Engineer",
  thesis: "I build the services other systems depend on.",
  tagline:
    "Backend and distributed systems: event-driven services, search at scale, and the integrations that keep enterprise platforms in sync.",
  location: "Cairo, Egypt",
  email: "Youssefbushra16.4@gmail.com",
  phone: "+20 120 149 3395",
  metaDescription:
    "Youssef Bushra Fouad, full-stack software engineer specializing in backend systems, microservices and distributed architecture with NestJS, Node.js, TypeScript and PostgreSQL. Experienced integrating enterprise platforms and optimizing high-volume data operations.",
  summary: [
    "I design and ship scalable microservices with NestJS, Node.js, TypeScript, PostgreSQL and MongoDB, wiring them together with event-driven patterns, caching and observability so they stay reliable under load.",
    "I have integrated enterprise platforms like Microsoft Dynamics 365 Finance and Odoo, optimized geo-search across 10M+ records with Elasticsearch, and built the Next.js interfaces that sit on top. I care about clean service boundaries, measurable performance, and interfaces that feel effortless.",
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
      value: "10M+",
      label: "records under geo-search",
      hint: "Elasticsearch, at Block Gemini",
    },
    {
      value: "600ms",
      label: "average geo-query response",
      hint: "against a target under 1s",
    },
    {
      value: "4.00",
      label: "cumulative GPA",
      hint: "BSc Computer Science, Distinction with Honors",
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
