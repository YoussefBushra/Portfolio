import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { View } from "@/lib/view";
import { Sparks, type PortalState } from "@/components/hero/sparks";
import { getPortraitRefs, type PortraitRefs } from "./portraitRefs";
import { captureLayout, deRender, leavingBlocks, renderAfter } from "./pageFx";

gsap.registerPlugin(Flip);

/**
 * The view switch as one transformation of the whole page — the "surge".
 * Everything arrives in the colour of the view being switched to.
 *
 *  charge   0.00  energy runs along the nav's bottom edge, out from the switch
 *                 (→ Recruiter: technical blocks on screen collapse meanwhile)
 *  commit   C     the view flips; the accent changes
 *  sweep    C→    an energy front sweeps down the screen; cards glide into
 *                 their new layout, and sections and new blocks render as the
 *                 front passes them. The portrait holds its old photo.
 *  finale   ~1.0  the energy gathers in the portrait: a seal forms, the room
 *                 darkens, a ring of plasma spins open and the new photo breaks
 *                 through it; it flares, and a shockwave crosses the page.
 *
 * With the portrait scrolled away there is no finale (nobody would see it);
 * with reduced motion the switch is instant (see Transformation.tsx).
 */

const PORTAL_Y = 0.42; // where the portal opens: roughly the face
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const frames = (n: number) =>
  new Promise<void>((resolve) => {
    const step = () => (--n <= 0 ? resolve() : requestAnimationFrame(step));
    requestAnimationFrame(step);
  });
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

let warm: Promise<void> | null = null;

/**
 * Everything the first switch would otherwise pay for mid-animation: both
 * photos decoded, the portal layer decoded, and every effect layer painted
 * once (invisibly) so it is already rasterised and composited. Run while the
 * intro covers the page, or when idle if the intro was skipped.
 */
export function prewarm(): Promise<void> {
  return (warm ??= (async () => {
    const p = getPortraitRefs();
    const s = surgeEls();
    if (p) {
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
    const layers = [
      p?.stage,
      p?.seal,
      p?.portal,
      s.charge,
      s.front,
      s.wave,
    ].filter(Boolean) as HTMLElement[];
    gsap.set(layers, { visibility: "visible", opacity: 0.001 });
    if (p) gsap.set(p.portal, { display: "block" });
    if (p) new Sparks(p.canvas, false, 1).clear();
    Flip.getState("[data-flip]");
    await frames(3);
    gsap.set(layers, { clearProps: "visibility,opacity,display" });
  })());
}

export async function transform(to: View, commit: () => void) {
  await prewarm();

  const root = document.documentElement;
  const from: View = to === "engineer" ? "recruiter" : "engineer";
  const dir = to === "engineer" ? 1 : -1;
  const rgb = hudRgb(to);
  const mobile = window.innerWidth < 640;
  const dark = root.classList.contains("dark");
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

  // 1 · charge
  if (s.charge)
    tl.set(
      s.charge,
      {
        top: top - 1,
        transformOrigin: `${switchX(to)}px 50%`,
        scaleX: 0,
        autoAlpha: 1,
      },
      0,
    ).to(s.charge, { scaleX: 1, duration: C, ease: "power2.out" }, 0);
  if (leaving.length) jobs.push(deRender(gsap, to, leaving, C));

  // 2 · commit + sweep
  tl.add(() => {
    const layout = captureLayout(Flip);
    if (withFinale) p.frame.dataset.hold = from;
    commit();
    jobs.push(renderAfter(gsap, Flip, to, layout, D, reach));
  }, C);
  if (s.charge)
    tl.to(s.charge, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, C);
  if (s.front)
    tl.set(s.front, { y: top - frontH, autoAlpha: 1 }, C)
      .to(s.front, { y: edgeEnd - frontH, duration: D, ease: "none" }, C)
      .to(s.front, { autoAlpha: 0, duration: 0.18 }, C + D - 0.12);

  // 3 · finale
  let settle = async () => {};
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
    settle = finale(tl, p, s.wave, C + D * 0.6, dir, rgb, mobile, dark);
  }

  await finished(tl);
  await Promise.all(jobs);
  await settle();

  gsap.set([s.charge, s.front, s.wave], { autoAlpha: 0 });
  delete root.dataset.casting;
}

