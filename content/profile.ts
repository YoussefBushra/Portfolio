import type { NavNode, Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Youssef Bushra Fouad",
  role: "Software Engineer · Enterprise Systems & Delivery",
  thesis: "I build and evolve software for complex business operations.",
  tagline:
    "Software engineer focused on reliable systems, enterprise integrations, business workflows, and end-to-end product delivery.",
  location: "Cairo, Egypt",
  metaDescription:
    "Youssef Bushra Fouad — backend-focused full-stack software engineer building and evolving production business systems: financial integration with Microsoft Dynamics 365, CRM and business workflows, asynchronous processing, and the user-facing applications on top.",
  /* Recruiter view. The environment (a platform others architected) is kept
     apart from the work that is his. */
  summary: [
    "I build and evolve software for production business applications, working across business-domain services, enterprise integrations, and the user-facing applications on top of them.",
    "Much of my work happens where systems meet: message-driven workflows between services, integration with an external financial platform, data that has to stay consistent across asynchronous operations, and failures that must not leave a business process half-done.",
    "I also build frontend features and see work through to production. I care about clear service boundaries, reliable business workflows, maintainable code, and how engineering decisions affect the wider product — and I support junior engineers through onboarding, task planning and code review.",
  ],
  engineer: {
    thesis: "Backend systems that stay correct when things fail.",
    tagline:
      "Backend-focused full-stack engineer working on a production multi-tenant logistics platform. My work sits where correctness is hard: financial integration with an external ERP, duplicate-safe message processing, and workflows that span independently deployed services.",
    summary: [
      "Most of what I work on lives between services. The platform is split into domain-oriented services that are deployed independently, own their data and communicate through a message broker — so the hard problems are rarely inside one service. They are in the contracts between services, in messages that arrive twice, and in workflows that have to finish correctly when one participant doesn't.",
      "The architecture itself — its tenancy model, API gateway, authorization and shared messaging libraries — was established by others. My work is the business-domain services, integrations and interfaces built within it: consumers that tolerate at-least-once delivery, domain operations with explicit transactional boundaries, and long-running work moved out of the request path. I build the React and Next.js side too, but approach systems backend-first: where the consistency boundary is, what happens on retry, and whether the next engineer can still follow the flow. It is also what I look for when reviewing junior engineers' pull requests.",
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
  availability: "Open to software engineering and technical leadership roles",
};

export const navNodes: NavNode[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
