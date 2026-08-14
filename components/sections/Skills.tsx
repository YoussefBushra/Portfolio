"use client";

import { motion, useReducedMotion } from "framer-motion";
import { skillGroups, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHead } from "@/components/ui/SectionHead";
import { Tag } from "@/components/ui/Tag";

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="skills">
      <SectionHead title="What I reach for." />

      <motion.dl
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-x-10 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillGroups.map((group) => (
          <motion.div
            key={group.name}
            variants={{
              hidden: reduce ? {} : { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <dt className="border-b border-line pb-2 text-sm font-semibold text-text">
              {group.name}
            </dt>
            <dd className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Tag key={item} label={item} />
              ))}
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <p className="mt-12 text-sm text-muted">
        Spoken languages: {spokenLanguages}.
      </p>
    </SectionShell>
  );
}
