"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";

/**
 * Drop a portrait at public/portrait.jpg and set this to "/portrait.jpg".
 * While it is null the plate renders as a typographic monogram, so the
 * composition holds either way.
 */
const PORTRAIT: string | null = null;

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center px-6 pb-20 pt-24 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-page grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
        <div className="md:col-span-7">
          <motion.p
            {...rise(0)}
            className="font-mono text-xs leading-5 text-muted"
          >
            {profile.name}
            <span className="px-2 text-faint">/</span>
            {profile.role}
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            {profile.thesis}
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-prose text-base leading-relaxed text-muted md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={() => track("cta_click", { cta: "work", from: "hero" })}
              className="btn-primary group w-full sm:w-auto"
            >
              See selected work
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
            <CVButton from="hero" variant="ghost" className="w-full sm:w-auto" />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative md:col-span-5"
        >
          {/* The accent goes big exactly once, here. */}
          <div className="relative mx-auto aspect-square w-full max-w-[340px] md:max-w-none">
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded border border-line bg-surface-2"
            />
            {PORTRAIT ? (
              <Image
                src={PORTRAIT}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="(max-width: 768px) 380px, 40vw"
                className="relative rounded object-cover"
              />
            ) : (
              <div className="relative flex h-full w-full items-end justify-start overflow-hidden rounded bg-accent px-5 pb-3">
                <span
                  aria-hidden="true"
                  className="font-display text-[10rem] font-extrabold leading-[0.72] tracking-[-0.06em] text-on-accent sm:text-[13rem] md:text-[9.5rem] lg:text-[13rem] xl:text-[15rem]"
                >
                  YB
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
