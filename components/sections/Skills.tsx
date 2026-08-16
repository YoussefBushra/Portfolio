"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { stackGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * The stack as a capability index rather than a wall of chips or logos: a mono
 * eyebrow per group with its tools set in the display face, so typography does
 * the work. Each group's items reveal in a short stagger as they scroll in,
 * and lift to the accent on hover — one quiet, deliberate motion, skipped
 * entirely under reduced motion.
 */
const list: Variants = {
  show: { transition: { staggerChildren: 0.035 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="skills" label="Stack">
      <div className="glass-strong rounded-xl p-6 sm:p-8 md:p-10">
        <div className="divide-y divide-line">
          {stackGroups.map((group) => (
            <div
              key={group.name}
              className="grid gap-x-8 gap-y-3 py-6 first:pt-0 last:pb-0 md:grid-cols-[190px_minmax(0,1fr)] md:items-center"
            >
              <h3 className="flex items-center gap-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-text">
                <span aria-hidden="true" className="h-3.5 w-[3px] rounded-full bg-accent" />
                {group.name}
              </h3>
              <motion.ul
                className="flex flex-wrap gap-x-6 gap-y-2.5"
                variants={reduce ? undefined : list}
                initial={reduce ? undefined : "hidden"}
                whileInView={reduce ? undefined : "show"}
                viewport={{ once: true, margin: "-60px" }}
              >
                {group.items.map((name) => (
                  <motion.li key={name} variants={reduce ? undefined : item}>
                    <span className="cursor-default font-display text-[17px] font-medium tracking-tight text-text transition-colors duration-200 hover:text-accent-text">
                      {name}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>

        <p className="mt-7 border-t border-line pt-5 font-mono text-[12px] text-muted">
          Spoken languages: {spokenLanguages}.
        </p>
      </div>
    </SectionShell>
  );
}
