"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@/lib/analytics";

const BOOT_KEY = "yb.booted";

const SERVICES = [
  "svc/core",
  "svc/about",
  "svc/experience",
  "svc/projects",
  "svc/skills",
  "svc/contact",
];

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(BOOT_KEY) === "1";
    } catch {
      seen = false;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) return;

    setShow(true);
    document.body.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    SERVICES.forEach((_, i) => {
      timers.push(setTimeout(() => setDone(i + 1), 220 * (i + 1)));
    });
    timers.push(
      setTimeout(() => finish(), 220 * SERVICES.length + 650)
    );

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = (skipped = false) => {
    try {
      localStorage.setItem(BOOT_KEY, "1");
    } catch {
      // ignore
    }
    if (skipped) track("boot_skipped", { at: done });
    document.body.style.overflow = "";
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-bg px-6"
          role="status"
          aria-label="Initializing"
        >
          <div className="bp-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative w-full max-w-sm font-mono text-sm">
            <div className="mb-5 flex items-center gap-2 text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-blink" />
              youssef.systems — booting
            </div>
            <ul className="space-y-1.5">
              {SERVICES.map((svc, i) => {
                const ok = i < done;
                return (
                  <li
                    key={svc}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className={ok ? "text-muted" : "text-faint"}>
                      {svc}
                    </span>
                    <span className={ok ? "text-ok" : "text-faint"}>
                      {ok ? "● online" : "○ …"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 h-px w-full overflow-hidden bg-border">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${(done / SERVICES.length) * 100}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>

            <button
              type="button"
              onClick={() => finish(true)}
              className="focus-ring mt-6 font-mono text-[11px] text-faint underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              skip intro →
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
