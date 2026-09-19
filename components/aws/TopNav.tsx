"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { CvButton } from "@/components/aws/CvButton";

const LINKS = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

/** AWS-style cube mark in brand orange. */
function CubeMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 5l9 5v12l-9 5-9-5V10z"
        fill="none"
        stroke="rgb(var(--orange))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l9 5 9-5M16 15v12"
        fill="none"
        stroke="rgb(var(--orange))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopNav() {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const shortName = profile.name.split(" ").slice(0, 2).join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-ink-2 bg-ink text-white">
      <nav className="mx-auto flex h-12 w-full max-w-[1240px] items-center gap-3 px-3 sm:px-4">
        {/* brand / service identity */}
        <a
          href="#overview"
          className="focus-ring flex items-center gap-2.5 rounded"
          aria-label="Overview"
        >
          <CubeMark />
          <span className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold tracking-tight text-white">
              {shortName}
            </span>
            <span className="hidden text-[12px] font-normal text-white/55 sm:inline">
              {profile.role}
            </span>
          </span>
        </a>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`focus-ring rounded px-2.5 py-1.5 text-[13px] transition-colors ${
                active === l.id
                  ? "text-white"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {l.label}
              {active === l.id ? (
                <span className="mt-1 block h-0.5 rounded-full bg-orange" />
              ) : (
                <span className="mt-1 block h-0.5" />
              )}
            </a>
          ))}
          <span className="mx-1 h-5 w-px bg-white/15" />
          <CvButton from="topnav" variant="ghost" />
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="cs-mobile"
          aria-label={open ? "Close menu" : "Open menu"}
          className="focus-ring ml-auto flex h-9 w-9 items-center justify-center rounded border border-white/20 md:hidden"
        >
          <div className="relative h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-4 bg-white transition-all ${open ? "top-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-4 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-4 bg-white transition-all ${open ? "top-1.5 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {/* mobile panel */}
      {open ? (
        <div id="cs-mobile" className="border-t border-ink-2 bg-ink md:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col px-3 py-2">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`rounded px-2 py-2.5 text-[14px] ${
                  active === l.id
                    ? "font-semibold text-orange"
                    : "text-white/80"
                }`}
              >
                {l.label}
              </a>
            ))}
            <div className="py-2">
              <CvButton
                from="topnav-mobile"
                variant="primary"
                className="w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
