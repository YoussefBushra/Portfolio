"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { profile } from "@/content/profile";
import { NodeGraphBackground } from "@/components/system/NodeGraphBackground";
import { Aurora } from "@/components/system/Aurora";
import { MonogramAvatar } from "@/components/ui/MonogramAvatar";
import { StatusTicker } from "@/components/system/StatusTicker";
import { CVButton } from "@/components/ui/CVButton";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { Magnetic } from "@/components/ui/Magnetic";
import { track } from "@/lib/analytics";
import { fadeUp, stagger } from "@/lib/motion";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [motionOk, setMotionOk] = useState(true);

  // normalized pointer position within the hero (0..1)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });

  // cursor-following glow position
  const glowX = useTransform(sx, (v) => `${v * 100}%`);
  const glowY = useTransform(sy, (v) => `${v * 100}%`);
  const glowTransform = useMotionTemplate`translate(-50%, -50%)`;

  // avatar parallax tilt
  const rotateY = useTransform(sx, [0, 1], [14, -14]);
  const rotateX = useTransform(sy, [0, 1], [-14, 14]);
  const shiftX = useTransform(sx, [0, 1], [12, -12]);
  const shiftY = useTransform(sy, [0, 1], [10, -10]);

  useEffect(() => {
    setMotionOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!motionOk) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      {/* animated system backdrop */}
      <div className="absolute inset-0 -z-10">
        <Aurora className="absolute inset-0" />
        <div className="absolute inset-0 bp-grid opacity-70" />
        <NodeGraphBackground
          className="absolute inset-0 h-full w-full"
          interactive
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/40 to-bg" />
      </div>

      {/* cursor-following glow (purely decorative) */}
      <motion.div
        aria-hidden="true"
        style={{
          left: glowX,
          top: glowY,
          transform: glowTransform,
        }}
        className="pointer-events-none absolute -z-10 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
            <span className="text-ok">ONLINE</span>
            <span className="text-faint">·</span>
            <span>{profile.location}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <ScrambleText
              as="span"
              trigger="mount"
              text={profile.name.split(" ").slice(0, 2).join(" ")}
              className="block"
            />
            <ScrambleText
              as="span"
              trigger="mount"
              delay={220}
              text={profile.name.split(" ").slice(2).join(" ")}
              className="block text-gradient"
            />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 font-mono text-sm text-accent-2 sm:text-base"
          >
            <ScrambleText trigger="mount" delay={480} text={profile.role} />
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6">
            <StatusTicker />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#projects"
                onClick={() => track("cta_click", { cta: "explore", from: "hero" })}
                className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Explore the system
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={() => track("cta_click", { cta: "contact", from: "hero" })}
                className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm font-medium text-text backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
              >
                Open a connection
              </a>
            </Magnetic>
            <Magnetic>
              <CVButton from="hero" variant="ghost" />
            </Magnetic>
          </motion.div>

          {/* status metrics */}
          <motion.dl
            variants={fadeUp}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4"
          >
            {profile.stats.map((s) => (
              <div
                key={s.label}
                className="group border-l-2 border-accent/30 pl-3 transition-colors hover:border-accent"
              >
                <dt className="mono-label">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-text transition-colors group-hover:text-accent">
                  {s.value}
                </dd>
                <dd className="font-mono text-[11px] text-faint">{s.hint}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* interactive avatar node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto hidden lg:block"
          style={{ perspective: 900 }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              x: shiftX,
              y: shiftY,
              transformStyle: "preserve-3d",
            }}
            className="relative"
          >
            <MonogramAvatar size={300} />
          </motion.div>
        </motion.div>
      </div>

      {/* interactivity hint + scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] text-faint sm:flex">
        <span className="text-muted/80">move &amp; click to ping the graph</span>
        <span className="h-8 w-px bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  );
}
