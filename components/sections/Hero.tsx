"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { DataCoreStage } from "@/components/three/DataCoreStage";
import { StatusTicker } from "@/components/system/StatusTicker";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";
import { fadeUp, stagger } from "@/lib/motion";

const CREDS = [
  { k: "4.00 GPA", v: "Distinction w/ Honors" },
  { k: "10M+ @ 600ms", v: "Elasticsearch geo-search" },
  { k: "Event-driven", v: "Microservices · RabbitMQ" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      {/* aurora + grid backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="aurora" />
        <div className="absolute inset-0 bp-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/30 to-bg" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        {/* text column */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="order-2 lg:order-1">
          <motion.div
            variants={fadeUp}
            className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
            <span className="text-ok">Available for opportunities</span>
            <span className="text-faint">·</span>
            <span>{profile.location}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Youssef Bushra
            <br />
            <span className="text-gradient">Fouad</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg font-medium text-text sm:text-xl"
          >
            {profile.role}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted"
          >
            {profile.tagline}
          </motion.p>

          {/* credibility chips */}
          <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-2.5">
            {CREDS.map((c) => (
              <li key={c.k} className="glass rounded-xl px-3 py-2">
                <div className="text-sm font-bold text-text">{c.k}</div>
                <div className="mono-label mt-0.5 normal-case tracking-normal">
                  {c.v}
                </div>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-7">
            <StatusTicker />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={() => track("cta_click", { cta: "work", from: "hero" })}
              className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              View my work
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <CVButton from="hero" variant="ghost" />
            <a
              href="#contact"
              onClick={() => track("cta_click", { cta: "contact", from: "hero" })}
              className="focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        {/* 3D data core centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 h-[300px] w-full sm:h-[380px] lg:order-2 lg:h-[560px]"
        >
          <DataCoreStage className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
