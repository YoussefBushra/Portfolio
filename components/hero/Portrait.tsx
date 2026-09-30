"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { setCaster, type Caster } from "@/lib/view";
import { Sigil } from "./Sigil";

const REC = "/portrait-recruiter.jpg";
const ENG = "/portrait-engineer.jpg";
const SIZES = "(max-width: 768px) 200px, 240px";

/**
 * The hero portrait, one photo per view. Both photos are always in the page and
 * CSS shows the one matching `html[data-view]`, so deep links, no-JS and first
 * paint are correct. On a switch, the portrait casts the transformation (see
 * cast.ts) and commits the view at its peak.
 */
export function Portrait({ alt }: { alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sigil = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLImageElement>(null);
  const wave = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caster: Caster = async (to, commit) => {
      const f = frame.current;
      const refs = {
        frame: f,
        stage: stage.current,
        canvas: canvas.current,
        sigil: sigil.current,
        portal: portal.current,
        wave: wave.current,
      };
      const ready = Object.values(refs).every(Boolean);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // A spell nobody can see is just a delay: if the portrait is scrolled
      // away, switch at once.
      const r = f?.getBoundingClientRect();
      const visible = !!r && r.bottom > 90 && r.top < window.innerHeight - 60;
      if (!ready || reduce || !visible) return commit();

      const { cast } = await import("./cast");
      await cast(refs as Parameters<typeof cast>[0], to, commit);
    };
    setCaster(caster);
    return () => setCaster(null);
  }, []);

  return (
    <div className="relative w-full max-w-[200px] md:max-w-none">
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
        {/* The other side, seen through the portal while the spell plays. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={portal}
          alt=""
          aria-hidden
          className="portal-layer absolute inset-0 h-full w-full object-cover object-[50%_25%]"
        />
      </div>

      <div ref={stage} aria-hidden className="spell-stage">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
        <Sigil ref={sigil} />
      </div>
      <div ref={wave} aria-hidden className="spell-wave" />
    </div>
  );
}
