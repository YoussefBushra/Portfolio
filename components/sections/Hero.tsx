"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";
import { fadeUp, stagger } from "@/lib/motion";

const KEY_SKILLS = [
  "NestJS",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
  "Microservices",
  "RabbitMQ",
  "Redis",
  "Elasticsearch",
  "React",
  "Next.js",
];

const HIGHLIGHTS = [
  { v: "2+ yrs", k: "building production systems" },
  { v: "10M+ @ 600ms", k: "records searched (Elasticsearch)" },
  { v: "Event-driven", k: "microservices & integrations" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[92svh] items-center border-b border-border/60 pt-24"
    >
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted"
          >
            <span className="inline-flex items-center gap-1.5 text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Available for opportunities
            </span>
            <span className="text-faint">·</span>
            <span>{profile.location}</span>
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-4xl font-bold tracking-tight text-text sm:text-5xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-2 text-lg font-medium text-accent"
          >
            {profile.role}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.summary[0]}
          </motion.p>

          {/* highlights */}
          <motion.dl
            variants={fadeUp}
            className="mt-8 grid grid-cols-1 gap-4 border-y border-border/60 py-6 sm:grid-cols-3"
          >
            {HIGHLIGHTS.map((h) => (
              <div key={h.k}>
                <dt className="text-xl font-bold tracking-tight text-text">
                  {h.v}
                </dt>
                <dd className="mt-1 text-sm text-muted">{h.k}</dd>
              </div>
            ))}
          </motion.dl>

          {/* key skills */}
          <motion.div variants={fadeUp} className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-faint">
              Core stack
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {KEY_SKILLS.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#experience"
              onClick={() => track("cta_click", { cta: "experience", from: "hero" })}
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              View experience
            </a>
            <CVButton from="hero" variant="ghost" />
            <a
              href={`mailto:${profile.email}`}
              onClick={() => track("social_click", { label: "Email", from: "hero" })}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent/50 hover:text-accent"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
