"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navNodes, profile } from "@/content/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DesignSettings } from "@/components/system/DesignSettings";
import { CVButton } from "@/components/ui/CVButton";
import { OPEN_PALETTE_EVENT } from "@/components/system/CommandPalette";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

export function Nav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
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
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 px-4 pt-3 transition-all duration-300 md:pt-4 ${
        scrolled ? "pt-2 md:pt-2.5" : ""
      }`}
    >
      <nav
        className={`glass mx-auto flex h-14 max-w-[calc(theme(maxWidth.page)-1rem)] items-center justify-between gap-6 rounded-full px-4 pl-5 transition-all duration-300 md:px-5 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <a
          href="#hero"
          className="focus-ring flex shrink-0 items-center gap-2.5 rounded-full"
          aria-label={`${profile.name}, back to top`}
        >
          <span
            className="h-4 w-4 rounded-md bg-gradient-to-br from-accent to-accent/60 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.6)]"
            aria-hidden="true"
          />
          <span className="font-display text-sm font-bold tracking-tight text-text">
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
                  className={`focus-ring relative block rounded-full px-3 py-1.5 text-[13px] transition-all duration-150 ${
                    isActive
                      ? "text-text"
                      : "text-muted hover:bg-[rgb(255_255_255/0.08)] hover:text-text hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.3)]"
                  }`}
                >
                  <AnimatePresence>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        className="absolute inset-0 -z-10 rounded-full border border-white/45 bg-accent/20 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.32),rgb(255_255_255/0.03)_58%)] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.7),inset_0_-3px_6px_-2px_rgb(0_0_0/0.15),0_4px_14px_-5px_rgb(var(--accent)/0.5)] backdrop-blur-[2px]"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 24,
                          mass: 0.7,
                        }}
                      />
                    ) : null}
                  </AnimatePresence>
                  {n.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5">
          <CVButton from="nav" variant="compact" className="hidden lg:inline-flex" />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            aria-label="Open command menu"
            className="focus-ring glass-control hidden h-8 items-center rounded-full px-2.5 font-mono text-[11px] text-muted transition-colors duration-150 hover:border-accent hover:text-text sm:inline-flex"
          >
            ⌘K
          </button>
          <DesignSettings />
          <ThemeToggle />
        </div>
      </nav>
    </header>

    {/* Section navigation on phones lives in a fixed bottom tab bar. */}
    <MobileTabBar active={active} />
    </>
  );
}
