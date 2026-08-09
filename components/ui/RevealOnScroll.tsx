"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  /** Amount of the element visible before triggering (0-1). */
  amount?: number;
  as?: "div" | "section" | "li" | "ul";
}

export function RevealOnScroll({
  children,
  className,
  variants = fadeUp,
  amount = 0.2,
  as = "div",
}: RevealOnScrollProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}
