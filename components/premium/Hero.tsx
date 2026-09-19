"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
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

/** Highlight one word of the thesis with the accent gradient, if present. */
function Thesis({ text }: { text: string }) {
  const key = "services";
  const idx = text.toLowerCase().indexOf(key);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-accent">{text.slice(idx, idx + key.length)}</span>
      {text.slice(idx + key.length)}
    </>
  );
}

export function Hero() {
  const current = experience[0];

  return (
    <section
      id="top"
      className="relative px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-40"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* left — identity + thesis */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="mono-label mb-5 !text-muted">
            {profile.role}
          </motion.p>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl lg:text-[3.7rem]"
          >
            <Thesis text={profile.thesis} />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              onClick={() => track("cta_click", { from: "hero", cta: "get_in_touch" })}
              className="btn-primary"
            >
              Get in touch
              <span aria-hidden>→</span>
            </a>
            <CVButton from="hero" variant="ghost" />
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-4"
          >
            {[
              { k: "Availability", v: "Open to roles" },
              { k: "Based in", v: profile.location },
              { k: "Focus", v: "Backend · Distributed systems" },
            ].map((f) => (
              <div key={f.k}>
                <dt className="mono-label mb-1">{f.k}</dt>
                <dd className="text-sm font-medium text-text">{f.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* right — a real "currently" snapshot, not a generic diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.25 }}
          className="relative"
        >
          <div className="surface relative overflow-hidden p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="mono-label">current role</span>
              <span className="whitespace-nowrap font-mono text-xs text-faint">
                {current.period}
              </span>
            </div>

            <h2 className="text-lg font-bold text-text">{current.role}</h2>
            <div className="mt-0.5 text-sm font-medium text-accent">
              {current.company}
              <span className="text-faint"> · {current.location}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {current.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-5">
              {current.stack.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border/70 bg-surface-2/40 px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
