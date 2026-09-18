"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navNodes, profile } from "@/content/profile";
import { Portrait } from "@/components/ui/Portrait";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CVButton } from "@/components/ui/CVButton";
import { OPEN_PALETTE_EVENT } from "@/components/system/CommandPalette";
import { track } from "@/lib/analytics";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

const TABS = navNodes; // about, experience, projects, skills, contact

const PANELS: Record<string, () => JSX.Element> = {
  about: About,
  experience: Experience,
  projects: Projects,
  skills: Skills,
  contact: Contact,
};

export function ProfileApp() {
  const [active, setActive] = useState<string>(TABS[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // sync with hash so the command palette / deep links can switch tabs
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id && PANELS[id]) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const select = (id: string) => {
    setActive(id);
    track("section_view", { section: id, via: "tab" });
    if (window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    const id = TABS[next].id;
    select(id);
    tabRefs.current[id]?.focus();
  };

  const Panel = PANELS[active];

  return (
    <main className="min-h-[100svh] px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface/60 shadow-node backdrop-blur-sm">
        {/* header */}
        <header className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center sm:p-8">
          <Portrait className="w-20 shrink-0 sm:w-24" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Youssef Bushra Fouad
            </h1>
            <p className="mt-1 text-sm font-medium text-accent">
              Backend &amp; Full-Stack Engineer
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
              <span className="inline-flex items-center gap-1.5 text-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                Available
              </span>
              <span className="text-faint">·</span>
              <span>{profile.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                onClick={() => track("social_click", { label: s.label, from: "header" })}
                className="focus-ring rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                {s.label}
              </a>
            ))}
            <CVButton from="header" variant="compact" />
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
        </header>

        {/* tabs */}
        <div
          role="tablist"
          aria-label="Sections"
          onKeyDown={onKeyDown}
          className="flex gap-1 overflow-x-auto border-b border-border px-3 sm:px-5"
        >
          {TABS.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(t.id)}
                className={`focus-ring relative whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors ${
                  isActive ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {t.label}
                {isActive ? (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* panel */}
        <div className="px-6 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              id={`panel-${active}`}
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="min-h-[55vh] focus:outline-none"
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
