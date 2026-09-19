"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* brand */}
        <a
          href="#top"
          className="focus-ring group flex items-center gap-2.5 rounded-lg"
          aria-label="Back to top"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface font-mono text-[13px] font-semibold text-accent transition-colors group-hover:border-accent/50">
            {initials}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-text sm:block">
            {profile.name.split(" ").slice(0, 2).join(" ")}
          </span>
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`focus-ring relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active === link.id
                  ? "text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {link.label}
              {active === link.id ? (
                <span className="absolute inset-x-3 -bottom-px h-px bg-accent" />
              ) : null}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <CVButton from="nav" variant="compact" />
          <a
            href="#contact"
            onClick={() => track("cta_click", { from: "nav", cta: "get_in_touch" })}
            className="btn-primary !px-4 !py-2 !text-[13px]"
          >
            Get in touch
          </a>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface md:hidden"
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-text transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-text transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-5 bg-text transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* mobile panel */}
      <div
        id="mobile-menu"
        className={`md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`fixed inset-0 top-16 z-40 origin-top bg-bg/95 backdrop-blur-xl transition-all duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 px-5 pt-6">
            {LINKS.map((link, i) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                className={`focus-ring flex items-center justify-between rounded-xl border border-border/60 bg-surface px-4 py-4 text-lg font-semibold transition-all duration-300 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } ${active === link.id ? "text-accent" : "text-text"}`}
              >
                {link.label}
                <span className="font-mono text-xs text-faint">
                  0{i + 1}
                </span>
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Get in touch
              </a>
              <CVButton from="nav-mobile" variant="ghost" className="w-full justify-center" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
