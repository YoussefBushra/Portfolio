"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "@/content/projects";
import type { Project } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHead } from "@/components/ui/SectionHead";
import { Tag } from "@/components/ui/Tag";
import { useTech } from "@/components/system/TechContext";
import { track } from "@/lib/analytics";

/* Bento placement, one entry per featured project: six items, six cells, and
   no row repeats the previous row's split. */
const CELLS = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

function Card({ project, tinted }: { project: Project; tinted: boolean }) {
  return (
    <article
      className={`flex h-full flex-col rounded border border-line p-6 transition-colors duration-200 hover:border-accent ${
        tinted ? "bg-surface-2" : "bg-surface"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] text-faint">
        <span>{project.kind}</span>
        <span>{project.year}</span>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold leading-tight tracking-tight text-text">
        {project.name}
      </h3>

      <p className="mt-3 max-w-prose flex-1 text-sm leading-relaxed text-muted">
        {project.blurb}
      </p>

      {project.metrics?.length ? (
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-2xl font-bold tracking-tight text-text">
                {m.value}
              </div>
              <div className="mt-1 font-mono text-[11px] text-faint">{m.label}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <Tag key={t} label={t} filterable />
        ))}
      </div>

      {project.links?.length ? (
        <div className="mt-5 flex flex-wrap gap-4">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring link rounded text-sm"
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

/** Compact row used by the archive and by filter results. */
function IndexRow({ project }: { project: Project }) {
  return (
    <li className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-text">{project.name}</span>
        <span className="mt-1 block text-sm text-muted">{project.blurb}</span>
      </span>
      <span className="shrink-0 font-mono text-[11px] text-faint">
        {project.kind}, {project.year}
      </span>
    </li>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const [showAll, setShowAll] = useState(false);
  const { filter, clearFilter } = useTech();
  const reduce = useReducedMotion();

  const matches = filter
    ? projects.filter((p) =>
        p.tech.some((t) => t.toLowerCase() === filter.toLowerCase())
      )
    : [];

  return (
    <SectionShell id="projects">
      <SectionHead
        title="Selected work."
        lead="Research, production systems and side projects. Select any tag to filter the whole list by technology."
      />

      {filter ? (
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted">
              Showing {matches.length} project{matches.length === 1 ? "" : "s"} using
            </span>
            <span className="tag border-accent bg-accent/15 text-accent-text">
              {filter}
            </span>
            <button
              type="button"
              onClick={clearFilter}
              className="focus-ring rounded text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text"
            >
              Clear filter
            </button>
          </div>
          {matches.length > 0 ? (
            <ul className="border-t border-line">
              {matches.map((p) => (
                <IndexRow key={p.name} project={p} />
              ))}
            </ul>
          ) : (
            <p className="border-t border-line py-8 text-sm text-muted">
              Nothing here uses {filter} yet. Clear the filter to see everything.
            </p>
          )}
        </div>
      ) : (
        <>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
          >
            {featured.map((p, i) => (
              <motion.div
                key={p.name}
                variants={{
                  hidden: reduce ? {} : { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className={CELLS[i] ?? "lg:col-span-2"}
              >
                <Card project={p} tinted={i === 0 || i === 2} />
              </motion.div>
            ))}
          </motion.div>

          {rest.length > 0 ? (
            <div className="mt-12">
              <button
                type="button"
                onClick={() => {
                  const next = !showAll;
                  setShowAll(next);
                  track("project_archive_toggle", { open: next });
                }}
                aria-expanded={showAll}
                className="focus-ring rounded text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text"
              >
                {showAll
                  ? "Hide earlier work"
                  : `Show ${rest.length} earlier projects`}
              </button>

              <AnimatePresence initial={false}>
                {showAll ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-8 border-t border-line">
                      {rest.map((p) => (
                        <IndexRow key={p.name} project={p} />
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : null}
        </>
      )}
    </SectionShell>
  );
}
