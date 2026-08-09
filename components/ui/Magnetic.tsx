"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  /** Pull strength (0–1). */
  strength?: number;
  className?: string;
}

/**
 * Wraps content so it drifts toward the cursor while hovered, then springs
 * back on leave. Disabled under reduced motion and on touch (no hover).
 */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
