"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { HeroLiquid } from "@/components/sections/HeroLiquid";

/**
 * Progressive enhancement for the hero. The CSS glass hero renders on the
 * server and on every client (SEO-safe, universal). On capable clients —
 * desktop, WebGL present, motion allowed — it upgrades to the real WebGL
 * Liquid Glass hero, and drops back to CSS if that ever fails to initialise.
 */
function canRunWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // The WebGL layout is a desktop grid; phones/tablets keep the CSS hero.
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroSwitch() {
  const [mode, setMode] = useState<"css" | "webgl">("css");

  useEffect(() => {
    if (canRunWebGL()) setMode("webgl");
  }, []);

  if (mode === "webgl") {
    return <HeroLiquid onFail={() => setMode("css")} />;
  }
  return <Hero />;
}
