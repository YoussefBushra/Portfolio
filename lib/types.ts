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
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Fact {
  value: string;
  label: string;
  hint: string;
}

export interface Profile {
  name: string;
  role: string;
  /** The one-line claim the hero leads with. */
  thesis: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  metaDescription: string;
  /** Short status line, e.g. what kind of work is being sought. */
  availability: string;
  summary: string[];
  socials: SocialLink[];
  facts: Fact[];
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  /** Human-readable period, e.g. "Aug 2024 - Present". */
  period: string;
  /** ISO year-month the span starts, e.g. "2024-08". Drives the trace chart. */
  start: string;
  /** ISO year-month the span ends. Omitted while the role is current. */
  end?: string;
  current?: boolean;
  summary: string;
  stack: string[];
  metrics?: { label: string; value: string }[];
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
  items: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  detail: string;
  period: string;
  start: string;
  end: string;
}
