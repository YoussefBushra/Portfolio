import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { View } from "@/lib/view";
import { Portal, hexCorners, type PortalState } from "@/components/hero/portal";
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
 *  finale   ~0.8  a hexagonal gate forms around the portrait and powers up,
 *                 chevron by chevron; the room darkens; a portal spins open
 *                 on the face, showering sparks, with a warp tunnel inside;
 *                 the new photo arrives through it; it flares, and a
 *                 shockwave crosses the page.
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

/** Both photos decoded, and the portal layer holding (and decoded with) the
 *  photo of the other view. */
async function prepare() {
  const p = getPortraitRefs();
  if (!p) return;
  const imgs = Array.from(
    p.frame.querySelectorAll<HTMLImageElement>(".portrait-img"),
  );
  await Promise.all(imgs.map(whenDecoded));
  const other = photo(
    p,
    document.documentElement.dataset.view === "engineer"
      ? "recruiter"
      : "engineer",
  );
  p.portal.src = other?.currentSrc || other?.src || "";
  await p.portal.decode().catch(() => {});
}

/**
 * A real, full-opacity run of every effect — charge, sweep front, card panel,
 * wireframe, gate, portal, tunnel, sparks, flare, shockwave — played quickly
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
  const settle = p
    ? finale(
        tl,
        p,
        s.wave,
        0.1,
        other === "engineer" ? 1 : -1,
        hudRgb(other),
        mobile,
        dark,
        sparks,
      )
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
  const dir = to === "engineer" ? 1 : -1;
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
  const withFinale = !!p && !!pr && pr.bottom > top + 30 && pr.top < vh - 60;

  // The portal shows the photo we're switching to, decoded before we start.
  if (withFinale) {
    const incoming = photo(p, to);
    const src = incoming?.currentSrc || incoming?.src || "";
    if (p.portal.src !== src) p.portal.src = src;
    await p.portal.decode().catch(() => {});
  }

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
    settle = finale(tl, p, s.wave, C + D * 0.6, dir, rgb, mobile, dark, sparks);
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
 * The portrait finale, added to `tl` at `at`: the gate powers up, the portal
 * opens on a warp tunnel, the new photo arrives through it, flare. Returns
 * the clean-up.
 */
