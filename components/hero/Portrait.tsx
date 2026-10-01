"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { setPortraitRefs } from "@/components/view/portraitRefs";

const REC = "/portrait-recruiter.jpg";
const ENG = "/portrait-engineer.jpg";
const SIZES = "(max-width: 768px) 200px, 240px";

/**
 * The hero portrait, one photo per view. Both photos are always in the page and
 * CSS shows the one matching `html[data-view]`, so deep links, no-JS and first
 * paint are correct. During a switch the portrait holds the old photo while
 * the page transforms, then plays the finale: the old photo derezzes into
 * scanlines and the new one rematerialises as a hologram
 * (components/hero/hologram.ts, driven by components/view/transform.ts).
 */
export function Portrait({ alt }: { alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const [f, s, c] = [frame.current, stage.current, canvas.current];
    if (f && s && c) setPortraitRefs({ frame: f, stage: s, canvas: c });
    return () => setPortraitRefs(null);
  }, []);

  return (
    <div
      data-flip="portrait"
      className="relative w-full max-w-[200px] md:max-w-none"
    >
      <div
        ref={frame}
        className="portrait-frame relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
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
      </div>

      <div ref={stage} aria-hidden className="fx-stage">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}
