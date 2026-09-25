"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useView } from "@/components/view/ViewProvider";

/**
 * Two portraits, one per lens: the office portrait for recruiters, the evening
 * one for engineers. Both are always mounted and CSS picks one off
 * `<html data-view>`, so a deep link shows the right photo on first paint.
 *
 * On a toggle the photo swaps inside the page-wide reveal, then gets its own
 * finish: into engineer view it "materialises" through teal scanlines; back
 * into recruiter view it warms up out of a soft blur.
 */
export function Portrait({ alt }: { alt: string }) {
  const { lastShift } = useView();
  const frame = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const f = frame.current;
    const o = overlay.current;
    if (!lastShift || !f || !o) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const img = f.querySelector<HTMLElement>(
      lastShift.to === "engineer" ? ".portrait-eng" : ".portrait-rec"
    );
    const anims: Animation[] = [];

    if (lastShift.to === "engineer") {
      // Lands roughly as the scan beam crosses the portrait.
      const delay = lastShift.cinematic ? 280 : 0;
      o.dataset.fx = "scan";
      anims.push(
        o.animate(
          [
            { opacity: 0, backgroundPosition: "0 0" },
            { opacity: 1, offset: 0.15 },
            { opacity: 0.35, offset: 0.35 },
            { opacity: 0.8, offset: 0.5 },
            { opacity: 0, backgroundPosition: "0 120px" },
          ],
          { duration: 1000, delay, easing: "linear", fill: "both" }
        )
      );
      if (img)
        anims.push(
          img.animate(
            [
              { filter: "saturate(0) brightness(1.35) contrast(1.15)", transform: "scale(1.04)" },
              { filter: "saturate(0.4) brightness(1.1)", offset: 0.45 },
              { filter: "none", transform: "scale(1)" },
            ],
            { duration: 1000, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
          )
        );
    } else {
      o.dataset.fx = "warm";
      anims.push(
        o.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 900,
          delay: 150,
          easing: "ease-out",
          fill: "both",
        })
      );
      if (img)
        anims.push(
          img.animate(
            [
              { filter: "blur(6px) brightness(1.12) sepia(0.25)", transform: "scale(1.03)" },
              { filter: "none", transform: "scale(1)" },
            ],
            { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
          )
        );
    }

    return () => anims.forEach((a) => a.cancel());
  }, [lastShift]);

  return (
    <div ref={frame} className="portrait-frame relative aspect-[3/4] w-full max-w-[200px] md:max-w-none">
      {/* HUD corner brackets, engineer view only. */}
      <span aria-hidden className="hud-corner -left-2 -top-2 border-l-2 border-t-2" />
      <span aria-hidden className="hud-corner -right-2 -top-2 border-r-2 border-t-2" />
      <span aria-hidden className="hud-corner -bottom-2 -left-2 border-b-2 border-l-2" />
      <span aria-hidden className="hud-corner -bottom-2 -right-2 border-b-2 border-r-2" />

      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <Image
          src="/portrait2.png"
          alt={alt}
          fill
          priority
          sizes="240px"
          className="portrait-img portrait-rec object-cover object-[50%_22%]"
        />
        <Image
          src="/portrait.jpg"
          alt=""
          fill
          loading="eager"
          sizes="240px"
          className="portrait-img portrait-eng object-cover object-[50%_25%]"
        />
        <span ref={overlay} aria-hidden className="portrait-fx" />
      </div>
    </div>
  );
}
