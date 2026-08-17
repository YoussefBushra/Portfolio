"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { OVERLAY_OPEN_EVENT, announceOverlay } from "@/lib/overlays";

/**
 * Lets the visitor retune the glass to taste: pick an accent and drag the
 * frosting from clear to solid. Choices are written as CSS variables on
 * <html> and persisted, so the whole token-driven design re-skins live.
 * Accent and glass are theme-aware, re-applied whenever the theme flips.
 */

type Tone = { a: string; at: string; on: string };
type Accent = { id: string; label: string; dot: string; light: Tone; dark: Tone };

const ACCENTS: Accent[] = [
  {
    id: "indigo",
    label: "Indigo",
    dot: "#6366f1",
    light: { a: "79 70 229", at: "67 56 202", on: "255 255 255" },
    dark: { a: "129 140 248", at: "165 180 252", on: "10 12 28" },
  },
  {
    id: "blue",
    label: "Blue",
    dot: "#3b82f6",
    light: { a: "37 99 235", at: "29 78 216", on: "255 255 255" },
    dark: { a: "96 165 250", at: "147 197 253", on: "8 12 24" },
  },
  {
    id: "teal",
    label: "Teal",
    dot: "#14b8a6",
    light: { a: "13 148 136", at: "15 118 110", on: "255 255 255" },
    dark: { a: "45 212 191", at: "94 234 212", on: "4 20 18" },
  },
  {
    id: "violet",
    label: "Violet",
    dot: "#8b5cf6",
    light: { a: "124 58 237", at: "109 40 217", on: "255 255 255" },
    dark: { a: "167 139 250", at: "196 181 253", on: "20 12 30" },
  },
  {
    id: "amber",
    label: "Amber",
    dot: "#d97706",
    light: { a: "180 83 9", at: "146 64 14", on: "255 255 255" },
    dark: { a: "251 191 36", at: "252 211 77", on: "28 18 4" },
  },
  {
    id: "gray",
    label: "Gray",
    dot: "#6b7280",
    light: { a: "71 85 105", at: "51 65 85", on: "255 255 255" },
    dark: { a: "148 163 184", at: "203 213 225", on: "15 23 42" },
  },
];

const DEFAULT_ACCENT = "indigo";
/** Glass is a 0–100 slider now. 50 ≈ the design's default frosting. */
const DEFAULT_GLASS = 50;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** Map the slider to fill-alpha + blur, per theme. The range is wide on both
   ends: nearly clear at 0, nearly solid at 100. */
function glassVars(pct: number, isDark: boolean): { alpha: number; blur: number } {
  const t = pct / 100;
  return isDark
    ? { alpha: lerp(0.12, 0.96, t), blur: lerp(6, 50, t) }
    : { alpha: lerp(0.18, 1, t), blur: lerp(6, 44, t) };
}

export function DesignSettings() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [glass, setGlass] = useState(DEFAULT_GLASS);
  const ref = useRef<HTMLDivElement>(null);

  // Load saved choices once.
  useEffect(() => {
    setMounted(true);
    try {
      const a = localStorage.getItem("design-accent");
      const g = localStorage.getItem("design-glass");
      if (a) setAccent(a);
      const n = g == null ? NaN : Number(g);
      if (Number.isFinite(n)) setGlass(clamp(n));
    } catch {}
  }, []);

  // Apply to <html> whenever a choice or the theme changes.
  useEffect(() => {
    if (!mounted) return;
    const isDark = resolvedTheme === "dark";
    const root = document.documentElement;

    const acc = ACCENTS.find((x) => x.id === accent) ?? ACCENTS[0];
    const tone = isDark ? acc.dark : acc.light;
    root.style.setProperty("--accent", tone.a);
    root.style.setProperty("--accent-text", tone.at);
    root.style.setProperty("--on-accent", tone.on);

    const { alpha, blur } = glassVars(glass, isDark);
    root.style.setProperty("--glass-fill-alpha", alpha.toFixed(3));
    root.style.setProperty("--glass-blur", `${Math.round(blur)}px`);
  }, [mounted, accent, glass, resolvedTheme]);

  // Only one overlay open at a time: close if another panel announces itself.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== "settings") setOpen(false);
    };
    window.addEventListener(OVERLAY_OPEN_EVENT, onOther);
    return () => window.removeEventListener(OVERLAY_OPEN_EVENT, onOther);
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const persist = (key: string, val: string) => {
    try {
      localStorage.setItem(key, val);
    } catch {}
  };

  const setGlassValue = (v: number) => {
    const n = clamp(v);
    setGlass(n);
    persist("design-glass", String(n));
  };

  const reset = () => {
    setAccent(DEFAULT_ACCENT);
    setGlass(DEFAULT_GLASS);
    persist("design-accent", DEFAULT_ACCENT);
    persist("design-glass", String(DEFAULT_GLASS));
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Appearance settings"
        aria-expanded={open}
        onClick={() =>
          setOpen((v) => {
            if (!v) announceOverlay("settings");
            return !v;
          })
        }
        className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-muted backdrop-blur-sm transition-colors duration-200 hover:border-accent hover:text-text"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {mounted && open ? (
        <div
          role="dialog"
          aria-label="Appearance settings"
          className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-white/20 bg-surface/90 p-4 shadow-2xl backdrop-blur-xl"
        >
          <p className="block-label">Accent</p>
          <div className="mt-2.5 flex gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-label={a.label}
                aria-pressed={accent === a.id}
                onClick={() => {
                  setAccent(a.id);
                  persist("design-accent", a.id);
                }}
                className={`focus-ring h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
                  accent === a.id
                    ? "border-white/80 ring-2 ring-accent ring-offset-2 ring-offset-transparent"
                    : "border-white/40"
                }`}
                style={{ backgroundColor: a.dot }}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="block-label">Glass</p>
            <span className="num font-mono text-[11px] text-muted">{glass}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={glass}
            onChange={(e) => setGlassValue(Number(e.target.value))}
            aria-label="Glass intensity"
            className="range-glass mt-2.5 w-full"
            style={{ ["--pct" as string]: `${glass}%` }}
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
            <span>Clear</span>
            <span>Solid</span>
          </div>

          <button
            type="button"
            onClick={reset}
            className="focus-ring mt-4 rounded-full text-[12px] text-muted underline decoration-white/30 underline-offset-2 transition-colors hover:text-text"
          >
            Reset to default
          </button>
        </div>
      ) : null}
    </div>
  );
}
