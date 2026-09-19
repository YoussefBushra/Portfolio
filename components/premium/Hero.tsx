"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { SystemDiagram } from "@/components/premium/SystemDiagram";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";
import { easeOut } from "@/lib/motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-40"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* left — identity + headline */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-3 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ok opacity-60 [animation:ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            <span className="mono-label !text-muted">
              Open to backend &amp; full-stack roles
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl lg:text-[3.75rem]"
          >
            I build the{" "}
            <span className="text-accent-gradient">systems</span> behind
            reliable web platforms.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted"
          >
            {profile.name.split(" ").slice(0, 2).join(" ")} — a{" "}
            {profile.role.toLowerCase()} focused on scalable microservices,
            event-driven backends and the responsive interfaces on top. From
            10M-record search to enterprise integrations.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={() => track("cta_click", { from: "hero", cta: "view_work" })}
              className="btn-primary"
            >
              View selected work
              <span aria-hidden>→</span>
            </a>
            <CVButton from="hero" variant="ghost" />
          </motion.div>

          {/* quick facts */}
          <motion.dl
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-4"
          >
            {[
              { k: "Based in", v: profile.location },
              { k: "Focus", v: "Backend · Distributed systems" },
              { k: "Stack", v: "TypeScript · NestJS · Node" },
            ].map((f) => (
              <div key={f.k}>
                <dt className="mono-label mb-1">{f.k}</dt>
                <dd className="text-sm font-medium text-text">{f.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* right — architecture visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
          className="relative"
        >
          <div className="surface relative mx-auto max-w-md overflow-hidden p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="mono-label">system.architecture</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                live
              </span>
            </div>
            <SystemDiagram className="h-auto w-full" />
            <p className="mt-2 text-center font-mono text-[10px] text-faint">
              hover a node to trace its connections
            </p>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
