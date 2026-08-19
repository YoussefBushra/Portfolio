"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Experience as Role } from "@/lib/types";

/**
 * One role. The summary and headline metrics always show; the detailed
 * highlights collapse behind a "Details" toggle on phones so the page stays
 * short, and render open (no toggle) from md up, matching the desktop reading.
 */
export function RoleEntry({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const highlights = (
    <ul className="grid gap-x-10 gap-y-2.5 lg:grid-cols-2">
      {role.highlights.map((h) => (
        <li
          key={h.lead}
          className="border-l border-accent/40 pl-3.5 text-[13px] leading-[1.6] text-muted"
        >
          <span className="font-display font-semibold text-text">{h.lead}</span>
          <span className="text-faint"> — </span>
          {h.text}
        </li>
      ))}
    </ul>
  );

  return (
    <article className="glass-strong rounded-xl p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-lg font-bold tracking-tight text-text">
          {role.role}
        </h3>
        <p className="num font-mono text-[11px] text-faint">{role.period}</p>
      </div>
      <p className="mt-1.5 font-mono text-[12px] text-accent-text">
        {role.company}
        <span className="text-faint"> · {role.location}</span>
      </p>

      <p className="mt-4 max-w-prose text-[14px] leading-relaxed text-muted sm:text-[15px]">
        {role.summary}
      </p>

      {role.metrics?.length ? (
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4 sm:gap-x-10">
          {role.metrics.map((m) => (
            <div key={m.label}>
              <div className="num font-display text-xl font-bold leading-none tracking-tight text-accent-text">
                {m.value}
              </div>
              <div className="mt-1.5 font-mono text-[11px] text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Desktop: highlights always visible. */}
      <div className="mt-6 hidden md:block">{highlights}</div>

      {/* Phones: collapse the highlights behind a toggle to cut scrolling. */}
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring glass-control mt-5 flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-text"
        >
          <span>
            {open ? "Hide details" : "Details"}
            <span className="ml-1.5 font-mono text-[11px] text-faint">
              {role.highlights.length}
            </span>
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4">{highlights}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </article>
  );
}