function finale(
  tl: gsap.core.Timeline,
  p: PortraitRefs,
  wave: HTMLElement | null,
  at: number,
  dir: number,
  rgb: string,
  mobile: boolean,
  dark: boolean,
  sparks: Sparks | null,
) {
  const { frame, stage, canvas, seal, portal } = p;
  const size = stage.getBoundingClientRect().width;
  const unit = size / 200; // seal units → px (the seal spans −100…100)
  const fw = frame.offsetWidth;
  const fh = frame.offsetHeight;
  const py = fh * PORTAL_Y;
  // The hexagon's inner radius must clear the frame's far corners.
  const rMax =
    (Math.max(Math.hypot(fw / 2, py), Math.hypot(fw / 2, fh - py)) + 2) /
    Math.cos(Math.PI / 6);

  const state: PortalState = {
    cx: size / 2,
    cy: size / 2,
    r: 0,
    rot: 0,
    ring: 0,
    tunnel: 0,
    dim: 0,
    rate: 0,
    spin: dir,
    // the stage is centred on the portal point of the frame
    frame: { x: size / 2 - fw / 2, y: size / 2 - py, w: fw, h: fh, radius: 16 },
  };
  const view = { zoom: 1.4 };
  stage.style.setProperty("--hud", `var(--hud-${dir > 0 ? "eng" : "rec"})`);

  // Sparks off the rim go to the page-wide field, in viewport coordinates.
  let origin = stage.getBoundingClientRect();
  const portalFx = new Portal(canvas, dark, (x, y, vx, vy) =>
    sparks?.f.emit(origin.left + x, origin.top + y, vx, vy, {
      g: 620,
      life: [0.35, 0.85],
    }),
  );
  portalFx.tint(rgb);
  const tick = (_t: number, ms: number) => {
    origin = stage.getBoundingClientRect();
    portalFx.frame(Math.min(ms, 50) / 1000, state);
  };
  /** A seal-space point (corner `i` at radius `r` units) in the viewport. */
  const at2vp = (i: number, r: number) => {
    const a = state.rot - Math.PI / 2 + (i * Math.PI) / 3;
    const o = stage.getBoundingClientRect();
    return [
      o.left + size / 2 + Math.cos(a) * r * unit,
      o.top + size / 2 + Math.sin(a) * r * unit,
    ] as const;
  };

  const rings = Array.from(seal.querySelectorAll<SVGElement>("[data-ring]"));
  const cores = Array.from(seal.querySelectorAll("path[data-core]"));
  const chevrons = Array.from(seal.querySelectorAll("[data-chevron]"));

  // The aperture on the photo, in frame px. The photo layer is zoomed about
  // the portal centre, so the clip is given in its own (unzoomed) units.
  gsap.set(portal, { transformOrigin: `50% ${PORTAL_Y * 100}%` });
  const clip = () => {
    const pts = hexCorners(fw / 2, py, state.r / view.zoom, state.rot)
      .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
      .join(",");
    portal.style.clipPath = `polygon(${pts})`;
  };

  // summon: the gate forms and powers up, chevron by chevron
  tl.add(() => {
    clip();
    portal.style.display = "block";
    gsap.set(stage, { autoAlpha: 1 });
    gsap.ticker.add(tick);
  }, at)
    .set(seal, { autoAlpha: 0, scale: 0.85 }, at)
    .set(
      seal.querySelectorAll("path[data-core], path[data-halo]"),
      {
        strokeDashoffset: 1,
      },
      at,
    )
    .set(chevrons, { autoAlpha: 0.12, scale: 1 }, at)
    .set(portal, { autoAlpha: 0, scale: view.zoom }, at)
    .to(state, { dim: 1, duration: 0.35, ease: "power2.out" }, at)
    .to(frame, { scale: 1.02, duration: 0.35, ease: "power2.out" }, at)
    .to(
      seal,
      { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" },
      at,
    )
    .to(
      state,
      {
        rot: (Math.PI / 3) * dir,
        duration: 1.3,
        ease: "power2.inOut",
        onUpdate: clip,
      },
      at,
    );
  // Lines draw on in random order, each with its halo (the path before it).
  cores.forEach((c) =>
    tl.to(
      [c.previousElementSibling, c],
      { strokeDashoffset: 0, duration: 0.42, ease: "power2.out" },
      at + Math.random() * 0.18,
    ),
  );
  // The chevrons lock one after another, each with a spit of sparks.
  chevrons.forEach((ch, i) => {
    const t = at + 0.14 + i * 0.05;
    tl.fromTo(
      ch,
      { autoAlpha: 0.12, scale: 1.6 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.16,
        ease: "power3.out",
        immediateRender: false,
      },
      t,
    ).call(
      () => {
        if (!sparks) return;
        // chevron i sits at the gate's corner i (the gate doesn't turn)
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        const o = stage.getBoundingClientRect();
        sparks.f.burst(
          o.left + size / 2 + Math.cos(a) * 95 * unit,
          o.top + size / 2 + Math.sin(a) * 95 * unit,
          mobile ? 6 : 12,
          240,
        );
      },
      undefined,
      t + 0.05,
    );
  });

  // open: the portal spins open on the face — a warp tunnel inside, sparks
  // showering off its rim
  const open = at + 0.46;
  tl.to(
    state,
    { ring: 1, tunnel: 1, rate: mobile ? 260 : 560, duration: 0.15 },
    open,
  ).to(
    state,
    { r: rMax * 0.42, duration: 0.32, ease: "power2.out", onUpdate: clip },
    open,
  );

  // arrive: the new photo comes through the tunnel as the portal widens
  const arrive = open + 0.32;
  tl.to(
    state,
    { r: rMax, duration: 0.5, ease: "power2.inOut", onUpdate: clip },
    arrive,
  )
    .to(portal, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, arrive)
    .to(
      view,
      {
        zoom: 1,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          gsap.set(portal, { scale: view.zoom });
          clip();
        },
      },
      arrive,
    )
    .to(state, { tunnel: 0, duration: 0.45, ease: "power1.in" }, arrive + 0.05);

  // flare + shockwave
  const flare = arrive + 0.55;
  tl.add(() => {
    if (sparks)
      for (let i = 0; i < 6; i++) {
        const [x, y] = at2vp(i, rMax / unit);
        sparks.f.burst(x, y, mobile ? 8 : 18, 420);
      }
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
  }, flare)
    .to(state, { ring: 0, rate: 0, duration: 0.3, ease: "power1.in" }, flare)
    .fromTo(
      frame,
      { filter: "brightness(1.35)" },
      {
        filter: "brightness(1)",
        scale: 1,
        duration: 0.55,
        ease: "power2.out",
        immediateRender: false,
      },
      flare,
    )
    .to(chevrons, { autoAlpha: 0, duration: 0.25 }, flare)
    .to(
      seal,
      { scale: 1.12, autoAlpha: 0, duration: 0.5, ease: "power2.in" },
      flare + 0.02,
    )
    .to(state, { dim: 0, duration: 0.65, ease: "power2.out" }, flare)
    // the wave is started from a callback: give it time to finish
    .set({}, {}, flare + 0.8);

  return () => {
    gsap.ticker.remove(tick);
    portalFx.clear();
    // The new photo is showing underneath now: drop the hold, then the portal.
    delete frame.dataset.hold;
    portal.style.display = "none";
    portal.style.clipPath = "";
    gsap.set(portal, { clearProps: "opacity,visibility,transform" });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(frame, { clearProps: "transform,filter" });
    // The flare leaves the (hidden) seal scaled — reset it so its box can't
    // widen the page.
    gsap.set([seal, ...rings, ...chevrons], {
      clearProps: "transform,opacity,visibility",
    });
  };
}
