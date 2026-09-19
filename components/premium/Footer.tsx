"use client";

import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-border/70 px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* large typographic statement */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mono-label mb-5">let&apos;s work together</div>
            <h2 className="text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-text sm:text-4xl lg:text-5xl">
              Building the <span className="text-accent">reliable</span> systems
              your product runs on.
            </h2>
            <a
              href="#contact"
              onClick={() =>
                track("cta_click", { from: "footer", cta: "start_conversation" })
              }
              className="btn-primary mt-8"
            >
              Start a conversation
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mono-label mb-4">navigate</div>
              <ul className="space-y-2.5">
                {LINKS.map((l) => (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      className="focus-ring rounded text-sm text-muted transition-colors hover:text-accent"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mono-label mb-4">connect</div>
              <ul className="space-y-2.5">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      onClick={() =>
                        track("social_click", { label: s.label, from: "footer" })
                      }
                      className="focus-ring rounded text-sm text-muted transition-colors hover:text-accent"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="hairline my-10" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface font-mono text-[11px] font-semibold text-accent">
              YB
            </span>
            <span className="text-sm text-muted">
              © {year} {profile.name}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            Built with Next.js · Deployed on Vercel
          </div>
        </div>
      </div>
    </footer>
  );
}
