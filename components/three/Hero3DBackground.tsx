"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { NodeGraphBackground } from "@/components/system/NodeGraphBackground";
import type { Palette } from "@/components/three/Scene3D";

const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
});

const DARK: Palette = { accent: "#8a88ff", accent2: "#2dd4bf", bg: "#070910" };
const LIGHT: Palette = { accent: "#4f46e5", accent2: "#0891b2", bg: "#f6f7fb" };

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
 * Renders the layered 3D node-graph hero scene when WebGL is available,
 * otherwise falls back to the 2D interactive canvas. Under reduced motion the
 * 3D scene renders a single static frame (no animation loop).
 */
export function Hero3DBackground({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setSupported(webglSupported());
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMobile(
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches
    );
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

  // Fall back to the 2D canvas when WebGL is unavailable or the visitor
  // prefers reduced motion (the 2D layer renders a purpose-built static frame).
  if (mounted && (!supported || reduce)) {
    return <NodeGraphBackground className={className} interactive />;
  }

  const palette = resolvedTheme === "light" ? LIGHT : DARK;

  return (
    <div ref={ref} className={className}>
      {mounted ? (
        <Scene3D
          palette={palette}
          active={visible}
          quality={mobile ? "low" : "high"}
        />
      ) : null}
    </div>
  );
}
