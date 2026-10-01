import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { View } from "@/lib/view";
import { Hologram, type HoloState } from "@/components/hero/hologram";
import { getPortraitRefs, type PortraitRefs } from "./portraitRefs";
import { SparkField } from "./sparkField";
import {
  captureCards,
  captureHeights,
  captureLayout,
  deRender,
  leavingBlocks,
  rehearsePage,
  renderAfter,
} from "./pageFx";

gsap.registerPlugin(Flip);

/**
 * The view switch as one transformation of the whole page — the "surge".
 * Everything arrives in the colour of the view being switched to, and sparks
 * fly throughout.
 *
 *  charge   0.00  energy runs along the nav's bottom edge, out from the
 *                 switch, sparks spitting from its tips (→ Recruiter:
 *                 technical blocks on screen collapse meanwhile)
 *  commit   C     the view flips; the accent changes
 *  sweep    C→    an energy front sweeps down the screen shedding sparks;
 *                 cards re-flow and land in a spray of sparks, and sections
 *                 and new blocks render as the front passes them. The
 *                 portrait holds its old photo.
 *  finale   ~0.8  the portrait becomes a hologram: brackets lock on and it
 *                 takes a holographic tint; a scan beam sweeps down and the
 *                 old photo derezzes into scanlines; it sweeps back up and
 *                 the new photo materialises line by line, sparks spraying
 *                 from the beam; the tint flickers out, and a shockwave
 *                 crosses the page.
 *
 * With the portrait scrolled away there is no finale (nobody would see it);
 * with reduced motion the switch is instant (see Transformation.tsx).
 */

const PORTAL_Y = 0.42; // where the portal opens: roughly the face
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const finished = (tl: gsap.core.Timeline) =>
  new Promise<void>((resolve) =>
    tl.eventCallback("onComplete", () => resolve()),
  );

function surgeEls() {
  const q = (c: string) =>
    document.querySelector<HTMLElement>(`.surge${c ? `-${c}` : ""}`);
  return {
    root: q(""),
    charge: q("charge"),
    front: q("front"),
    wave: q("wave"),
  };
}

let field: SparkField | null = null;

/** The page-wide spark field, ticking until its last spark has died. */
function startSparks(rgb: string, dark: boolean, mobile: boolean) {
  const canvas = document.querySelector<HTMLCanvasElement>(".surge-sparks");
  if (!canvas) return null;
  field ??= new SparkField(canvas);
  const f = field;
  f.begin(rgb, dark, mobile ? 360 : 900);
  const spawners: ((dt: number) => void)[] = [];
  const tick = (_t: number, ms: number) => {
    const dt = Math.min(ms, 50) / 1000;
    spawners.forEach((s) => s(dt));
    f.frame(dt);
  };
  gsap.ticker.add(tick);
  return {
    f,
    /** Run `spawn` `rate` times a second while `on()` holds. */
    every(rate: number, on: () => boolean, spawn: () => void) {
      let carry = 0;
      spawners.push((dt) => {
        if (!on()) return;
        carry += rate * dt;
        for (; carry >= 1; carry--) spawn();
      });
    },
    async stop(linger = 800) {
      const until = performance.now() + linger;
      while (f.active && performance.now() < until) await wait(50);
      gsap.ticker.remove(tick);
      f.clear();
    },
  };
}
type Sparks = NonNullable<ReturnType<typeof startSparks>>;

function hudRgb(to: View) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(to === "engineer" ? "--hud-eng" : "--hud-rec")
    .trim();
}

/** The x the charge runs out from: the visible switch option. */
function switchX(to: View) {
  for (const el of document.querySelectorAll(`.view-opt-${to}`)) {
    const r = el.getBoundingClientRect();
    if (r.width) return r.left + r.width / 2;
  }
  return window.innerWidth / 2;
}

