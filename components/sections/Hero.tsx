"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";
import { fadeUp, stagger } from "@/lib/motion";

/* ---------------- data ---------------- */

const CAPABILITIES = [
  { label: "Backend & APIs", pct: 95 },
  { label: "Distributed systems", pct: 90 },
  { label: "Databases & search", pct: 88 },
  { label: "Observability", pct: 85 },
  { label: "Frontend", pct: 82 },
];

const LOG = [
  { t: "2024–now", m: "Skil-Dev · D365 ↔ Odoo integration · event-driven" },
  { t: "2024", m: "Block Gemini · Elasticsearch geo-search · 10M rows @ 600ms" },
  { t: "2023", m: "Car Showcase · Next.js SSR/SSG · deployed to Vercel" },
  { t: "2022", m: "BSc Computer Science · GPA 4.00 · Distinction w/ Honors" },
  { t: "2021", m: "Huawei ICT Competition · Gold Medal (Cloud, Nationals)" },
];

/* ---------------- primitives ---------------- */

function Panel({
  label,
  status = "ONLINE",
  className = "",
  children,
}: {
  label: string;
  status?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface/70 backdrop-blur-sm ${className}`}
    >
      {/* corner ticks */}
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-accent/50" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent/50" />
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
        <span className="mono-label">{label}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
          {status}
        </span>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </motion.div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", { hour12: false }) + " CLT"
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now}</span>;
}

function Gauge({ value, max, unit }: { value: number; max: number; unit: string }) {
  const f = Math.min(value / max, 1);
  // background + value arc share the same semicircle path
  const arc = "M 20 100 A 80 80 0 0 1 180 100";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 118" className="w-full max-w-[220px]">
        <path
          d={arc}
          fill="none"
          stroke="rgb(var(--border))"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <motion.path
          d={arc}
          fill="none"
          stroke="rgb(var(--ok))"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          initial={{ strokeDashoffset: 1 }}
          whileInView={{ strokeDashoffset: 1 - f }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* needle */}
        <motion.g
          initial={{ rotate: -90 }}
          whileInView={{ rotate: (f - 0.5) * 180 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="36"
            stroke="rgb(var(--accent))"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>
        <circle cx="100" cy="100" r="5" fill="rgb(var(--accent))" />
      </svg>
      <div className="-mt-2 text-center">
        <div className="text-3xl font-bold tracking-tight text-text">
          {value}
          <span className="text-lg text-muted">{unit}</span>
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-ok">
          PASS · target &lt; {max}
          {unit}
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  const N = 40;
  const [pts, setPts] = useState<number[]>(() =>
    Array.from({ length: N }, (_, i) => 0.4 + 0.25 * Math.sin(i / 3))
  );
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setPts((p) => [...p.slice(1), 0.2 + Math.random() * 0.7]);
    }, 220);
    return () => clearInterval(id);
  }, []);
  const w = 300;
  const h = 60;
  const line = pts
    .map((v, i) => `${(i / (N - 1)) * w},${h - v * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-16 w-full">
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--accent-2))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(var(--accent-2))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="url(#spk)" />
      <polyline
        points={line}
        fill="none"
        stroke="rgb(var(--accent-2))"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ---------------- hero ---------------- */

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden py-28"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bp-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/30 to-bg" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* status bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border bg-surface/70 px-4 py-2 font-mono text-[11px] text-muted backdrop-blur-sm"
        >
          <span className="text-accent">SYS://youssef.systems</span>
          <span className="flex items-center gap-1.5 text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
            STATUS: OPERATIONAL
          </span>
          <span className="text-faint">UPTIME 2+ yrs</span>
          <span className="ml-auto flex items-center gap-3">
            <LiveClock />
            <span className="text-faint">{profile.location}</span>
          </span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid auto-rows-[minmax(0,auto)] grid-cols-2 gap-3.5 lg:grid-cols-6"
        >
          {/* OPERATOR */}
          <Panel
            label="operator"
            status="AVAILABLE"
            className="col-span-2 lg:col-span-3 lg:row-span-2"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/40 bg-accent/10 font-mono text-sm font-bold text-accent">
                    YB
                  </span>
                  <span className="font-mono text-xs text-muted">
                    Full-Stack Systems Engineer
                  </span>
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-[1.03] tracking-tight sm:text-5xl">
                  Youssef Bushra <span className="text-gradient">Fouad</span>
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                  {profile.tagline}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href="#projects"
                  onClick={() => track("cta_click", { cta: "work", from: "hero" })}
                  className="focus-ring group inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  View my work
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
                <CVButton from="hero" variant="ghost" />
              </div>
            </div>
          </Panel>

          {/* LATENCY gauge */}
          <Panel label="latency · p95" className="col-span-1 lg:col-span-2">
            <Gauge value={600} max={1000} unit="ms" />
          </Panel>

          {/* SCALE */}
          <Panel label="scale" className="col-span-1 lg:col-span-1">
            <div className="flex h-full flex-col justify-center">
              <div className="text-3xl font-bold tracking-tight text-text">10M+</div>
              <div className="mt-1 font-mono text-[10px] text-faint">
                records indexed
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-text">
                4.00
              </div>
              <div className="mt-1 font-mono text-[10px] text-faint">GPA · Honors</div>
            </div>
          </Panel>

          {/* THROUGHPUT */}
          <Panel label="throughput" status="LIVE" className="col-span-2 lg:col-span-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold tracking-tight text-text">
                  event-driven
                </div>
                <div className="mt-1 font-mono text-[10px] text-faint">
                  RabbitMQ · Redis · async pipelines
                </div>
              </div>
              <div className="font-mono text-[10px] text-accent-2">req/s</div>
            </div>
            <div className="mt-2">
              <Sparkline />
            </div>
          </Panel>

          {/* CAPABILITY */}
          <Panel label="capability matrix" className="col-span-2 lg:col-span-4">
            <ul className="space-y-2.5">
              {CAPABILITIES.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 font-mono text-xs text-muted">
                    {c.label}
                  </span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-2"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <span className="w-8 text-right font-mono text-[10px] text-faint">
                    {c.pct}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* COMMS */}
          <Panel label="comms" className="col-span-2 lg:col-span-2">
            <ul className="space-y-2">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    onClick={() => track("social_click", { label: s.label, from: "hero-mc" })}
                    className="focus-ring group flex items-center justify-between rounded-lg py-1 font-mono text-xs"
                  >
                    <span className="flex items-center gap-2 text-text">
                      <span className="text-accent">›</span>
                      {s.label}
                    </span>
                    <span className="truncate pl-2 text-faint transition-colors group-hover:text-accent">
                      {s.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>

          {/* MISSION LOG */}
          <Panel label="mission log" className="col-span-2 lg:col-span-6">
            <ul className="space-y-1.5 font-mono text-xs">
              {LOG.map((l, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex flex-wrap items-center gap-x-2 text-muted"
                >
                  <span className="text-accent">›</span>
                  <span className="text-faint">[{l.t}]</span>
                  <span>{l.m}</span>
                  <span className="ml-auto text-ok">— OK</span>
                </motion.li>
              ))}
              <li className="flex items-center gap-2 pt-1 text-faint">
                <span className="text-accent">›</span>
                <span>ready for next mission</span>
                <span className="inline-block h-3.5 w-2 animate-blink bg-accent" />
              </li>
            </ul>
          </Panel>
        </motion.div>
      </div>
    </section>
  );
}
