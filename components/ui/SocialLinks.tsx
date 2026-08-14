"use client";

import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";

/** Compact list of external profiles, one per row. */
export function SocialLinks({
  from,
  exclude = [],
}: {
  from: string;
  /** Labels to leave out, e.g. where email already has its own block. */
  exclude?: string[];
}) {
  const links = profile.socials.filter((s) => !exclude.includes(s.label));

  return (
    <ul className="space-y-1">
      {links.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer noopener"
            onClick={() => track("social_click", { label: s.label, from })}
            className="focus-ring group inline-flex items-baseline gap-2 rounded-sm text-sm"
          >
            <span className="text-accent-text underline decoration-accent/40 decoration-1 underline-offset-[3px] transition-colors group-hover:decoration-accent">
              {s.label}
            </span>
            <span className="truncate font-mono text-[11px] text-faint">
              {s.handle}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
