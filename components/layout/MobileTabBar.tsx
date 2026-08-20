"use client";

import { motion } from "framer-motion";
import { navNodes } from "@/content/profile";
import { scrollToId } from "@/lib/scroll";

/**
 * The section navigation on phones: a fixed glass tab bar in the thumb zone.
 * It is always on screen, so you never scroll back up to move — and there is
 * no dropdown to mis-fire, which keeps in-page navigation reliable on touch.
 * It stays navigation-only (no action buttons); the desktop nav pill (in
 * <Nav/>) carries the same sections above md.
 */

const ICONS: Record<string, React.ReactNode> = {
  about: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
    </>
  ),
  skills: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
};

export function MobileTabBar({ active }: { active: string }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1 md:hidden"
    >
      <ul className="glass mx-auto flex max-w-sm items-stretch justify-between gap-1 rounded-2xl p-1.5 shadow-lg">
        {navNodes.map((n) => {
          const isActive = active === n.id;
          return (
            <li key={n.id} className="flex-1">
              <button
                type="button"
                onClick={() => scrollToId(n.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={n.label}
                className={`focus-ring relative flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors duration-150 ${
                  isActive ? "text-accent-text" : "text-muted"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="tab-active"
                    className="absolute inset-0 -z-10 rounded-xl border border-white/40 bg-accent/18 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.28),rgb(255_255_255/0.02)_60%)] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.55),inset_0_-2px_5px_-2px_rgb(0_0_0/0.15),0_3px_10px_-4px_rgb(var(--accent)/0.45)] backdrop-blur-[2px]"
                    transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.7 }}
                  />
                ) : null}
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICONS[n.id]}
                </svg>
                <span className="text-[10.5px] font-medium leading-none tracking-tight">
                  {n.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
