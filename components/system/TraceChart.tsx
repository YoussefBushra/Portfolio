"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Trace } from "@/lib/timeline";
import type { Experience } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

const ROW = "grid grid-cols-1 gap-2 md:grid-cols-[220px_minmax(0,1fr)] md:items-center md:gap-6";

function Gridlines({ years }: { years: Trace["years"] }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {years.map((y) => (
        <span
          key={y.label}
          className="absolute top-0 h-full w-px bg-line/70"
          style={{ left: `${y.offset * 100}%` }}
        />
      ))}
    </span>
  );
}

export function TraceChart({
  trace,
  roles,
}: {
  trace: Trace;
  roles: Experience[];
}) {
  const reduce = useReducedMotion();
  const current = roles.find((r) => r.current) ?? roles[0];
  const [selected, setSelected] = useState<string>(current.company);
  const role = roles.find((r) => r.company === selected) ?? current;

  return (
    <div>
      {/* ---------- axis ---------- */}
      <div className={`${ROW} mb-4`}>
        <span className="hidden md:block" />
        <div className="relative h-5">
          {trace.years.map((y, i) => (
            <span
              key={y.label}
              className={`absolute top-0 -translate-x-1/2 font-mono text-[10px] text-faint ${
                i % 2 === 1 ? "hidden sm:block" : ""
              }`}
              style={{ left: `${y.offset * 100}%` }}
            >
              {y.label}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- spans ---------- */}
      <div className="space-y-3 border-t border-line pt-6">
        {trace.spans.map((span, i) => {
          const isRole = span.kind === "role";
          const isSelected = isRole && span.id === selected;

          const bar = (
            <motion.span
              className={`absolute inset-y-0 block rounded ${
                isRole
                  ? isSelected
                    ? "bg-accent"
                    : "bg-accent/50 group-hover:bg-accent/75"
                  : "border border-line bg-surface-2"
              } transition-colors duration-200`}
              style={{
                left: `${span.offset * 100}%`,
                width: `${span.width * 100}%`,
                transformOrigin: "left",
              }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );

          const label = (
            <span className="block">
              <span
                className={`block text-sm font-semibold ${
                  isSelected ? "text-text" : "text-text md:text-muted"
                }`}
              >
                {span.title}
              </span>
              <span className="mt-0.5 block font-mono text-[11px] leading-4 text-faint">
                {span.period}
                <span className="px-1.5">/</span>
                {span.duration}
              </span>
            </span>
          );

          const track = (
            <span className="relative block h-9 w-full">
              <Gridlines years={trace.years} />
              {bar}
            </span>
          );

          if (!isRole) {
            return (
              <div key={span.id} className={ROW}>
                {label}
                {track}
              </div>
            );
          }

          return (
            <button
              key={span.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(span.id)}
              className={`${ROW} group w-full rounded text-left focus-ring`}
            >
              {label}
              {track}
            </button>
          );
        })}

        {/* ---------- shipped ticks ---------- */}
        <div className={`${ROW} pt-2`}>
          <span className="block">
            <span className="block text-sm font-semibold text-text md:text-muted">
              Shipped projects
            </span>
            <span className="mt-0.5 block font-mono text-[11px] leading-4 text-faint">
              by year
            </span>
          </span>
          <span className="relative block h-9 w-full">
            <Gridlines years={trace.years} />
            {trace.ticks.map((t) => (
              <span
                key={t.year}
                className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-accent/50 bg-accent/15 font-mono text-[11px] text-accent-text"
                style={{ left: `${t.offset * 100}%` }}
              >
                <span aria-hidden="true">{t.count}</span>
                <span className="sr-only">
                  {t.count} projects shipped in {t.year}
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* ---------- selected role detail ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role.company}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 border-t border-line pt-10"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="font-display text-2xl font-bold tracking-tight text-text">
              {role.role}
            </h3>
            <p className="font-mono text-xs text-faint">
              {role.company}, {role.location}
            </p>
          </div>

          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
            {role.summary}
          </p>

          {role.metrics?.length ? (
            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
              {role.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display text-2xl font-bold tracking-tight text-text">
                    {m.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-faint">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {role.highlights.map((h) => (
              <li
                key={h}
                className="border-l border-line pl-4 text-sm leading-relaxed text-muted"
              >
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {role.stack.map((s) => (
              <Tag key={s} label={s} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
