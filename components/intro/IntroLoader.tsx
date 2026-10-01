"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";

const MIN_MS = 900;
const MAX_MS = 8000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The loader's steps and their share of the bar. */
const STEPS = [
  { key: "portraits", label: "portraits", weight: 0.35 },
  { key: "fonts", label: "typefaces", weight: 0.1 },
  { key: "engine", label: "engine", weight: 0.2 },
  { key: "effects", label: "effects", weight: 0.35 },
] as const;
type StepKey = (typeof STEPS)[number]["key"];

function whenDecoded(img: HTMLImageElement): Promise<void> {
  const decode = () => img.decode().catch(() => undefined);
  if (img.complete && img.naturalWidth) return decode();
  return new Promise<void>((resolve) => {
    const done = () => decode().then(resolve);
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * Covers the page on every load until everything the Recruiter ⇄ Engineer
 * transformation needs is ready — photos decoded, fonts, the effect code, and
 * a rehearsal of every effect behind the cover (see warmUp in transform.ts) —
 * so even the first switch runs smoothly. A segmented bar and a step log show
 * real progress; it leaves the way the switch moves: the cover lifts behind a
 * line of energy. Rendered on the server so it covers the page from the first
 * paint; hidden without JS.
 */
export function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const glint = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (html.dataset.intro === "done" || !el) return;
    html.classList.add("intro-lock");

    const start = performance.now();
    const progress: Record<StepKey, number> = {
      portraits: 0,
      fonts: 0,
      engine: 0,
      effects: 0,
    };
    const step = (key: StepKey, p: number, state?: "run" | "ok") => {
      progress[key] = Math.max(progress[key], Math.min(1, p));
      const li = el.querySelector<HTMLElement>(`[data-step="${key}"]`);
      if (li && state) li.dataset.state = state;
    };
    const target = () =>
      STEPS.reduce((sum, s) => sum + s.weight * progress[s.key], 0);

    // The shown value glides toward the real one, never ahead of it.
    let shown = 0;
    let last = start;
    let raf = 0;
    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      shown += (target() - shown) * Math.min(1, dt * 7);
      if (target() - shown < 0.002) shown = target();
      // (the weights sum to 1 within float error: snap the last bit)
      const v = shown > 0.995 ? 1 : shown;
      if (fill.current) fill.current.style.transform = `scaleX(${v})`;
      if (glint.current)
        glint.current.style.transform = `translateX(${v * 100}%)`;
      if (pct.current)
        pct.current.textContent = `${String(Math.floor(v * 100)).padStart(3, "0")}%`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const imgs = Array.from(
      document.querySelectorAll<HTMLImageElement>(".portrait-img"),
    );
    step("portraits", 0, "run");
    let loaded = 0;
    const images = Promise.all(
      imgs.map((img) =>
        whenDecoded(img).then(() =>
          step("portraits", ++loaded / Math.max(imgs.length, 1)),
        ),
      ),
    ).then(() => step("portraits", 1, "ok"));

    step("fonts", 0, "run");
    const fonts = document.fonts.ready.then(() => step("fonts", 1, "ok"));

    step("engine", 0, "run");
    const ready = images
      .then(() => import("@/components/view/transform"))
      .then((m) => {
        step("engine", 1, "ok");
        step("effects", 0, "run");
        return fonts.then(() => m.warmUp((p) => step("effects", p)));
      })
      .then(() => step("effects", 1, "ok"));

    let cancelled = false;
    (async () => {
      await Promise.race([Promise.all([images, fonts, ready]), sleep(MAX_MS)]);
      STEPS.forEach((s) => step(s.key, 1, "ok"));
      await sleep(Math.max(0, MIN_MS - (performance.now() - start)));
      // Let the bar arrive at 100 %, flash, then lift the cover.
      while (!cancelled && shown < 0.999) await sleep(30);
      if (cancelled) return;
      el.classList.add("intro-complete");
      await sleep(220);
      el.classList.add("intro-leaving");
      await sleep(720);
      if (cancelled) return;
      cancelAnimationFrame(raf);
      html.dataset.intro = "done";
      html.classList.remove("intro-lock");
      window.dispatchEvent(new Event("intro:done"));
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      html.classList.remove("intro-lock");
    };
  }, []);

  return (
    <div ref={root} className="intro" aria-hidden>
      <div className="intro-inner">
        <div className="intro-head">
          <svg viewBox="0 0 32 32" className="intro-mark">
            <rect width="32" height="32" rx="4" className="fill-text" />
            <rect
              x="5"
              y="9"
              width="22"
              height="4"
              rx="1"
              className="fill-accent"
            />
            <rect
              x="9"
              y="19"
              width="14"
              height="4"
              rx="1"
              className="fill-accent"
              opacity="0.55"
            />
          </svg>
          <div>
            <p className="intro-name">{profile.name}</p>
            <p className="intro-role">{profile.role}</p>
          </div>
        </div>

        <div className="intro-meter">
          <div className="intro-bar">
            <div className="intro-track" />
            <div ref={fill} className="intro-fill" />
          </div>
          <div className="intro-glint-rail">
            <div ref={glint} className="intro-glint" />
          </div>
          <span ref={pct} className="intro-pct">
            000%
          </span>
        </div>

        <ul className="intro-log">
          {STEPS.map((s) => (
            <li key={s.key} data-step={s.key} data-state="wait">
              <span>{s.label}</span>
              <i />
              <b />
            </li>
          ))}
        </ul>
      </div>
      <div className="intro-edge" />
    </div>
  );
}
