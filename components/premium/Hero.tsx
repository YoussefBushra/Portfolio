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
      <span className="text-accent-gradient">{text.slice(idx, idx + key.length)}</span>
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
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-3 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ok opacity-60 [animation:ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            <span className="mono-label !text-muted">{profile.availability}</span>
          </motion.div>

          <motion.p variants={item} className="mono-label mb-4 !text-accent">
            {profile.name} · {profile.role}
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
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
                shipping
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-bold text-text">{current.role}</h2>
              <span className="whitespace-nowrap font-mono text-xs text-faint">
                {current.period.split("-").pop()?.trim()}
              </span>
            </div>
            <div className="mt-0.5 text-sm font-medium text-accent">
              {current.company}
              <span className="text-faint"> · {current.location}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {current.summary}
            </p>

            <div className="mt-5 space-y-2 border-t border-border/60 pt-5">
              {current.metrics?.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-[13px] text-muted">{m.label}</span>
                  <span className="rounded-md border border-border/70 bg-surface-2/50 px-2 py-0.5 font-mono text-xs font-semibold text-accent">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
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
