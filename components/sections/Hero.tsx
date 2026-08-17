"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CountUp } from "@/components/system/CountUp";

const PORTRAIT = "/portrait.jpg";

/**
 * The identity band, as a pane of glass floating on the aurora: the photo,
 * the name, the claim, both actions, location, availability, profile links
 * and four figures on a single screen. It plays a short entrance on load —
 * the card settles in, then the figures stagger and count up — all dropped
 * under reduced motion.
 */
const ease = [0.16, 1, 0.3, 1] as const;
const wrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};
const facts: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const tile: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="px-6 md:px-10">
      <motion.div
        className="mx-auto max-w-page pb-9 pt-24 md:pb-14 md:pt-32"
        variants={wrap}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "show"}
      >
        <motion.div variants={card} className="glass-strong rounded-xl p-5 sm:p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <div className="relative aspect-[4/5] w-full max-w-[168px] overflow-hidden rounded-lg border border-white/30 bg-surface/40 shadow-lg sm:max-w-[220px] md:max-w-none">
                <Image
                  src={PORTRAIT}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 220px, 22vw"
                  className="object-cover object-[50%_12%]"
                />
              </div>
            </div>

            <div className="md:col-span-6">
              <h1 className="font-display text-[1.9rem] font-bold leading-[1.05] tracking-tight sm:text-[2.75rem]">
                {profile.name}
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-text sm:text-xs">
                {profile.role}
              </p>

              <p className="mt-5 font-display text-lg font-semibold leading-snug tracking-tight text-text sm:mt-6 sm:text-2xl">
                {profile.thesis}
              </p>
              <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-muted sm:text-[15px]">
                {profile.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
                <CVButton from="hero" variant="primary" />
                <ContactLink />
              </div>
            </div>

            <div className="md:col-span-3">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="block-label">Based in</dt>
                  <dd className="mt-1 text-text">{profile.location}</dd>
                </div>
                <div>
                  <dt className="block-label">Status</dt>
                  <dd className="mt-1 text-text">{profile.availability}</dd>
                </div>
                <div>
                  <dt className="block-label">Elsewhere</dt>
                  <dd className="mt-1.5">
                    <SocialLinks from="hero" />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.div>

        {/* Figures, all of them defended further down the page, counting up as
            small glass tiles. */}
        <motion.dl
          variants={facts}
          className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-5 lg:grid-cols-4"
        >
          {profile.facts.map((f) => (
            <motion.div variants={tile} key={f.label} className="glass rounded-lg p-3.5 sm:p-4 md:p-5">
              <dt className="num font-display text-2xl font-bold tracking-tight text-accent-text">
                <CountUp value={f.value} />
              </dt>
              <dd className="mt-1.5 text-[13px] leading-tight text-text">{f.label}</dd>
              <dd className="mt-0.5 font-mono text-[11px] leading-tight text-faint">
                {f.hint}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
