"use client";

import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";

/** Compact list of external profiles, one per row. */
export function SocialLinks({ from }: { from: string }) {
  return (
    <ul className="space-y-1">
      {profile.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
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
