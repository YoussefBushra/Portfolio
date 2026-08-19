"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import type { LiquidGlassInstance } from "@/lib/liquidglass";

const PORTRAIT = "/portrait.jpg";

/**
 * A desktop-only showpiece hero rendered with real WebGL Liquid Glass
 * (@ybouane/liquidglass): the card and the four fact tiles are glass panels
 * that refract a living aurora behind them — true edge lensing, not a CSS
 * approximation. Rendered only on capable clients; <HeroSwitch/> falls back to
 * the CSS hero otherwise, and this calls `onFail` if WebGL init throws.
 */
export function HeroLiquid({ onFail }: { onFail: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    let instance: LiquidGlassInstance | undefined;
    let cancelled = false;
    (async () => {
      try {
        const { LiquidGlass } = await import("@/lib/liquidglass");
        if (cancelled || !rootRef.current || !cardRef.current) return;
        const glass = [cardRef.current, ...tilesRef.current].filter(
          (el): el is HTMLDivElement => Boolean(el)
        );
        instance = await LiquidGlass.init({
          root: rootRef.current,
          glassElements: glass,
          defaults: {
            blurAmount: 0.5,
            refraction: 0.55,
            chromAberration: 0.04,
            edgeHighlight: 0.14,
            specular: 0.05,
            fresnel: 1,
            cornerRadius: 24,
            zRadius: 22,
            tintStrength: isDark ? 0.06 : 0.04,
            saturation: 0.15,
            brightness: isDark ? -0.02 : 0.04,
            shadowOpacity: 0.28,
            shadowSpread: 16,
            opacity: 1,
          },
        });
        if (cancelled) {
          instance.destroy();
          return;
        }
        setReady(true);
      } catch (e) {
        console.error("LiquidGlass init failed, falling back to CSS glass", e);
        if (!cancelled) onFail();
      }
    })();
    return () => {
      cancelled = true;
      try {
        instance?.destroy();
      } catch {}
    };
    // Re-init on theme flip so the tint/brightness match.
  }, [isDark, onFail]);

  // While WebGL warms up, panels wear a light surface so text stays legible;
  // once ready the panel is transparent and the shader provides the material.
  const panelBase = ready
    ? "bg-transparent"
    : "bg-surface/55 border border-white/15";

  return (
    <section id="hero" className="px-6 md:px-10">
      <div
        ref={rootRef}
        className="relative mx-auto grid max-w-page grid-cols-4 gap-4 overflow-hidden rounded-[28px] px-4 pb-6 pt-28 md:pt-32"
        style={{ minHeight: "36rem" }}
      >
        {/* Living aurora — the light the glass refracts. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 col-span-full row-span-full"
          style={{
            zIndex: 0,
            background: isDark
              ? "radial-gradient(55% 55% at 18% 20%, #4f46e5, transparent 70%), radial-gradient(50% 55% at 82% 24%, #2563eb, transparent 70%), radial-gradient(60% 55% at 72% 84%, #7c3aed, transparent 72%), radial-gradient(55% 55% at 24% 82%, #0ea5b7, transparent 72%), linear-gradient(160deg, #0a0b18, #0c1024)"
              : "radial-gradient(55% 55% at 18% 20%, #a5b4fc, transparent 70%), radial-gradient(50% 55% at 82% 24%, #7dd3fc, transparent 70%), radial-gradient(60% 55% at 72% 84%, #f0abfc, transparent 72%), radial-gradient(55% 55% at 24% 82%, #99f6e4, transparent 72%), linear-gradient(160deg, #eef2ff, #faf5ff)",
          }}
        />

        {/* Main identity card — a glass panel. */}
        <div
          ref={cardRef}
          className={`col-span-4 rounded-[24px] p-6 sm:p-8 ${panelBase}`}
          style={{ zIndex: 2 }}
        >
          <div className="relative z-[2] grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <div className="relative aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-xl border border-white/40 shadow-lg md:max-w-none">
                <Image
                  src={PORTRAIT}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  priority
                  sizes="220px"
                  className="object-cover object-[50%_12%]"
                />
              </div>
            </div>

            <div className="md:col-span-6">
              <h1 className="font-display text-[2.6rem] font-bold leading-[1.03] tracking-tight text-text">
                {profile.name}
              </h1>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-text">
                {profile.role}
              </p>
              <p className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-text">
                {profile.thesis}
              </p>
              <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-text/80">
                {profile.tagline}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <CVButton from="hero" variant="primary" />
                <ContactLink />
              </div>
            </div>

            <div className="md:col-span-3">
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="block-label">Status</dt>
                  <dd className="mt-2">
                    <AvailabilityBadge />
                  </dd>
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
        </div>

        {/* Four figures — each its own glass panel refracting the aurora. */}
        {profile.facts.map((f, i) => (
          <div
            key={f.label}
            ref={(el) => {
              tilesRef.current[i] = el;
            }}
            className={`col-span-1 rounded-[20px] p-5 ${panelBase}`}
            style={{ zIndex: 2 }}
          >
            <div className="relative z-[2]">
              <div className="num font-display text-2xl font-bold tracking-tight text-accent-text">
                {f.value}
              </div>
              <div className="mt-1.5 text-[13px] leading-tight text-text">{f.label}</div>
              <div className="mt-0.5 font-mono text-[11px] leading-tight text-text/60">
                {f.hint}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
