"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { experience } from "@/content/experience";
import { Section, SectionHeader } from "@/components/premium/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 80%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const height = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <Section id="experience" className="py-20 md:py-28">
      <SectionHeader
        index="02"
        label="experience"
        title="Where I've shipped production systems"
        description="Two years across teams in Cairo and Dubai — building and integrating the services behind financial platforms and high-volume search."
      />

      <div ref={trackRef} className="relative mt-14 pl-8 sm:pl-10">
        {/* rail */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[9px]" />
        {/* illuminated progress */}
        <motion.div
          style={{ height }}
          className="absolute left-[7px] top-2 w-px bg-accent sm:left-[9px]"
        />

        <div className="space-y-12">
          {experience.map((job) => (
            <RevealOnScroll key={job.company} amount={0.15} className="relative">
              {/* node */}
              <span className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center sm:-left-10">
                <span className="h-4 w-4 rounded-full border border-border bg-surface" />
                <span
                  className={`absolute h-2 w-2 rounded-full ${
                    job.current ? "bg-accent shadow-glow-sm" : "bg-faint"
                  }`}
                />
              </span>

              <div className="surface surface-hover p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <div>
                    <h3 className="text-lg font-bold text-text">{job.role}</h3>
                    <div className="mt-0.5 text-sm font-medium text-accent">
                      {job.company}
                      <span className="text-faint"> · {job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-muted">
                    {job.current ? (
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
                        current
                      </span>
                    ) : null}
                    {job.period}
                  </div>
                </div>

                {job.metrics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="inline-flex items-baseline gap-1.5 rounded-lg border border-border bg-surface-2/50 px-2.5 py-1"
                      >
                        <span className="font-mono text-xs font-semibold text-accent">
                          {m.value}
                        </span>
                        <span className="text-[11px] text-muted">
                          {m.label}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {job.summary}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {job.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 flex-none rounded-full bg-accent/70"
                      />
                      <span>
                        <span className="font-medium text-text">{h.lead}</span>
                        <span className="text-faint"> — </span>
                        {h.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/50 pt-4">
                  {job.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border/70 bg-surface-2/40 px-2 py-0.5 font-mono text-[11px] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </Section>
  );
}
