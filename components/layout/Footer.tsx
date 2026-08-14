"use client";

import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <div>
          <p className="text-sm text-text">
            {profile.name}, {profile.location}
          </p>
          <p className="mt-1 text-xs text-faint">
            © {year}. Built with Next.js and TypeScript.
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              onClick={() => track("social_click", { label: s.label, from: "footer" })}
              className="focus-ring rounded text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
