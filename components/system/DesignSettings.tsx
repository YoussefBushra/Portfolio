"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Lets the visitor retune the glass to taste: pick an accent and how heavy
 * the frosting sits. Choices are written as CSS variables on <html> and
 * persisted, so the whole token-driven design re-skins live. Accent and
 * glass values are theme-aware, re-applied whenever the theme flips.
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
];

type Glass = { id: string; label: string; light: [number, number]; dark: [number, number] };
// [fill-alpha, blur-px]
const GLASS: Glass[] = [
  { id: "subtle", label: "Subtle", light: [0.62, 16], dark: [0.05, 16] },
  { id: "medium", label: "Medium", light: [0.5, 26], dark: [0.1, 28] },
  { id: "heavy", label: "Heavy", light: [0.4, 36], dark: [0.14, 40] },
];

const DEFAULT_ACCENT = "indigo";
const DEFAULT_GLASS = "medium";

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
      if (g) setGlass(g);
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

    const gl = GLASS.find((x) => x.id === glass) ?? GLASS[1];
    const [alpha, blur] = isDark ? gl.dark : gl.light;
    root.style.setProperty("--glass-fill-alpha", String(alpha));
    root.style.setProperty("--glass-blur", `${blur}px`);
  }, [mounted, accent, glass, resolvedTheme]);

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

  const reset = () => {
    setAccent(DEFAULT_ACCENT);
    setGlass(DEFAULT_GLASS);
    persist("design-accent", DEFAULT_ACCENT);
    persist("design-glass", DEFAULT_GLASS);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Appearance settings"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
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

          <p className="block-label mt-4">Glass</p>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {GLASS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={glass === g.id}
                onClick={() => {
                  setGlass(g.id);
                  persist("design-glass", g.id);
                }}
                className={`focus-ring rounded-lg border px-2 py-1.5 text-[12px] font-medium transition-colors ${
                  glass === g.id
                    ? "border-accent bg-accent/15 text-text"
                    : "border-white/25 bg-white/5 text-muted hover:text-text"
                }`}
              >
                {g.label}
              </button>
            ))}
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
