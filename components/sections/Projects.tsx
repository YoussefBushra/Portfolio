"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import type { Project } from "@/lib/types";
import { SectionShell } from "@/components/layout/SectionShell";
import { Tag } from "@/components/ui/Tag";
import { useTech } from "@/components/system/TechContext";
import { track } from "@/lib/analytics";

/** One project as a document row: identity and figures left, detail right. */
function Row({ project }: { project: Project }) {
  return (
    <li className="grid gap-x-10 gap-y-3 border-t border-line py-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <div>
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-text">
          {project.name}
        </h3>
        <p className="mt-1 font-mono text-[11px] text-faint">
          {project.kind}, {project.year}
        </p>

        {project.metrics?.length ? (
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="num text-lg font-semibold leading-none tracking-tight text-text">
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[11px] text-faint">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="max-w-prose text-[14px] leading-[1.65] text-muted">
          {project.blurb}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Tag key={t} label={t} filterable />
          ))}
        </div>
        {project.links?.length ? (
          <div className="mt-3 flex flex-wrap gap-4">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring link rounded-sm text-[13px]"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </li>
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

  const years = projects.map((p) => Number(p.year)).sort((a, b) => a - b);
  const span =
    years.length > 1 ? `${years[0]} to ${years[years.length - 1]}` : `${years[0]}`;

  return (
    <SectionShell id="projects" label="Work" meta={span}>
      {filter ? (
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted">
              {matches.length} project{matches.length === 1 ? "" : "s"} using
            </span>
            <span className="tag border-accent bg-accent/15 text-accent-text">
              {filter}
            </span>
            <button
              type="button"
              onClick={clearFilter}
              className="focus-ring rounded-sm text-sm text-muted underline decoration-line underline-offset-[3px] transition-colors hover:text-text"
            >
              Clear filter
            </button>
          </div>
          {matches.length > 0 ? (
            <ul>
              {matches.map((p) => (
                <Row key={p.name} project={p} />
              ))}
            </ul>
          ) : (
            <p className="border-t border-line py-6 text-sm text-muted">
              Nothing here uses {filter} yet. Clear the filter to see everything.
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="mb-1 max-w-prose text-sm text-muted">
            Select any tag to filter every project by technology.
          </p>
          <ul>
            {featured.map((p) => (
              <Row key={p.name} project={p} />
            ))}
          </ul>

          {rest.length > 0 ? (
            <div className="border-t border-line pt-5">
              <button
                type="button"
                onClick={() => {
                  const next = !showAll;
                  setShowAll(next);
                  track("project_archive_toggle", { open: next });
                }}
                aria-expanded={showAll}
                className="focus-ring rounded-sm text-sm text-muted underline decoration-line underline-offset-[3px] transition-colors hover:text-text"
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
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-5">
                      {rest.map((p) => (
                        <Row key={p.name} project={p} />
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
