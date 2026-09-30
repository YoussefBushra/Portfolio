"use client";

import { useEffect, useRef } from "react";

const SESSION_KEY = "yb.intro";
const MIN_MS = 700;
const MAX_MS = 8000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
 * First visit per session: the logo mark, large, with its two amber bars
 * filling as real progress — bar one for the two portraits, bar two for the
 * transformation (loaded and warmed up) and fonts — so the first Recruiter ⇄ Engineer switch never
 * waits on anything. Rendered on the server so it covers the page from the
 * first paint; skipped before paint on later loads (see the head script).
 */
export function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const bar1 = useRef<SVGRectElement>(null);
  const bar2 = useRef<SVGRectElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro === "done") return;
    html.classList.add("intro-lock");

    const start = performance.now();
    const setBar = (el: SVGRectElement | null, p: number) => {
      if (el) el.style.transform = `scaleX(${Math.min(1, p)})`;
    };

    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".portrait-img"));
    let p1 = 0;
    let p2 = 0;
    const images = Promise.all(
      imgs.map((img) =>
        whenDecoded(img).then(() => setBar(bar1.current, (p1 += 1 / Math.max(imgs.length, 1))))
      )
    );
    // The transformation's code, loaded and warmed up (photos decoded, effect
    // layers painted once) so the first switch runs as smoothly as any other.
    const assets = Promise.all([
      images
        .then(() => import("@/components/view/transform"))
        .then((m) => m.prewarm())
        .then(() => setBar(bar2.current, (p2 += 0.5))),
      document.fonts.ready.then(() => setBar(bar2.current, (p2 += 0.5))),
    ]);

    let cancelled = false;
    (async () => {
      await Promise.race([Promise.all([images, assets]), sleep(MAX_MS)]);
      await sleep(Math.max(0, MIN_MS - (performance.now() - start)));
      if (cancelled) return;
      setBar(bar1.current, 1);
      setBar(bar2.current, 1);
      await sleep(260);
      root.current?.classList.add("intro-leaving");
      await sleep(520);
      if (cancelled) return;
      html.dataset.intro = "done";
      html.classList.remove("intro-lock");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // storage blocked: the intro simply shows again next load
      }
      window.dispatchEvent(new Event("intro:done"));
    })();

    return () => {
      cancelled = true;
      html.classList.remove("intro-lock");
    };
  }, []);

  return (
    <div ref={root} className="intro" aria-hidden>
      <div className="intro-inner">
        <svg viewBox="0 0 32 32" className="intro-mark">
          <rect width="32" height="32" rx="4" className="fill-text" />
          {/* Tracks, then the fills that grow with real progress. */}
          <rect x="5" y="9" width="22" height="4" rx="1" className="fill-accent" opacity="0.22" />
          <rect x="9" y="19" width="14" height="4" rx="1" className="fill-accent" opacity="0.14" />
          <rect ref={bar1} x="5" y="9" width="22" height="4" rx="1" className="intro-bar fill-accent" />
          <rect
            ref={bar2}
            x="9"
            y="19"
            width="14"
            height="4"
            rx="1"
            className="intro-bar fill-accent"
            opacity="0.55"
          />
        </svg>
        <p className="intro-name">Youssef Bushra</p>
      </div>
    </div>
  );
}