function whenDecoded(img: HTMLImageElement) {
  if (img.complete && img.naturalWidth) return img.decode().catch(() => {});
  return new Promise<void>((resolve) => {
    img.addEventListener(
      "load",
      () =>
        void img
          .decode()
          .catch(() => {})
          .then(resolve),
      { once: true },
    );
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

function photo(p: PortraitRefs, v: View) {
  return p.frame.querySelector<HTMLImageElement>(
    v === "engineer" ? ".portrait-eng" : ".portrait-rec",
  );
}

/** Decoded copies of both photos for the hologram to draw. Plain copies of
 *  what the page loaded (from cache): a srcset <img> reports a
 *  density-corrected naturalWidth, which would throw off the cover crop. */
const copies: Partial<Record<View, HTMLImageElement>> = {};

async function prepare() {
  const p = getPortraitRefs();
  if (!p) return;
  await Promise.all(
    (["recruiter", "engineer"] as const).map(async (v) => {
      const img = photo(p, v);
      if (!img) return;
      await whenDecoded(img);
      const copy = new Image();
      copy.src = img.currentSrc || img.src;
      await copy.decode().catch(() => {});
      if (copy.naturalWidth) copies[v] = copy;
    }),
  );
}

/**
 * A real, full-opacity run of every effect — charge, sweep front, card panel,
 * wireframe, hologram, sparks, shockwave — played quickly
 * behind the intro cover. A first switch otherwise pays mid-animation for
 * rasterising those layers and compiling their GPU shaders (clip-path, mask,
 * filter, canvas); an invisible warm-up doesn't help, as browsers skip
 * painting what can't be seen. Nothing is committed.
 */
async function rehearse(onProgress?: (p: number) => void) {
  const root = document.documentElement;
  const p = getPortraitRefs();
  const s = surgeEls();
  const other: View =
    root.dataset.view === "engineer" ? "recruiter" : "engineer";
  const vh = window.innerHeight;
  const mobile = window.innerWidth < 640;
  const dark = root.classList.contains("dark");

  root.dataset.rehearsing = "";
  s.root?.style.setProperty(
    "--hud",
    `var(--hud-${other === "engineer" ? "eng" : "rec"})`,
  );
  const sparks = startSparks(hudRgb(other), dark, mobile);
  sparks?.f.burst(window.innerWidth / 2, vh / 2, 40);
  const tl = gsap.timeline({ paused: true });
  if (s.charge)
    tl.fromTo(
      s.charge,
      { top: 55, scaleX: 0, autoAlpha: 1 },
      { scaleX: 1, duration: 0.3 },
      0,
    ).set(s.charge, { autoAlpha: 0 }, 0.4);
  if (s.front)
    tl.fromTo(
      s.front,
      { y: -150, autoAlpha: 1 },
      { y: vh, duration: 0.8, ease: "none" },
      0,
    ).set(s.front, { autoAlpha: 0 });
  const undoPage = rehearsePage(gsap, Flip, tl, other);
  const current: View = other === "engineer" ? "recruiter" : "engineer";
  const settle = p
    ? finale(tl, p, s.wave, 0.1, current, other, hudRgb(other), dark, sparks)
    : () => {};
  tl.eventCallback("onUpdate", () => onProgress?.(tl.progress()));
  tl.timeScale(2.6).play();
  await finished(tl);
  settle();
  await sparks?.stop(0);
  undoPage();
  gsap.set([s.charge, s.front, s.wave], { autoAlpha: 0 });
  delete root.dataset.rehearsing;
  onProgress?.(1);
}

let warm: Promise<void> | null = null;

/**
 * Everything the first switch would otherwise pay for mid-animation. The
 * intro loader runs it (reporting progress) while it covers the page; if the
 * page came up without the intro, it runs when idle.
 */
export function warmUp(onProgress?: (p: number) => void): Promise<void> {
  return (warm ??= (async () => {
    await prepare();
    onProgress?.(0.05);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduce) await rehearse((v) => onProgress?.(0.05 + v * 0.95));
    onProgress?.(1);
  })());
}

export async function transform(to: View, commit: () => void) {
  await warmUp();

  const root = document.documentElement;
  const from: View = to === "engineer" ? "recruiter" : "engineer";
  const rgb = hudRgb(to);
  const mobile = window.innerWidth < 640;
  const dark = root.classList.contains("dark");
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top =
    document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;

  const s = surgeEls();
  const p = getPortraitRefs();
  const pr = p?.frame.getBoundingClientRect();
  const withFinale =
    !!p &&
    !!pr &&
    pr.bottom > top + 30 &&
    pr.top < vh - 60 &&
    !!copies[from] &&
    !!copies[to];

  root.dataset.casting = "";
  s.root?.style.setProperty(
    "--hud",
    `var(--hud-${to === "engineer" ? "eng" : "rec"})`,
  );
  const sparks = startSparks(rgb, dark, mobile);

  const leaving = leavingBlocks(to);
  const C = leaving.length ? 0.42 : 0.26; // charge
  const D = mobile ? 0.7 : 0.85; // sweep
  const frontH = s.front?.offsetHeight ?? 0;
  const edgeEnd = vh + 8;
  /** Seconds after the commit until the front's edge reaches viewport y. */
  const reach = (y: number) =>
    Math.max(0, Math.min(1, (y - top) / (edgeEnd - top))) * D;

  const tl = gsap.timeline();
  const jobs: Promise<void>[] = [];
  // The switch shows how far along the transformation is.
  tl.eventCallback("onUpdate", () =>
    root.style.setProperty("--switch-progress", tl.progress().toFixed(3)),
  );

  // 1 · charge — sparks spit from both running tips
  const x0 = switchX(to);
  if (s.charge) {
    const charge = s.charge;
    tl.set(
      charge,
      {
        top: top - 1,
        transformOrigin: `${x0}px 50%`,
        scaleX: 0,
        autoAlpha: 1,
      },
      0,
    ).to(charge, { scaleX: 1, duration: C, ease: "power2.out" }, 0);
    sparks?.every(
      mobile ? 140 : 300,
      () => tl.time() < C,
      () => {
        const k = gsap.getProperty(charge, "scaleX") as number;
        const side = Math.random() < 0.5 ? -1 : 1;
        const x = side < 0 ? x0 * (1 - k) : x0 + (vw - x0) * k;
        sparks.f.emit(
          x,
          top,
          side * (60 + Math.random() * 240),
          -30 + Math.random() * 140,
          { g: 950, life: [0.25, 0.55] },
        );
      },
    );
  }
  if (leaving.length) jobs.push(deRender(gsap, to, leaving, C));

  // 2 · commit + sweep — the front sheds sparks as it travels
  tl.add(() => {
    const layout = captureLayout(Flip);
    const heights = captureHeights();
    const cards = captureCards();
    if (withFinale) p.frame.dataset.hold = from;
    commit();
    jobs.push(
      renderAfter(
        gsap,
        Flip,
        to,
        layout,
        heights,
        cards,
        D,
        reach,
        sparks ? (x, y, n) => sparks.f.burst(x, y, n, 260) : undefined,
      ),
    );
  }, C);
  if (s.charge)
    tl.to(s.charge, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, C);
  if (s.front) {
    const front = s.front;
    tl.set(front, { y: top - frontH, autoAlpha: 1 }, C)
      .to(front, { y: edgeEnd - frontH, duration: D, ease: "none" }, C)
      .to(front, { autoAlpha: 0, duration: 0.18 }, C + D - 0.12);
    sparks?.every(
      mobile ? 120 : 280,
      () => tl.time() > C && tl.time() < C + D - 0.05,
      () => {
        const y = (gsap.getProperty(front, "y") as number) + frontH;
        sparks.f.emit(
          Math.random() * vw,
          y,
          (Math.random() - 0.5) * 260,
          30 + Math.random() * 280,
          { g: 700, life: [0.2, 0.5] },
        );
      },
    );
  }

  // 3 · finale
  let settle = () => {};
  if (withFinale) {
    // The portrait takes a hit of energy as the front crosses it…
    tl.fromTo(
      p.frame,
      { filter: "brightness(1.3)" },
      {
        filter: "brightness(1)",
        duration: 0.35,
        ease: "power2.out",
        immediateRender: false,
      },
      C + reach(pr.top + pr.height * PORTAL_Y),
    );
    // …and transforms as the sweep finishes.
    settle = finale(tl, p, s.wave, C + D * 0.6, from, to, rgb, dark, sparks);
  }

  await finished(tl);
  await Promise.all(jobs);
  settle();
  gsap.set([s.charge, s.front, s.wave], { autoAlpha: 0 });
  delete root.dataset.casting;
  // The last sparks fall after the switch is done; nothing waits on them.
  void sparks?.stop();
}

/**
 * The portrait finale, added to `tl` at `at`: the portrait becomes a
 * hologram, derezzes and rematerialises as the other photo. Returns the
 * clean-up.
 */
function finale(
  tl: gsap.core.Timeline,
  p: PortraitRefs,
  wave: HTMLElement | null,
  at: number,
  from: View,
  to: View,
  rgb: string,
  dark: boolean,
  sparks: Sparks | null,
) {
  const a = copies[from];
  const b = copies[to];
  if (!a || !b) return () => {};
  const { frame, stage, canvas } = p;
  const size = stage.getBoundingClientRect().width;
  const fw = frame.offsetWidth;
  const fh = frame.offsetHeight;
  // The stage is a square centred on the face (PORTAL_Y down the frame).
  const rect = {
    x: size / 2 - fw / 2,
    y: size / 2 - fh * PORTAL_Y,
    w: fw,
    h: fh,
    radius: 16,
  };

  // Sparks from the beam go to the page-wide field, in viewport coordinates.
  let origin = stage.getBoundingClientRect();
  const holo = new Hologram(canvas, dark, rect, a, b, (x, y, vx, vy) =>
    sparks?.f.emit(origin.left + x, origin.top + y, vx, vy, {
      g: 700,
      life: [0.25, 0.6],
    }),
  );
  holo.tint(rgb);
  const s: HoloState = {
    dim: 0,
    lock: 0,
    tint: 0,
    beam: 0,
    beamOn: 0,
    mode: "old",
  };
  const tick = (_t: number, ms: number) => {
    origin = stage.getBoundingClientRect();
    holo.frame(Math.min(ms, 50) / 1000, s);
  };
  /** A spit of sparks from each corner of the frame. */
  const corners = (n: number, speed: number) => {
    if (!sparks) return;
    const r = frame.getBoundingClientRect();
    for (const [x, y] of [
      [r.left, r.top],
      [r.right, r.top],
      [r.left, r.bottom],
      [r.right, r.bottom],
    ])
      sparks.f.burst(x, y, n, speed);
  };

  // lock on: brackets fly in, the photo takes the holographic tint
  tl.add(() => {
    gsap.set(stage, { autoAlpha: 1 });
    gsap.ticker.add(tick);
  }, at)
    .to(s, { dim: 1, duration: 0.35, ease: "power2.out" }, at)
    .to(s, { lock: 1, duration: 0.3, ease: "power3.out" }, at)
    .to(s, { tint: 1, duration: 0.25, ease: "power1.out" }, at + 0.05)
    .call(() => corners(5, 200), undefined, at + 0.27);

  // derez: the beam sweeps down, the old photo breaks into scanlines
  const down = at + 0.32;
  tl.set(s, { mode: "out", beam: -0.06 }, down)
    .to(s, { beamOn: 1, duration: 0.1 }, down)
    .to(s, { beam: 1.12, duration: 0.5, ease: "power1.inOut" }, down);

  // materialise: the beam sweeps back up, building the new photo
  const up = down + 0.56;
  tl.set(s, { mode: "in" }, up).to(
    s,
    { beam: -0.12, duration: 0.6, ease: "power1.inOut" },
    up,
  );

  // resolve: the tint flickers out; flare and shockwave
  const done = up + 0.62;
  tl.set(s, { mode: "new" }, done)
    .to(s, { beamOn: 0, duration: 0.15 }, done)
    .to(
      s,
      {
        keyframes: [
          { tint: 0.45, duration: 0.05 },
          { tint: 0.9, duration: 0.05 },
          { tint: 0.2, duration: 0.06 },
          { tint: 0.6, duration: 0.05 },
          { tint: 0, duration: 0.22 },
        ],
      },
      done,
    )
    .to(s, { lock: 0, duration: 0.35, ease: "power2.in" }, done + 0.12)
    .to(s, { dim: 0, duration: 0.5, ease: "power2.out" }, done)
    .add(() => {
      corners(12, 380);
      if (!wave) return;
      const f = frame.getBoundingClientRect();
      const vx = f.left + f.width / 2;
      const vy = f.top + f.height * PORTAL_Y;
      const reach = Math.hypot(
        Math.max(vx, window.innerWidth - vx),
        Math.max(vy, window.innerHeight - vy),
      );
      gsap.fromTo(
        wave,
        { x: vx - 60, y: vy - 60, scale: 0, autoAlpha: 0.95 },
        {
          scale: (reach * 2) / 120,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
        },
      );
    }, done)
    // the wave is started from a callback: give it time to finish
    .set({}, {}, done + 0.8);

  return () => {
    gsap.ticker.remove(tick);
    // The canvas shows the new photo exactly as the page will: clear it and
    // drop the hold in the same frame.
    holo.clear();
    delete frame.dataset.hold;
    gsap.set(stage, { autoAlpha: 0 });
  };
}
