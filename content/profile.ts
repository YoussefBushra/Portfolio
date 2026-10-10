import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Backend-Focused Software Engineer",
  thesis: "I build and evolve software for complex business operations.",
  tagline:
    "Software engineer focused on reliable systems, enterprise integrations, business workflows, and end-to-end product delivery.",
  location: "Cairo, Egypt",
  metaDescription:
    "Youssef Bushra Fouad — backend-focused software engineer building production systems for logistics and finance: Microsoft Dynamics 365 integrations, CRM workflows, invoicing and payments, and backend services with NestJS, Node.js, TypeScript, PostgreSQL, RabbitMQ, Redis and Elasticsearch.",
  summary: [
    "I build backend services for a production multi-tenant SaaS platform. Services are decomposed by business domain, own their data, and communicate asynchronously through a message broker, behind a single API gateway that resolves authentication and authorization centrally.",
    "Most of my work sits between services: boundaries and message contracts, tenant isolation enforced at the data-access layer, idempotent consumers, and the asynchronous flows that keep independently deployed services consistent under load. I build the interfaces on top of them too, and I care about clean boundaries, measurable performance, and systems that stay legible as they grow.",
  ],
  engineer: {
    thesis: "Backend systems that stay correct when things fail halfway.",
    tagline:
      "Backend-focused full-stack engineer on a production multi-tenant logistics platform. My work sits where correctness is hard: financial integration with an external ERP, duplicate-safe message processing, and workflows that span independently deployed services.",
    summary: [
      "Most of what I work on lives between services. The platform is split into domain-oriented services that are deployed independently, own their data and communicate through a message broker — so the hard problems are rarely inside one service. They are in the contracts between services, in messages that arrive twice, and in workflows that have to finish correctly when one participant doesn't.",
      "I work within an existing multi-tenant architecture and build feature services and integrations on top of it: consumers that tolerate at-least-once delivery, domain operations with explicit transactional boundaries, tenant-aware data access, and long-running work moved out of the request path. When something is slow or failing in production, I start from traces and logs rather than guesses. I build the React and Next.js interfaces too, but I approach systems backend-first: where the consistency boundary is, what happens on retry, and whether the next engineer can still follow the flow.",
    ],
  },
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
