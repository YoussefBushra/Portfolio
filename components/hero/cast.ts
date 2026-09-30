import type { View } from "@/lib/view";
import {
  captureLayout,
  deRender,
  recompileAfter,
} from "@/components/view/recompilePage";
import { TileRebuild } from "./tiles";

export interface CastRefs {
  /** The portrait frame; holds both photos and the tile canvas. */
  frame: HTMLElement;
  /** Square stage centred on the face; holds the reticle. */
  stage: HTMLElement;
  /** Canvas over the photos, used while the portrait rebuilds. */
  canvas: HTMLCanvasElement;
  /** The HUD reticle (see Reticle.tsx). */
  reticle: HTMLElement;
}

async function loadGsap() {
  const [{ gsap }, { Flip }] = await Promise.all([
    import("gsap"),
    import("gsap/Flip"),
  ]);
  gsap.registerPlugin(Flip);
  return { gsap, Flip };
}

function hudRgb(to: View) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(to === "engineer" ? "--hud-eng" : "--hud-rec")
    .trim();
}

/**
 * "Recompile", ≈2 s. The HUD arrives in the colour of the view it's switching
 * to, so it brings the new accent with it.
 *
 *  acquire   0.00  brackets lock onto the face, rings draw on and turn
 *  rebuild   0.20  the portrait is rewritten tile by tile from the face out,
 *                  RECOMPILE 000 → 100 %  (→ Recruiter: technical blocks on
 *                  screen de-render meanwhile)
 *  commit    0.97  the view flips; BUILD OK; the page recompiles top-down
 *  release   1.20  the reticle collapses, the brackets let go
 */
export async function cast(refs: CastRefs, to: View, commit: () => void) {
  const { gsap, Flip } = await loadGsap();
  const { frame, stage, canvas, reticle } = refs;
  const root = document.documentElement;
  const dir = to === "engineer" ? 1 : -1;

  const shown = (v: View) =>
    frame.querySelector<HTMLImageElement>(
      v === "engineer" ? ".portrait-eng" : ".portrait-rec",
    );
  // The rebuild paints both photos onto the canvas. It uses plain copies of
  // what the page already loaded (from cache): a srcset <img> reports a
  // density-corrected naturalWidth, which would throw off the cover crop. If
  // they aren't ready soon, skip the portrait and just recompile the page.
  const pixels = await Promise.race([
    Promise.all(
      [shown(to === "engineer" ? "recruiter" : "engineer"), shown(to)].map(
        (img) => {
          const copy = new Image();
          copy.src = img?.currentSrc || img?.src || "";
          return copy.decode().then(() => copy);
        },
      ),
    ).catch(() => null),
    new Promise<null>((r) => setTimeout(() => r(null), 1200)),
  ]);
  if (!pixels) return recompileOnly(to, commit);
  const [fromImg, toImg] = pixels;

  root.dataset.casting = "";
  stage.style.setProperty(
    "--hud",
    `var(--hud-${to === "engineer" ? "eng" : "rec"})`,
  );

  const tiles = new TileRebuild(canvas, fromImg, toImg, hudRgb(to));
  tiles.draw(0);
  gsap.set(canvas, { autoAlpha: 1 });
  gsap.set(stage, { autoAlpha: 1 });

  const rings = reticle.querySelectorAll("[data-ring]");
  const lock = reticle.querySelector('[data-part="lock"]');
  const strokes = reticle.querySelectorAll("path");
  const cores = Array.from(reticle.querySelectorAll("path[data-core]"));
  const status = reticle.querySelector<SVGTextElement>('[data-part="status"]');
  const labels = reticle.querySelectorAll(".reticle-label");
  const say = (text: string) => {
    if (status) status.textContent = text;
  };
  say("RECOMPILE 000%");

  const prog = { p: 0 };
  let page: Promise<void> = Promise.resolve();
  const tl = gsap.timeline();

  // acquire
  tl.set(reticle, { autoAlpha: 0, scale: 1.12 }, 0)
    .set(strokes, { strokeDashoffset: 1 }, 0)
    .set(labels, { autoAlpha: 0 }, 0)
    .to(
      reticle,
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" },
      0,
    )
    .fromTo(
      lock,
      { scale: 2.1 },
      { scale: 1, duration: 0.38, ease: "power3.out" },
      0.04,
    )
    .to(labels, { autoAlpha: 1, duration: 0.2, stagger: 0.08 }, 0.22)
    .to(rings[0], { rotation: 90 * dir, duration: 2, ease: "power1.inOut" }, 0)
    .to(
      rings[1],
      { rotation: -150 * dir, duration: 2, ease: "power1.inOut" },
      0,
    )
    .to(rings[2], { rotation: 60 * dir, duration: 2, ease: "power1.inOut" }, 0);

  // Lines draw on in random order, each with its halo (the path before it).
  cores.forEach((core) =>
    tl.to(
      [core.previousElementSibling, core],
      { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" },
      Math.random() * 0.18,
    ),
  );

  // rebuild
  tl.to(
    prog,
    {
      p: 1,
      duration: 0.75,
      ease: "power1.inOut",
      onUpdate: () => {
        tiles.draw(prog.p);
        say(`RECOMPILE ${String(Math.round(prog.p * 100)).padStart(3, "0")}%`);
      },
    },
    0.2,
  );
  if (to === "recruiter") tl.add(() => void deRender(gsap, to), 0.3);

  // commit
  tl.add(() => {
    const layout = captureLayout(Flip);
    commit();
    gsap.set(canvas, { autoAlpha: 0 });
    say(`BUILD OK · ${to.toUpperCase()}`);
    page = recompileAfter(gsap, Flip, to, layout);
  }, 0.97).fromTo(
    frame,
    { filter: "brightness(1.3)" },
    { filter: "brightness(1)", duration: 0.5, ease: "power2.out" },
    0.97,
  );

  // release
  tl.to(
    lock,
    { scale: 1.5, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
    1.3,
  ).to(
    reticle,
    { scale: 0.88, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
    1.35,
  );

  await new Promise<void>((resolve) =>
    tl.eventCallback("onComplete", () => resolve()),
  );
  await page;

  tiles.clear();
  gsap.set(stage, { autoAlpha: 0 });
  gsap.set([reticle, lock, ...Array.from(rings)], {
    clearProps: "transform,opacity,visibility",
  });
  gsap.set(frame, { clearProps: "filter" });
  delete root.dataset.casting;
}

/** Portrait off-screen: no portrait sequence, but what's on screen recompiles. */
export async function recompileOnly(to: View, commit: () => void) {
  const { gsap, Flip } = await loadGsap();
  const root = document.documentElement;
  root.dataset.casting = "";
  if (to === "recruiter") await deRender(gsap, to);
  const layout = captureLayout(Flip);
  commit();
  await recompileAfter(gsap, Flip, to, layout);
  delete root.dataset.casting;
}
