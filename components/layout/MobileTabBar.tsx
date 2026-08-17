"use client";

import { motion } from "framer-motion";
import { navNodes } from "@/content/profile";
import { scrollToId } from "@/lib/scroll";
import { track } from "@/lib/analytics";

/**
 * The phone control centre: a fixed glass panel in the thumb zone holding the
 * two primary actions (moved off the hero) above the section tabs. It is always
 * on screen, so you never scroll up to act or navigate, and there is no
 * dropdown to mis-fire. The desktop nav pill (in <Nav/>) carries the same
 * sections above md.
 */

const CV_PATH = "/portfolio.pdf";
const CV_FILENAME = "Youssef-Bushra-Fouad-CV.pdf";

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
      aria-label="Sections and actions"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1 md:hidden"
    >
      <div className="glass mx-auto max-w-sm rounded-2xl p-1.5 shadow-lg">
        {/* Primary actions. */}
        <div className="flex gap-2 pb-1.5">
          <a
            href={CV_PATH}
            download={CV_FILENAME}
            onClick={() => track("cv_download", { from: "mobile-bar" })}
            className="focus-ring group flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-[13px] font-semibold text-on-accent shadow-[0_6px_16px_-8px_rgb(var(--accent)/0.9),inset_0_1px_0_0_rgb(255_255_255/0.4)] active:translate-y-px"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            >
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            Download CV
          </a>
          <a
            href="#contact"
            onClick={() => {
              track("cta_click", { cta: "contact", from: "mobile-bar" });
              scrollToId("contact");
            }}
            className="focus-ring flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-[13px] font-medium text-text active:translate-y-px"
          >
            Get in touch
          </a>
        </div>

        {/* Section tabs. */}
        <ul className="flex items-stretch justify-between gap-1 border-t border-white/10 pt-1.5">
          {navNodes.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => scrollToId(n.id)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={n.label}
                  className={`focus-ring relative flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors duration-150 ${
                    isActive ? "text-accent-text" : "text-muted"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="tab-active"
                      className="absolute inset-0 -z-10 rounded-xl border border-accent/40 bg-accent/15 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.7 }}
                    />
                  ) : null}
                  <svg
                    width="20"
                    height="20"
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
      </div>
    </nav>
  );
}
