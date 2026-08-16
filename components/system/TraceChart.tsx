"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Trace } from "@/lib/timeline";

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

/**
 * An at-a-glance timeline. Every bar is placed and sized by a real date, so a
 * wider bar always means a longer stretch of work. Read-only on purpose: the
 * roles are written out in full underneath rather than hidden behind a click.
 */
export function TraceChart({ trace }: { trace: Trace }) {
  const reduce = useReducedMotion();

  return (
    <div>
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

      <div className="mt-2 space-y-1 border-t border-line pt-3">
        {trace.spans.map((span, i) => (
          <div key={span.id} className={`${ROW} py-1`}>
            <span className="block">
              <span className="block text-[13px] font-medium leading-tight text-text">
                {span.title}
              </span>
              <span className="num mt-0.5 block font-mono text-[11px] leading-4 text-faint">
                {span.period}
                <span className="px-1">/</span>
                {span.duration}
              </span>
            </span>

            <span className="relative block h-8 w-full">
              <Gridlines years={trace.years} />
              <motion.span
                className={`absolute inset-y-0 block rounded-sm ${
                  span.kind === "role"
                    ? "bg-accent"
                    : "border border-line bg-surface-2"
                }`}
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
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}
