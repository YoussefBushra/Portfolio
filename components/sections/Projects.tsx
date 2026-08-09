"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import type { Project } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { fadeUp } from "@/lib/motion";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-node">
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
          <span
            key={t}
            className="rounded-md border border-border bg-surface-2/50 px-2 py-0.5 font-mono text-[11px] text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      {project.links && project.links.length > 0 ? (
        <div className="mt-5 flex gap-4 border-t border-border/60 pt-4">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex items-center gap-1 rounded font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const [showAll, setShowAll] = useState(false);

  return (
    <SectionShell id="projects">
      <SectionHeading
        index="03"
        service="svc/projects"
        title="Repositories & systems"
        description="A curated set of things I've designed and built — from graduation research to production integrations."
      />

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
    </SectionShell>
  );
}
