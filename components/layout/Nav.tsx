"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navNodes, profile } from "@/content/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CVButton } from "@/components/ui/CVButton";

export function Nav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 12;
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
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        // Solid, not translucent: on a text-dense page, content passing
        // behind a see-through bar reads as an overlap bug.
        scrolled ? "border-b border-line bg-bg" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-page items-center justify-between gap-6 px-6 md:px-10">
        <a
          href="#hero"
          className="focus-ring flex shrink-0 items-center gap-2.5 rounded-sm"
          aria-label={`${profile.name}, back to top`}
        >
          {/* Same stacked-bars mark as the favicon; the square adapts to the
              theme (dark on light, light on dark) while the bars stay amber. */}
          <svg
            viewBox="0 0 32 32"
            className="h-[26px] w-[26px] shrink-0"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="7" className="fill-text" />
            <rect x="6" y="10" width="20" height="4" rx="1.5" className="fill-accent" />
            <rect
              x="6"
              y="18"
              width="12"
              height="4"
              rx="1.5"
              className="fill-accent"
              opacity="0.5"
            />
          </svg>
          <span className="text-sm font-semibold tracking-tight text-text">
            Youssef Bushra
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {navNodes.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`focus-ring relative block rounded-sm px-2.5 py-1.5 text-[13px] transition-colors duration-150 ${
                    isActive ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {n.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2.5 -bottom-px h-[2px] bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5">
          <CVButton from="nav" variant="compact" className="hidden lg:inline-flex" />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-bg text-muted md:hidden"
          >
            <span className="flex flex-col gap-[3px]">
              <span
                className={`h-[1.5px] w-3.5 bg-current transition-transform duration-150 ${
                  open ? "translate-y-[4.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-3.5 bg-current transition-opacity duration-150 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-3.5 bg-current transition-transform duration-150 ${
                  open ? "-translate-y-[4.5px] -rotate-45" : ""
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
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-bg md:hidden"
          >
            <ul>
              {navNodes.map((n) => (
                <li key={n.id} className="border-b border-line/70">
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-sm text-muted"
                  >
                    <span
                      className={`h-[2px] w-3.5 transition-colors ${
                        active === n.id ? "bg-accent" : "bg-line"
                      }`}
                      aria-hidden="true"
                    />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="px-6 py-3">
              <CVButton from="mobile-menu" variant="compact" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
