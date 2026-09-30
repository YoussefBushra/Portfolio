import type { View } from "@/lib/view";
import { Sparks, type PortalState } from "./sparks";

export interface CastRefs {
  /** The portrait frame (the two photos live inside it). */
  frame: HTMLElement;
  /** Square stage centred on the portal: holds the canvas and the seal. */
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  /** The seal: a wrapper around three ring <svg>s (data-ring). */
  sigil: HTMLElement;
  /** An <img> above the photos that shows the other side through the portal. */
  portal: HTMLImageElement;
  /** Fixed-position shockwave ring. */
  wave: HTMLElement;
}

/** Where the portal opens inside the frame: roughly the face. */
export const PORTAL_Y = 0.42;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The spell, ≈1.8 s:
 *  summon   0.00  seal draws itself on and starts turning; the room darkens
 *  portal   0.30  a ring of sparks spins open; the other self shows through it
 *  commit   1.00  the view flips (page layers follow); the seal flares out
 *  wave     1.00  a shockwave ring crosses the page
 *  settle  →1.8   last sparks die, the dim lifts
 * Clockwise into Engineer, counter-clockwise back to Recruiter.
 */
export async function cast(refs: CastRefs, to: View, commit: () => void) {
  const { gsap } = await import("gsap");
  const { frame, stage, canvas, sigil, portal, wave } = refs;

  const dir = to === "engineer" ? 1 : -1;
  const mobile = window.innerWidth < 640;
  const dark = document.documentElement.classList.contains("dark");

  // The portal shows the photo we're travelling to, already decoded.
  const incoming = frame.querySelector<HTMLImageElement>(
    to === "engineer" ? ".portrait-eng" : ".portrait-rec"
  );
  if (incoming) {
    portal.src = incoming.currentSrc || incoming.src;
    await portal.decode().catch(() => undefined);
  }

  // Geometry. The stage is a square centred on the portal point.
  const f = frame.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const c = sr.width / 2;
  const py = f.height * PORTAL_Y;
  const rMax =
    Math.max(
      Math.hypot(f.width / 2, py),
      Math.hypot(f.width / 2, f.height - py)
    ) + 2;

  const state: PortalState = { cx: c, cy: c, r: 0, ring: 0, dim: 0, rate: 0, spin: dir };
  gsap.set(stage, { autoAlpha: 1 });
  const sparks = new Sparks(canvas, dark, mobile ? 170 : 340);

  const clip = () => {
    portal.style.clipPath = `circle(${state.r}px at 50% ${PORTAL_Y * 100}%)`;
  };
  clip();
  portal.style.display = "block";

  const strokes = sigil.querySelectorAll("circle, rect, path");
  const rings = {
    outer: sigil.querySelector('[data-ring="outer"]'),
    middle: sigil.querySelector('[data-ring="middle"]'),
    inner: sigil.querySelector('[data-ring="inner"]'),
  };

  const tick = (_t: number, deltaMs: number) => sparks.frame(Math.min(deltaMs, 50) / 1000, state);
  gsap.ticker.add(tick);

  // Shockwave: fixed ring centred on the portal, big enough to cross the viewport.
  const vx = f.left + f.width / 2;
  const vy = f.top + py;
  const reach = Math.hypot(Math.max(vx, innerWidth - vx), Math.max(vy, innerHeight - vy));
  gsap.set(wave, { left: vx - 60, top: vy - 60, scale: 0, autoAlpha: 0 });

  const tl = gsap.timeline();

  // 1 · summon
  tl.set(sigil, { autoAlpha: 0, scale: 0.55 }, 0)
    .set(strokes, { strokeDashoffset: 1 }, 0)
    .to(state, { dim: 1, duration: 0.35, ease: "power2.out" }, 0)
    .to(frame, { scale: 1.025, duration: 0.35, ease: "power2.out" }, 0)
    .to(sigil, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 0)
    .to(
      strokes,
      { strokeDashoffset: 0, duration: 0.55, ease: "power2.out", stagger: { amount: 0.3, from: "random" } },
      0.02
    )
    .to(rings.outer, { rotation: 110 * dir, duration: 1.8, ease: "power1.inOut" }, 0)
    .to(rings.middle, { rotation: -150 * dir, duration: 1.8, ease: "power1.inOut" }, 0)
    .to(rings.inner, { rotation: 220 * dir, duration: 1.8, ease: "power1.inOut" }, 0);

  // 2 · portal
  tl.to(state, { ring: 1, rate: mobile ? 260 : 540, duration: 0.15 }, 0.3).to(
    state,
    { r: rMax, duration: 0.7, ease: "power2.inOut", onUpdate: clip },
    0.3
  );

  // 3 · commit + flare
  tl.add(() => {
    commit();
    sparks.burst(state.cx, state.cy, rMax * 0.85, mobile ? 40 : 90);
  }, 1.0)
    .to(state, { ring: 0, rate: 0, duration: 0.3, ease: "power1.in" }, 1.0)
    .fromTo(frame, { filter: "brightness(1.35)" }, { filter: "brightness(1)", scale: 1, duration: 0.55, ease: "power2.out" }, 1.0)
    .to(sigil, { scale: 1.4, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 1.02)
    .to(state, { dim: 0, duration: 0.65, ease: "power2.out" }, 1.0);

  // 4 · shockwave
  tl.fromTo(
    wave,
    { scale: 0, autoAlpha: 0.95 },
    { scale: (reach * 2) / 120, autoAlpha: 0, duration: 0.8, ease: "power2.out" },
    1.0
  );

  await new Promise<void>((resolve) => tl.eventCallback("onComplete", () => resolve()));

  // 5 · settle: let the last sparks fall, then put everything back.
  const until = performance.now() + 700;
  while (sparks.active && performance.now() < until) await wait(50);

  gsap.ticker.remove(tick);
  sparks.clear();
  portal.style.display = "none";
  portal.style.clipPath = "";
  gsap.set(stage, { autoAlpha: 0 });
  gsap.set(frame, { clearProps: "transform,filter" });
  gsap.set(Object.values(rings), { clearProps: "transform" });
  // The flare leaves the (hidden) seal at 1.4× — reset it so its box can't
  // widen the page.
  gsap.set(sigil, { clearProps: "transform" });
  gsap.set(wave, { autoAlpha: 0 });
}
