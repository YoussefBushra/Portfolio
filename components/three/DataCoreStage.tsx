"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { MonogramAvatar } from "@/components/ui/MonogramAvatar";
import type { CorePalette } from "@/components/three/DataCore";

const DataCore = dynamic(() => import("@/components/three/DataCore"), {
  ssr: false,
});

const DARK: CorePalette = { accent: "#8b7cff", accent2: "#38e0d0" };
const LIGHT: CorePalette = { accent: "#4f46e5", accent2: "#0891b2" };

function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * The signature 3D "data core" centerpiece, with graceful fallback to the
 * generated monogram for no-WebGL or reduced-motion visitors.
 */
export function DataCoreStage({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setSupported(webglSupported());
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMobile(window.matchMedia("(max-width: 767px), (pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(!!e?.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (mounted && (!supported || reduce)) {
    return (
      <div className={`grid place-items-center ${className ?? ""}`}>
        <MonogramAvatar size={300} />
      </div>
    );
  }

  const palette = resolvedTheme === "light" ? LIGHT : DARK;

  return (
    <div ref={ref} className={className}>
      {mounted ? (
        <DataCore
          palette={palette}
          active={visible}
          quality={mobile ? "low" : "high"}
        />
      ) : null}
    </div>
  );
}
