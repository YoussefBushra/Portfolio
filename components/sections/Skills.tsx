"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp } from "@/lib/motion";

export function Skills() {
  return (
    <SectionShell id="skills">
      <SectionHeading
        index="04"
        
        title="Skills"
        description="Technologies I work with, grouped by area."
      />

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillGroups.map((group) => (
          <motion.div
            key={group.name}
            variants={fadeUp}
            className="card group p-5 transition-colors hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text">{group.name}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-border bg-surface-2/50 px-2.5 py-1 font-mono text-xs text-muted transition-colors group-hover:border-accent/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-8 text-center font-mono text-xs text-faint">
        Languages — Arabic (native), English (C1), German (A1).
      </p>
    </SectionShell>
  );
}
