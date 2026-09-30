"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { setCaster, type Caster } from "@/lib/view";
import { Reticle } from "./Reticle";

const REC = "/portrait-recruiter.jpg";
const ENG = "/portrait-engineer.jpg";
const SIZES = "(max-width: 768px) 200px, 240px";

/**
 * The hero portrait, one photo per view. Both photos are always in the page and
 * CSS shows the one matching `html[data-view]`, so deep links, no-JS and first
 * paint are correct. On a switch, the portrait plays the "recompile"
 * transformation (cast.ts) and commits the view at its peak; the page then
 * recompiles top-down (recompilePage.ts).
 */
export function Portrait({ alt }: { alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reticle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caster: Caster = async (to, commit) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return commit();

      const f = frame.current;
      const refs = {
        frame: f,
        stage: stage.current,
        canvas: canvas.current,
        reticle: reticle.current,
      };
      const ready = Object.values(refs).every(Boolean);
      const r = f?.getBoundingClientRect();
      const visible = !!r && r.bottom > 90 && r.top < window.innerHeight - 60;

      const { cast, recompileOnly } = await import("./cast");
      // Portrait scrolled away: skip it, but still recompile what's on screen.
      if (!ready || !visible) return recompileOnly(to, commit);
      await cast(refs as Parameters<typeof cast>[0], to, commit);
    };
    setCaster(caster);
    return () => setCaster(null);
  }, []);

  return (
    <div
      data-flip="portrait"
      className="relative w-full max-w-[200px] md:max-w-none"
    >
      <div
        ref={frame}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
      >
        <Image
          src={REC}
          alt={alt}
          fill
          priority
          sizes={SIZES}
          className="portrait-img portrait-rec object-cover object-[50%_25%]"
        />
        <Image
          src={ENG}
          alt=""
          fill
          loading="eager"
          sizes={SIZES}
          className="portrait-img portrait-eng object-cover object-[50%_25%]"
        />
        {/* The portrait while it's being rebuilt, tile by tile. */}
        <canvas
          ref={canvas}
          aria-hidden
          className="tiles-canvas absolute inset-0 h-full w-full"
        />
      </div>

      <div ref={stage} aria-hidden className="hud-stage">
        <Reticle ref={reticle} />
      </div>
    </div>
  );
}
