"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navNodes, profile } from "@/content/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CVButton } from "@/components/ui/CVButton";
import { OPEN_PALETTE_EVENT } from "@/components/system/CommandPalette";

export function Nav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Motion value event instead of a scroll listener: state changes only when
  // the threshold is crossed, not on every frame.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 16;
    setScrolled((cur) => (cur === next ? cur : next));
  });

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
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-6 md:px-10">
        <a
          href="#hero"
          className="focus-ring flex shrink-0 items-center gap-3 rounded"
          aria-label={`${profile.name}, back to top`}
        >
          <span className="h-1 w-6 bg-accent" aria-hidden="true" />
          <span className="font-display text-[15px] font-bold tracking-tight text-text">
            Youssef Bushra
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navNodes.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`focus-ring relative block rounded px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {n.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 bottom-1 h-[2px] bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <CVButton from="nav" variant="compact" className="hidden lg:inline-flex" />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            aria-label="Open command menu"
            className="focus-ring hidden h-9 items-center gap-1 rounded border border-line bg-surface px-2.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent hover:text-text sm:inline-flex"
          >
            ⌘K
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded border border-line bg-surface text-muted md:hidden"
          >
            <span className="flex flex-col gap-1">
              <span
                className={`h-[1.5px] w-4 bg-current transition-transform duration-200 ${
                  open ? "translate-y-[5.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-4 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-4 bg-current transition-transform duration-200 ${
                  open ? "-translate-y-[5.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
          >
            <ul>
              {navNodes.map((n) => (
                <li key={n.id} className="border-b border-line/70">
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-6 py-4 text-sm text-muted"
                  >
                    <span
                      className={`h-[2px] w-4 transition-colors ${
                        active === n.id ? "bg-accent" : "bg-line"
                      }`}
                      aria-hidden="true"
                    />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4">
              <CVButton from="mobile-menu" variant="compact" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