/**
 * The portrait finale, added to `tl` at `at`. Returns the clean-up, which lets
 * the last sparks die out first.
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
) {
  const { frame, stage, canvas, seal, portal } = p;
  const size = stage.getBoundingClientRect().width;
  const fw = frame.offsetWidth;
  const fh = frame.offsetHeight;
  const py = fh * PORTAL_Y;
  const rMax =
    Math.max(Math.hypot(fw / 2, py), Math.hypot(fw / 2, fh - py)) + 2;

  const state: PortalState = {
    cx: size / 2,
    cy: size / 2,
    r: 0,
    ring: 0,
    dim: 0,
    rate: 0,
    spin: dir,
  };
  stage.style.setProperty("--hud", `var(--hud-${dir > 0 ? "eng" : "rec"})`);
  const sparks = new Sparks(canvas, dark, mobile ? 160 : 320);
  sparks.tint(rgb);
  const tick = (_t: number, deltaMs: number) =>
    sparks.frame(Math.min(deltaMs, 50) / 1000, state);
  const clip = () => {
    portal.style.clipPath = `circle(${state.r}px at 50% ${PORTAL_Y * 100}%)`;
  };

  const rings = Array.from(seal.querySelectorAll<SVGElement>("[data-ring]"));
  const [outer, middle, inner, core] = rings;
  const cores = Array.from(seal.querySelectorAll("path[data-core]"));
  const nodes = seal.querySelectorAll("[data-node]");

  // summon: the seal forms, the room darkens
  tl.add(() => {
    clip();
    portal.style.display = "block";
    gsap.set(stage, { autoAlpha: 1 });
    gsap.ticker.add(tick);
  }, at)
    .set(seal, { autoAlpha: 0, scale: 0.55 }, at)
    .set(seal.querySelectorAll("path"), { strokeDashoffset: 1 }, at)
    .set(nodes, { autoAlpha: 0, scale: 0 }, at)
    .to(state, { dim: 1, duration: 0.35, ease: "power2.out" }, at)
    .to(frame, { scale: 1.025, duration: 0.35, ease: "power2.out" }, at)
    .to(
      seal,
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
      at,
    )
    .to(
      nodes,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.25,
        ease: "back.out(3)",
        stagger: 0.04,
      },
      at + 0.3,
    )
    .to(outer, { rotation: 110 * dir, duration: 1.7, ease: "power1.inOut" }, at)
    .to(
      middle,
      { rotation: -150 * dir, duration: 1.7, ease: "power1.inOut" },
      at,
    )
    .to(inner, { rotation: 220 * dir, duration: 1.7, ease: "power1.inOut" }, at)
    .to(core, { rotation: -60 * dir, duration: 1.7, ease: "power2.inOut" }, at);
  // Lines draw on in random order, each with its halo (the path before it).
  cores.forEach((c) =>
    tl.to(
      [c.previousElementSibling, c],
      { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
      at + 0.02 + Math.random() * 0.25,
    ),
  );

  // portal: a ring of plasma spins open and the new photo shows through
  tl.to(
    state,
    { ring: 1, rate: mobile ? 240 : 500, duration: 0.15 },
    at + 0.3,
  ).to(
    state,
    { r: rMax, duration: 0.65, ease: "power2.inOut", onUpdate: clip },
    at + 0.3,
  );

  // flare + shockwave
  const flare = at + 0.95;
  tl.add(() => {
    sparks.burst(state.cx, state.cy, rMax * 0.85, mobile ? 40 : 90);
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
    .to(
      seal,
      { scale: 1.4, autoAlpha: 0, duration: 0.6, ease: "power2.in" },
      flare + 0.02,
    )
    .to(state, { dim: 0, duration: 0.65, ease: "power2.out" }, flare)
    // the wave is started from a callback: give it time to finish
    .set({}, {}, flare + 0.8);

  return async () => {
    const until = performance.now() + 600;
    while (sparks.active && performance.now() < until) await wait(50);
    gsap.ticker.remove(tick);
    sparks.clear();
    // The new photo is showing underneath now: drop the hold, then the portal.
    delete frame.dataset.hold;
    portal.style.display = "none";
    portal.style.clipPath = "";
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(frame, { clearProps: "transform,filter" });
    // The flare leaves the (hidden) seal at 1.4× — reset it so its box can't
    // widen the page.
    gsap.set([seal, ...rings, ...Array.from(nodes)], {
      clearProps: "transform,opacity,visibility",
    });
  };
}
