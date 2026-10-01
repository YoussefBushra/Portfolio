"use client";

import { useEffect } from "react";
import { setCaster, type Caster } from "@/lib/view";

/**
 * Hosts the page-wide view-switch transformation (transform.ts): the fixed
 * effect layers — the charge along the nav, the sweeping front, the shockwave
 * — and the caster that plays it. The effect code is loaded lazily; the intro
 * loader (or an idle moment, when the intro is skipped) loads and warms it up
 * ahead of the first switch.
 */
export function Transformation() {
  useEffect(() => {
    const caster: Caster = async (to, commit) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return commit();
      const { transform } = await import("./transform");
      await transform(to, commit);
    };
    setCaster(caster);

    let timer = 0;
    if (document.documentElement.dataset.intro === "done")
      timer = window.setTimeout(
        () => void import("./transform").then((m) => m.warmUp()),
        400,
      );
    return () => {
      setCaster(null);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="surge" aria-hidden>
      <div className="surge-charge" />
      <div className="surge-front" />
      <div className="surge-wave" />
      <canvas className="surge-sparks" />
    </div>
  );
}
