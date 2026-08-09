export type SectionId =
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

export interface NavNode {
  id: Exclude<SectionId, "hero">;
  label: string;
  /** Short service-style name shown in the node map. */
  service: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  metaDescription: string;
  summary: string[];
  socials: SocialLink[];
  /** Headline metrics for the "system status" hero. */
  stats: { label: string; value: string; hint: string }[];
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  /** "Dependencies" chips. */
  stack: string[];
  highlights: string[];
}

export interface Project {
  name: string;
  kind: string;
  year: string;
  featured: boolean;
  blurb: string;
  metrics?: { label: string; value: string }[];
  tech: string[];
  links?: { label: string; href: string }[];
}

export interface SkillGroup {
  name: string;
  /** node-map style label */
  service: string;
  items: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  detail: string;
  period: string;
}

export interface Credential {
  title: string;
  issuer: string;
  period: string;
  kind: "certification" | "award" | "internship" | "volunteer";
}
