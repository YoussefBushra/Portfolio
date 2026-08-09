"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navNodes } from "@/content/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Nav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", ...navNodes.map((n) => n.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a
          href="#hero"
          className="focus-ring group flex items-center gap-2.5 rounded-md"
          aria-label="Home"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-sm font-bold text-accent">
            YB
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ok animate-blink" />
          </span>
          <span className="hidden font-mono text-xs text-muted sm:inline">
            youssef<span className="text-faint">.systems</span>
          </span>
        </a>

        {/* desktop node links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navNodes.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={`focus-ring group relative flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-accent shadow-glow-sm"
                        : "bg-border group-hover:bg-accent-2"
                    }`}
                  />
                  {n.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-accent/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/70 text-muted md:hidden"
          >
            <div className="flex flex-col gap-1">
              <span
                className={`h-0.5 w-4 bg-current transition-transform ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-4 bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-4 bg-current transition-transform ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-bg/95 backdrop-blur-md md:hidden"
          >
            {navNodes.map((n) => (
              <li key={n.id} className="border-b border-border/60 last:border-0">
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-6 py-4 font-mono text-sm text-muted"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        active === n.id ? "bg-accent" : "bg-border"
                      }`}
                    />
                    {n.label}
                  </span>
                  <span className="text-xs text-faint">{n.service}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
