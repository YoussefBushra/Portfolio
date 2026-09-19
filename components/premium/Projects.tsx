"use client";

import { useState } from "react";
import { projects } from "@/content/projects";
import { Section, SectionHeader } from "@/components/premium/Section";
import { MiniDiagram } from "@/components/premium/MiniDiagram";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { track } from "@/lib/analytics";

/** Small architecture spec per featured project (columns of node labels). */
const DIAGRAMS: Record<string, string[][]> = {
  "Accelerated Deep Neuroevolution": [
    ["Dataset"],
    ["Evolve", "Accelerator"],
    ["DNN"],
    ["Eval"],
  ],
  "Elasticsearch Geo-Search at Scale": [
    ["Client"],
    ["NestJS API"],
    ["Elastic", "Redis"],
    ["Kibana"],
  ],
  "Dynamics 365 ↔ Odoo Integration": [
    ["D365"],
    ["RabbitMQ"],
    ["NestJS"],
    ["Odoo"],
  ],
  "Car Showcase": [["Client"], ["Next.js SSR"], ["Cars API"]],
  "Memories — Social Media App": [["React"], ["Express"], ["MongoDB"]],
  "Data Dashboard Outlook Add-on": [
    ["Outlook"],
    ["Office.js"],
    ["Express"],
    ["MongoDB"],
  ],
};

export function Projects() {
  const [showArchive, setShowArchive] = useState(false);
  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" className="py-24 md:py-32">
      <SectionHeader
        index="03"
        label="selected work"
        title="Systems, integrations and interfaces"
        description="A curated set — from search at scale and enterprise integrations to full-stack products. Each one shaped by real constraints."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {featured.map((project, i) => {
          const layers = DIAGRAMS[project.name];
          // First two cards span full width on large screens (spotlight).
          const wide = i < 2;
          return (
            <RevealOnScroll
              key={project.name}
              amount={0.15}
              className={wide ? "md:col-span-2" : ""}
            >
              <article className="surface surface-hover group flex h-full flex-col overflow-hidden">
                <div
                  className={`grid ${
                    wide ? "sm:grid-cols-[1.1fr_1fr]" : "grid-cols-1"
                  }`}
                >
                  {/* diagram preview */}
                  {layers ? (
                    <div
                      className={`grid-bg relative flex items-center justify-center border-b border-border/60 p-6 ${
                        wide ? "sm:order-last sm:border-b-0 sm:border-l" : ""
                      }`}
                    >
                      <MiniDiagram
                        layers={layers}
                        className="h-auto w-full max-w-[320px] transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}

                  {/* content */}
                  <div className="flex flex-col p-6 sm:p-7">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="mono-label !text-accent">
                        {project.kind}
                      </span>
                      <span className="font-mono text-xs text-faint">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-text">
                      {project.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {project.blurb}
                    </p>

                    {project.metrics?.length ? (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="font-mono text-lg font-bold text-accent">
                              {m.value}
                            </div>
                            <div className="text-[11px] text-muted">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/70 bg-surface-2/40 px-2 py-0.5 font-mono text-[11px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {project.links?.length ? (
                      <div className="mt-5 border-t border-border/50 pt-4">
                        {project.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={() =>
                              track("cta_click", {
                                from: "project",
                                cta: project.name,
                              })
                            }
                            className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-medium text-text transition-colors hover:text-accent"
                          >
                            {l.label}
                            <span className="transition-transform group-hover:translate-x-0.5">
                              ↗
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          );
        })}
      </div>

      {/* archive */}
      <div className="mt-8">
        <button
          type="button"
          onClick={() => {
            setShowArchive((v) => !v);
            track("project_archive_toggle", { open: !showArchive });
          }}
          aria-expanded={showArchive}
          className="focus-ring group inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-text"
        >
          {showArchive ? "Hide" : "Show"} more projects
          <span className="font-mono text-xs text-faint">
            ({archive.length})
          </span>
          <span
            className={`transition-transform duration-300 ${
              showArchive ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </button>

        {showArchive ? (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((project) => (
              <div
                key={project.name}
                className="surface surface-hover flex flex-col p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="mono-label !text-accent">
                    {project.kind}
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    {project.year}
                  </span>
                </div>
                <h4 className="text-[15px] font-semibold text-text">
                  {project.name}
                </h4>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                  {project.blurb}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] text-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
