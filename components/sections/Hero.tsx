"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { NodeGraphBackground } from "@/components/system/NodeGraphBackground";
import { MonogramAvatar } from "@/components/ui/MonogramAvatar";
import { StatusTicker } from "@/components/system/StatusTicker";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";
import { fadeUp, stagger } from "@/lib/motion";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      {/* animated system backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bp-grid opacity-70" />
        <NodeGraphBackground className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/40 to-bg" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
            <span className="text-ok">ONLINE</span>
            <span className="text-faint">·</span>
            <span>{profile.location}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {profile.name.split(" ").slice(0, 2).join(" ")}
            <br />
            <span className="text-gradient">{profile.name.split(" ").slice(2).join(" ")}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 font-mono text-sm text-accent-2 sm:text-base"
          >
            {profile.role}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6">
            <StatusTicker />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={() => track("cta_click", { cta: "explore", from: "hero" })}
              className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Explore the system
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#contact"
              onClick={() => track("cta_click", { cta: "contact", from: "hero" })}
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm font-medium text-text backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
            >
              Open a connection
            </a>
            <CVButton from="hero" variant="ghost" />
          </motion.div>

          {/* status metrics */}
          <motion.dl
            variants={fadeUp}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4"
          >
            {profile.stats.map((s) => (
              <div key={s.label} className="border-l-2 border-accent/30 pl-3">
                <dt className="mono-label">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-text">
                  {s.value}
                </dd>
                <dd className="font-mono text-[11px] text-faint">{s.hint}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* avatar node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto hidden lg:block"
        >
          <div className="relative">
            <MonogramAvatar size={300} />
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] text-faint sm:flex">
        <span>scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  );
}
