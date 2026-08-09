"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * A card wrapper with three cursor-driven effects: a soft spotlight that
 * follows the pointer, a gradient border that lights up under it, and a subtle
 * 3D tilt. Tilt is disabled under reduced motion; the spotlight/border still
 * track the pointer harmlessly.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (!reduce) {
      ry.set((px - 0.5) * 8);
      rx.set(-(py - 0.5) * 8);
    }
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={`group relative h-full [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}

      {/* spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgb(var(--accent) / 0.14), transparent 60%)",
        }}
      />

      {/* gradient border that tracks the pointer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: "1px",
          background:
            "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgb(var(--accent) / 0.9), transparent 70%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </motion.div>
  );
}
