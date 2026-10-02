"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navNodes } from "@/content/profile";
import { currentView } from "@/lib/view";

interface Notice {
  view: string;
  names: string;
  target: string;
  dir: "up" | "down";
}

const listed = (xs: string[]) =>
  xs.length < 2
    ? xs.join("")
    : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`;

/** Sections whose content differs between the two views. */
function changedSections() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("section[id]"),
  ).filter((s) => s.querySelector(".layer, [data-reflow]"));
}

function inView(el: HTMLElement) {
  const top =
    document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
  const r = el.getBoundingClientRect();
  return r.bottom > top + 40 && r.top < window.innerHeight - 40;
}

/**
 * After a view switch, if none of the sections that changed is on screen (on
 * a phone that is the usual case), say what changed and offer to go there —
 * otherwise the switch can look like it did nothing. Hides itself after a few
 * seconds, or once a changed section scrolls into view.
 */
export function ChangeNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    const onSettled = () => {
      const changed = changedSections();
      if (!changed.length || changed.some(inView)) return setNotice(null);
      const mid = window.innerHeight / 2;
      // distance to the section's nearest edge: + below, − above
      const nearest = changed
        .map((s) => {
          const r = s.getBoundingClientRect();
          return { s, d: r.top > mid ? r.top - mid : r.bottom - mid };
        })
        .sort((a, b) => Math.abs(a.d) - Math.abs(b.d))[0];
      setNotice({
        view: currentView() === "engineer" ? "Developer" : "Recruiter",
        names: listed(
          changed.map(
            (s) => navNodes.find((n) => n.id === s.id)?.label ?? s.id,
          ),
        ),
        target: nearest.s.id,
        dir: nearest.d > 0 ? "down" : "up",
      });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setNotice(null), 6500);
    };
    const onScroll = () => {
      if (changedSections().some(inView)) setNotice(null);
    };
    const onSwitch = () => setNotice(null);
    window.addEventListener("view:settled", onSettled);
    window.addEventListener("view:busy", onSwitch);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("view:settled", onSettled);
      window.removeEventListener("view:busy", onSwitch);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer.current);
    };
  }, []);

  const go = () => {
    if (!notice) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById(notice.target)
      ?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    setNotice(null);
  };

  return (
    <div className="change-notice" role="status" aria-live="polite">
      <AnimatePresence>
        {notice ? (
          <motion.div
            key={notice.view + notice.names}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="change-chip"
          >
            <span className="min-w-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-text">
                {notice.view} view
              </span>
              <span className="mx-2 text-faint" aria-hidden>
                ·
              </span>
              <span className="text-text">{notice.names} changed</span>
            </span>
            <button
              type="button"
              onClick={go}
              className="focus-ring shrink-0 rounded-sm border border-line px-2.5 py-1 text-[12.5px] font-medium text-text hover:border-faint"
            >
              Show {notice.dir === "down" ? "↓" : "↑"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
