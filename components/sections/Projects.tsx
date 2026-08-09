"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import type { Project } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { TechChip } from "@/components/ui/TechChip";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { useTech } from "@/components/system/TechContext";
import { fadeUp } from "@/lib/motion";

function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard>
      <article className="card relative flex h-full flex-col p-6 transition-colors duration-300 hover:border-accent/50 hover:shadow-node">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-accent-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          {project.kind}
        </div>
        <span className="font-mono text-xs text-faint">{project.year}</span>
      </div>

      <h3 className="mt-3 text-lg font-bold tracking-tight text-text">
        {project.name}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.blurb}
      </p>

      {project.metrics && project.metrics.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-base font-bold text-accent">{m.value}</div>
              <div className="mono-label">{m.label}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <TechChip key={t} label={t} filterable size="sm" />
        ))}
      </div>
      </article>
    </SpotlightCard>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const [showAll, setShowAll] = useState(false);
  const { filter, clearFilter } = useTech();

  const matches = filter
    ? projects.filter((p) =>
        p.tech.some((t) => t.toLowerCase() === filter.toLowerCase())
      )
    : [];

  return (
    <SectionShell id="projects">
      <SectionHeading
        index="03"
        service="svc/projects"
        title="Repositories & systems"
        description="A curated set of things I've designed and built — from graduation research to production integrations. Click any tech to filter."
      />

      {filter ? (
        // ---- filtered view ----
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-muted">
              filtering by
            </span>
            <span className="chip chip-accent">◆ {filter}</span>
            <span className="font-mono text-xs text-faint">
              {matches.length} result{matches.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={clearFilter}
              className="focus-ring rounded font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              clear ✕
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      ) : (
        // ---- default curated view ----
        <>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featured.map((p) => (
              <motion.div key={p.name} variants={fadeUp}>
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence initial={false}>
            {showAll ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <ProjectCard key={p.name} project={p} />
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {rest.length > 0 ? (
            <RevealOnScroll className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="focus-ring group inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
                {showAll
                  ? "collapse archive"
                  : `load ${rest.length} more from the archive`}
                <span
                  className={`transition-transform ${showAll ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>
            </RevealOnScroll>
          ) : null}
        </>
      )}
    </SectionShell>
  );
}
