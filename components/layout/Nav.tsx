"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navNodes, profile } from "@/content/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DesignSettings } from "@/components/system/DesignSettings";
import { CVButton } from "@/components/ui/CVButton";
import { OPEN_PALETTE_EVENT } from "@/components/system/CommandPalette";
import { scrollToId } from "@/lib/scroll";
import { OVERLAY_OPEN_EVENT, announceOverlay } from "@/lib/overlays";

export function Nav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 12;
    setScrolled((cur) => (cur === next ? cur : next));
  });

  // Only one overlay open at a time: close the menu if another panel opens.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== "menu") setOpen(false);
    };
    window.addEventListener(OVERLAY_OPEN_EVENT, onOther);
    return () => window.removeEventListener(OVERLAY_OPEN_EVENT, onOther);
  }, []);

  const toggleMenu = () =>
    setOpen((v) => {
      if (!v) announceOverlay("menu");
      return !v;
    });

  // Close the menu, then scroll to the target ourselves so navigation is
  // reliable even as the menu unmounts (the plain anchor jump can be dropped
  // mid-exit-animation on mobile).
  const goTo = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  };

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
                  className={`focus-ring relative block rounded-full px-3 py-1.5 text-[13px] transition-colors duration-150 ${
                    isActive ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  <AnimatePresence>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        className="absolute inset-0 -z-10 rounded-full border border-accent/50 bg-accent/20 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25)]"
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
            className="focus-ring hidden h-8 items-center rounded-full border border-white/25 bg-white/10 px-2.5 font-mono text-[11px] text-muted backdrop-blur-sm transition-colors duration-150 hover:border-accent hover:text-text sm:inline-flex"
          >
            ⌘K
          </button>
          <DesignSettings />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={toggleMenu}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-muted backdrop-blur-sm md:hidden"
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
            className="glass mx-1 mt-2 overflow-hidden rounded-xl md:hidden"
          >
            <ul>
              {navNodes.map((n) => (
                <li key={n.id} className="border-b border-white/10 last:border-b-0">
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(n.id);
                    }}
                    className="flex items-center gap-3 px-6 py-3.5 text-[15px] text-muted"
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
