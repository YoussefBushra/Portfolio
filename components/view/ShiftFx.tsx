"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useView, type Shift } from "@/components/view/ViewProvider";

/**
 * The two shift animations, one per direction, played only when the reader
 * toggles (never on load or on a deep link):
 *
 * → engineer: "system scan" — a teal scan line sweeps the viewport, like a
 *   debugger attaching. The blueprint grid fades in behind it (CSS).
 * → recruiter: "soft focus" — a warm amber bloom spreads from the switch and
 *   dissolves, masking the accent swap back to amber.
 *
 * Keyed on the shift counter, so a rapid double toggle replaces the running
 * effect instead of stacking overlays.
 */
export function ShiftFx() {
  const { lastShift } = useView();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Shift | null>(null);

  useEffect(() => {
    // Browsers with the View Transitions API draw the shift natively
    // (globals.css); these overlays are the fallback for the rest.
    if (lastShift && !reduce && !lastShift.cinematic) setActive(lastShift);
  }, [lastShift, reduce]);

  const done = () => setActive(null);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {active?.to === "engineer" ? (
          <motion.div
            key={active.n}
            className="absolute inset-x-0 top-0 h-[120px]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgb(var(--accent) / 0.10))",
              borderBottom: "1px solid rgb(var(--accent) / 0.9)",
              boxShadow: "0 1px 14px rgb(var(--accent) / 0.55)",
            }}
            initial={{ y: -120, opacity: 1 }}
            animate={{ y: "100vh" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={done}
          />
        ) : null}

        {active?.to === "recruiter" ? (
          <Bloom key={active.n} shift={active} onDone={done} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Bloom({ shift, onDone }: { shift: Shift; onDone: () => void }) {
  // Radius that reaches the farthest viewport corner from the origin.
  const r = Math.hypot(
    Math.max(shift.originX, window.innerWidth - shift.originX),
    Math.max(shift.originY, window.innerHeight - shift.originY)
  );

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: shift.originX - r,
        top: shift.originY - r,
        width: r * 2,
        height: r * 2,
        background:
          "radial-gradient(circle, rgb(245 165 36 / 0.30) 0%, rgb(245 165 36 / 0.12) 45%, transparent 70%)",
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.45, ease: "easeIn" },
      }}
      onAnimationComplete={onDone}
    />
  );
}
