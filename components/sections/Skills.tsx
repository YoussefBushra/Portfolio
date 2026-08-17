"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { stackGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * The stack as a bento of glass cells — one per category, weighted by
 * importance (Core is the feature cell), tools set in the display face rather
 * than as chips or logos. Cells reveal in a short stagger on scroll and lift
 * on hover; both are dropped under reduced motion. Glass sits directly on the
 * aurora so panels never nest.
 */
const grid: Variants = { show: { transition: { staggerChildren: 0.06 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

function Cell({
  label,
  items,
  className,
  featured,
}: {
  label: string;
  items: string[];
  className?: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      variants={cell}
      className={`glass flex flex-col rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5 md:p-6 ${className ?? ""}`}
    >
      <h3 className="flex items-center gap-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-text">
        <span aria-hidden="true" className="h-3.5 w-[3px] rounded-full bg-accent" />
        {label}
      </h3>
      <ul
        className={`mt-5 flex flex-wrap ${
          featured
            ? "flex-1 content-center gap-x-6 gap-y-4"
            : "gap-x-5 gap-y-2.5"
        }`}
      >
        {items.map((name) => (
          <li
            key={name}
            className={`font-display font-medium tracking-tight text-text transition-colors duration-200 hover:text-accent-text ${
              featured ? "text-lg md:text-xl" : "text-[15px]"
            }`}
          >
            {name}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Skills() {
  const reduce = useReducedMotion();
  const byName = (n: string) => stackGroups.find((g) => g.name === n)?.items ?? [];
  const languages = spokenLanguages.replace(/\.$/, "").split(", ");

  return (
    <SectionShell id="skills" label="Stack">
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6"
        variants={reduce ? undefined : grid}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, margin: "-60px" }}
      >
        <Cell
          label="Core"
          items={byName("Core")}
          className="sm:col-span-2 lg:col-span-3 lg:row-span-2"
          featured
        />
        <Cell
          label="Observability & infrastructure"
          items={byName("Observability & infrastructure")}
          className="lg:col-span-3"
        />
        <Cell
          label="APIs & testing"
          items={byName("APIs & testing")}
          className="lg:col-span-3"
        />
        <Cell
          label="Architecture"
          items={byName("Architecture")}
          className="sm:col-span-2 lg:col-span-4"
        />
        <Cell label="Languages" items={languages} className="lg:col-span-2" />
      </motion.div>
    </SectionShell>
  );
}
