import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Full-Stack Systems Engineer",
  tagline:
    "I build and connect the services behind reliable web platforms — from event-driven backends to responsive interfaces.",
  location: "Cairo, Egypt",
  email: "Youssefbushra16.4@gmail.com",
  phone: "+20 120 149 3395",
  metaDescription:
    "Youssef Bushra Fouad — full-stack software engineer specializing in backend systems, microservices and distributed architecture with NestJS, Node.js, TypeScript and PostgreSQL. Experienced integrating enterprise platforms and optimizing high-volume data operations.",
  summary: [
    "Full-stack software engineer with a backend and distributed-systems focus. I design and ship scalable microservices with NestJS, Node.js, TypeScript, PostgreSQL and MongoDB — wiring them together with event-driven patterns, caching and observability so they stay reliable under load.",
    "I've integrated enterprise platforms like Microsoft Dynamics 365 Finance and Odoo, optimized high-volume data operations across 10M+ records with Elasticsearch, and built the responsive Next.js interfaces that sit on top. I care about clean service boundaries, measurable performance, and interfaces that feel effortless.",
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
  stats: [
    { label: "Records indexed", value: "10M+", hint: "Elasticsearch geo-search" },
    { label: "Query p95", value: "600ms", hint: "target < 1s" },
    { label: "Cumulative GPA", value: "4.00", hint: "Distinction w/ Honors" },
    { label: "Services shipped", value: "2+ yrs", hint: "production systems" },
  ],
};

export const navNodes: NavNode[] = [
  { id: "about", label: "About", service: "svc/about" },
  { id: "experience", label: "Experience", service: "svc/experience" },
  { id: "projects", label: "Projects", service: "svc/projects" },
  { id: "skills", label: "Skills", service: "svc/skills" },
  { id: "contact", label: "Contact", service: "svc/contact" },
];
