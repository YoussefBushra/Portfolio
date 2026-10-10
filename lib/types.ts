export type SectionId =
  | "hero"
  | "work"
  | "about"
  | "experience"
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

export interface Profile {
  name: string;
  role: string;
  /** The one-line claim the hero leads with. */
  thesis: string;
  tagline: string;
  location: string;
  metaDescription: string;
  /** Short status line, e.g. what kind of work is being sought. */
  availability: string;
  summary: string[];
  socials: SocialLink[];
  /** Developer view: the same person, told for engineers. Replaces `thesis`,
   *  `tagline` and `summary` there; everything else is shared. */
  engineer: {
    thesis: string;
    tagline: string;
    summary: string[];
  };
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
  /** Developer view: scope and engineering substance of the same role. */
  engineer: {
    summary: string;
    highlights: string[];
  };
}

export interface SkillGroup {
  name: string;
  items: string[];
  /** "primary" domains render as cards; "secondary" render as a quiet line. */
  emphasis?: "primary" | "secondary";
  /** Optional evidence link: short label + section anchor. */
  evidence?: { label: string; href: string };
}

export interface EducationEntry {
  institution: string;
  degree: string;
  detail: string;
  period: string;
  start: string;
  end: string;
}
