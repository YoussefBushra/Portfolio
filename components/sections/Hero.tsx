"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
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
  return (
    <section id="hero" className="px-6 md:px-10">
      <motion.div
        className="mx-auto max-w-page pb-9 pt-24 md:pb-14 md:pt-32"
        variants={wrap}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={card} className="glass-strong rounded-xl p-5 sm:p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            {/* Identity row. On phones the photo and name sit side by side so
                the fold leads with the claim, not a tall portrait; the desktop
                grid keeps the portrait as its own column. */}
            <div className="flex items-center gap-4 md:col-span-3 md:block">
              <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-full border border-white/30 bg-surface/40 shadow-lg sm:w-20 md:aspect-[4/5] md:w-full md:max-w-none md:rounded-lg">
                <Image
                  src={PORTRAIT}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 80px, 22vw"
                  className="object-cover object-[50%_12%]"
                />
              </div>
              <div className="min-w-0 md:hidden">
                <h1 className="font-display text-2xl font-bold leading-[1.05] tracking-tight">
                  {profile.name}
                </h1>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent-text">
                  {profile.role}
                </p>
              </div>
            </div>

            <div className="md:col-span-6">
              <h1 className="hidden font-display font-bold leading-[1.05] tracking-tight md:block md:text-[2.75rem]">
                {profile.name}
              </h1>
              <p className="hidden font-mono uppercase tracking-[0.14em] text-accent-text md:mt-2 md:block md:text-xs">
                {profile.role}
              </p>

              <p className="font-display text-lg font-semibold leading-snug tracking-tight text-text md:mt-6 md:text-2xl">
                {profile.thesis}
              </p>
              <p className="mt-2.5 max-w-prose text-[14px] leading-relaxed text-muted sm:text-[15px] md:mt-3">
                {profile.tagline}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 md:mt-7">
                <CVButton from="hero" variant="primary" />
                <ContactLink />
              </div>

              {/* Location / status / links, inline on phones, in the side
                  column on desktop. */}
              <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[13px] md:hidden">
                <div className="flex items-center gap-1.5">
                  <dt className="text-faint">Based in</dt>
                  <dd className="text-text">{profile.location}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <dt className="text-faint">Status</dt>
                  <dd className="text-text">Open to roles</dd>
                </div>
                <div className="w-full">
                  <SocialLinks from="hero" />
                </div>
              </dl>
            </div>

            <div className="hidden md:col-span-3 md:block">
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
              <dt className="num font-display text-xl font-bold tracking-tight text-accent-text sm:text-2xl">
                <CountUp value={f.value} />
              </dt>
              <dd className="mt-1 text-[12.5px] leading-tight text-text sm:mt-1.5 sm:text-[13px]">{f.label}</dd>
              <dd className="mt-0.5 font-mono text-[10.5px] leading-tight text-faint sm:text-[11px]">
                {f.hint}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
