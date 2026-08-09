"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A slow, drifting aurora of blurred color blobs. Sits behind the node graph
 * to add depth and movement. Animates transforms only (no layout), and stays
 * static under reduced motion.
 */
export function Aurora({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const blobs = [
    { color: "rgb(var(--accent) / 0.22)", size: 620, left: "-8%", top: "-12%", dx: 60, dy: 50, dur: 18 },
    { color: "rgb(var(--accent-2) / 0.18)", size: 560, left: "62%", top: "-8%", dx: -70, dy: 60, dur: 22 },
    { color: "rgb(var(--accent) / 0.16)", size: 520, left: "28%", top: "55%", dx: 50, dy: -50, dur: 26 },
  ];

  return (
    <div className={`pointer-events-none overflow-hidden ${className ?? ""}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={
            reduce ? undefined : { x: [0, b.dx, 0], y: [0, b.dy, 0] }
          }
          transition={
            reduce
              ? undefined
              : { duration: b.dur, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: "9999px",
            background: b.color,
            filter: "blur(90px)",
          }}
        />
      ))}
    </div>
  );
}
