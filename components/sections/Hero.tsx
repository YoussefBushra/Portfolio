"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { MonogramAvatar } from "@/components/ui/MonogramAvatar";
import { CVButton } from "@/components/ui/CVButton";
import { CountUp } from "@/components/ui/CountUp";
import { track } from "@/lib/analytics";
import { fadeUp, stagger } from "@/lib/motion";

const CORE_STACK = [
  "NestJS",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
  "RabbitMQ",
  "Redis",
  "Elasticsearch",
  "React",
  "Next.js",
  "GraphQL",
  "Grafana",
];

function Tile({
  children,
  className = "",
  spotlight = true,
}: {
  children: ReactNode;
  className?: string;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:shadow-node sm:p-6 ${className}`}
    >
      {spotlight ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgb(var(--accent) / 0.1), transparent 60%)",
          }}
        />
      ) : null}
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

function Stat({
  label,
  children,
  sub,
}: {
  label: string;
  children: ReactNode;
  sub: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="mono-label">{label}</div>
      <div className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">
        {children}
      </div>
      <div className="mt-2 font-mono text-[11px] text-faint">{sub}</div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden py-28"
    >
      {/* soft backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="aurora opacity-70" />
        <div className="absolute inset-0 bp-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/30 to-bg" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-6xl auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-3.5 px-4 sm:px-6 md:grid-cols-4 lg:grid-cols-6"
      >
        {/* Identity */}
        <Tile
          spotlight={false}
          className="col-span-2 flex flex-col justify-between md:col-span-2 md:row-span-2 lg:col-span-3"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/40 bg-accent/10 font-mono text-sm font-bold text-accent">
                  YB
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-2.5 py-1 font-mono text-[11px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
                  Available
                </span>
              </div>
              <span className="hidden font-mono text-[11px] text-faint sm:block">
                {profile.location}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.03] tracking-tight sm:text-5xl">
              Youssef Bushra
              <br />
              <span className="text-gradient">Fouad</span>
            </h1>
            <p className="mt-3 text-base font-medium text-text sm:text-lg">
              {profile.role}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {profile.tagline}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#projects"
              onClick={() => track("cta_click", { cta: "work", from: "hero" })}
              className="focus-ring group/btn inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              View my work
              <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
            </a>
            <CVButton from="hero" variant="ghost" />
          </div>
        </Tile>

        {/* Records metric */}
        <Tile className="col-span-2 lg:col-span-3">
          <Stat label="records searched" sub="Elasticsearch geo-search @ Block Gemini">
            <CountUp value={10} suffix="M+" />
          </Stat>
        </Tile>

        {/* GPA */}
        <Tile className="col-span-1 lg:col-span-2">
          <Stat label="cumulative GPA" sub="Distinction · Honors">
            <CountUp value={4} decimals={2} />
          </Stat>
        </Tile>

        {/* p95 */}
        <Tile className="col-span-1 lg:col-span-1">
          <Stat label="query p95" sub="target < 1s">
            <CountUp value={600} suffix="ms" />
          </Stat>
        </Tile>

        {/* Now */}
        <Tile className="col-span-2 lg:col-span-3">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center gap-2 mono-label">
              <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
              currently
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold tracking-tight text-text">
                Web Full-Stack Developer
              </div>
              <div className="mt-1 font-mono text-sm text-accent">
                Skil-Dev <span className="text-faint">· Cairo, Egypt</span>
              </div>
            </div>
            <div className="mt-3 font-mono text-[11px] text-faint">
              Aug 2024 — Present · microservices, integrations &amp; UIs
            </div>
          </div>
        </Tile>

        {/* Links */}
        <Tile className="col-span-2 lg:col-span-3">
          <div className="mono-label mb-3">connect</div>
          <ul className="space-y-2">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  onClick={() => track("social_click", { label: s.label, from: "hero-bento" })}
                  className="focus-ring group/link flex items-center justify-between rounded-lg py-1 text-sm"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-surface-2/60 font-mono text-[10px] text-accent">
                      {s.label.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-medium text-text">{s.label}</span>
                  </span>
                  <span className="font-mono text-[11px] text-faint transition-colors group-hover/link:text-accent">
                    {s.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Tile>

        {/* Core stack */}
        <Tile className="col-span-2 md:col-span-4 lg:col-span-6">
          <div className="mono-label mb-3">core stack</div>
          <div className="flex flex-wrap gap-2">
            {CORE_STACK.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-border bg-surface-2/50 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                {t}
              </span>
            ))}
          </div>
        </Tile>
      </motion.div>
    </section>
  );
}
