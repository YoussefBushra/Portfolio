"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Trace } from "@/lib/timeline";
import type { Experience } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

const ROW =
  "grid grid-cols-1 gap-1.5 md:grid-cols-[232px_minmax(0,1fr)] md:items-center md:gap-5";

function Gridlines({ years }: { years: Trace["years"] }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {years.map((y) => (
        <span
          key={y.label}
          className="absolute top-0 h-full w-px bg-line"
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
      <div className={ROW}>
        <span className="hidden md:block" />
        <div className="relative h-4">
          {trace.years.map((y, i) => (
            <span
              key={y.label}
              className={`num absolute top-0 -translate-x-1/2 font-mono text-[10px] text-faint ${
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
      <div className="mt-2 space-y-1 border-t border-line pt-3">
        {trace.spans.map((span, i) => {
          const isRole = span.kind === "role";
          const isSelected = isRole && span.id === selected;

          const bar = (
            <motion.span
              className={`absolute inset-y-0 block rounded-sm ${
                isRole
                  ? isSelected
                    ? "bg-accent"
                    : "bg-accent/45 group-hover:bg-accent/70"
                  : "border border-line bg-surface-2"
              } transition-colors duration-150`}
              style={{
                left: `${span.offset * 100}%`,
                width: `${span.width * 100}%`,
                transformOrigin: "left",
              }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.6,
                delay: 0.05 + i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );

          const label = (
            <span className="block">
              <span
                className={`block text-[13px] font-medium leading-tight ${
                  isSelected ? "text-text" : "text-text md:text-muted"
                }`}
              >
                {span.title}
              </span>
              <span className="num mt-0.5 block font-mono text-[11px] leading-4 text-faint">
                {span.period}
                <span className="px-1">/</span>
                {span.duration}
              </span>
            </span>
          );

          const track = (
            <span className="relative block h-8 w-full">
              <Gridlines years={trace.years} />
              {bar}
            </span>
          );

          if (!isRole) {
            return (
              <div key={span.id} className={`${ROW} py-1`}>
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
              className={`${ROW} focus-ring w-full rounded-sm py-1 text-left ${
                isSelected ? "bg-surface" : "group hover:bg-surface"
              }`}
            >
              {label}
              {track}
            </button>
          );
        })}

        {/* ---------- shipped ticks ---------- */}
        <div className={`${ROW} py-1`}>
          <span className="block">
            <span className="block text-[13px] font-medium leading-tight text-text md:text-muted">
              Projects shipped
            </span>
            <span className="mt-0.5 block font-mono text-[11px] leading-4 text-faint">
              by year
            </span>
          </span>
          <span className="relative block h-8 w-full">
            <Gridlines years={trace.years} />
            {trace.ticks.map((t) => (
              <span
                key={t.year}
                className="num absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm border border-accent/50 bg-accent/15 font-mono text-[11px] text-accent-text"
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
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -5 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 border-t border-line pt-7"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-text">
              {role.role}
            </h3>
            <p className="font-mono text-[11px] text-faint">
              {role.company}, {role.location}
            </p>
          </div>

          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
            {role.summary}
          </p>

          {role.metrics?.length ? (
            <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
              {role.metrics.map((m) => (
                <div key={m.label}>
                  <div className="num text-lg font-semibold tracking-tight text-text">
                    {m.value}
                  </div>
                  <div className="font-mono text-[11px] text-faint">{m.label}</div>
                </div>
              ))}
            </div>
          ) : null}

          <ul className="mt-6 grid gap-x-10 gap-y-2.5 lg:grid-cols-2">
            {role.highlights.map((h) => (
              <li
                key={h}
                className="border-l border-line pl-3.5 text-[13px] leading-[1.6] text-muted"
              >
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {role.stack.map((s) => (
              <Tag key={s} label={s} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
