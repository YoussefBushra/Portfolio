"use client";

import { useEffect, useState } from "react";
import { navNodes, profile } from "@/content/profile";
import { Portrait } from "@/components/ui/Portrait";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CVButton } from "@/components/ui/CVButton";
import { OPEN_PALETTE_EVENT } from "@/components/system/CommandPalette";
import { track } from "@/lib/analytics";

const SECTION_IDS = navNodes.map((n) => n.id);

export function Sidebar() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="border-b border-border bg-surface/40 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-8 lg:h-full lg:max-w-none lg:px-8 lg:py-10">
        <div className="flex items-center gap-5 lg:flex-col lg:items-start lg:gap-5">
          <Portrait className="w-24 shrink-0 lg:w-40" />
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-text lg:mt-2 lg:text-3xl">
              Youssef Bushra
              <span className="block">Fouad</span>
            </h1>
            <p className="mt-1.5 text-sm font-medium text-accent">
              Backend &amp; Full-Stack Engineer
            </p>
          </div>
        </div>

        <p className="max-w-xs text-sm leading-relaxed text-muted">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            Available
          </span>
          <span className="text-faint">·</span>
          <span>{profile.location}</span>
        </div>

        {/* section nav */}
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="space-y-0.5">
            {navNodes.map((n) => {
              const isActive = active === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`focus-ring group flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    <span
                      className={`h-px transition-all ${
                        isActive
                          ? "w-8 bg-accent"
                          : "w-4 bg-border group-hover:w-6 group-hover:bg-faint"
                      }`}
                    />
                    {n.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* contact links */}
        <div className="flex flex-wrap gap-2">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              onClick={() => track("social_click", { label: s.label, from: "sidebar" })}
              className="focus-ring rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* actions */}
        <div className="flex flex-wrap items-center gap-2 lg:mt-auto lg:pt-4">
          <CVButton from="sidebar" variant="compact" />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            aria-label="Open command palette"
            className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            <span className="text-accent">⌘</span>K
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
