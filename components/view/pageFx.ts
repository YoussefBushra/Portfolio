import type { View } from "@/lib/view";

type Gsap = typeof import("gsap").gsap;
type FlipApi = typeof import("gsap/Flip").Flip;
type FlipState = ReturnType<FlipApi["getState"]>;
type Timeline = ReturnType<Gsap["timeline"]>;

/**
 * The page part of a view switch, driven by the surge front sweeping down the
 * viewport (transform.ts decides when the front reaches a given height):
 *
 *  - elements marked [data-flip] (the work cards, the portrait) and section
 *    labels on screen glide from the old layout to the new one (GSAP Flip);
 *  - as the front passes a section label, it re-renders left to right;
 *  - as it passes a block that appears, the block renders inside a blueprint
 *    wireframe — dashed box, corner brackets, mono tag — then the frame fades.
 *    Blocks that disappear collapse the same way just before the commit.
 *
 * Only what's on or near the screen animates; everything else simply switches.
 * Wireframes are temporary children of the block, so they follow the layout
 * while cards are still resizing.
 */

const FLIP_TARGETS = "[data-flip], section[id] h2";

export const onScreen = (el: Element, margin = 0) => {
  const r = el.getBoundingClientRect();
  return (
    r.height > 0 &&
    r.bottom > 56 - margin &&
    r.top < window.innerHeight + margin
  );
};

const byTop = (a: Element, b: Element) =>
  a.getBoundingClientRect().top - b.getBoundingClientRect().top;

function blocks(kind: "eng" | "rec") {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`.layer-${kind} > div > [data-rc]`),
  );
}

function wireframe(el: HTMLElement, tag: string, hud: View) {
  const box = document.createElement("div");
  box.className = "rc-box";
  box.style.setProperty(
    "--hud",
    `var(--hud-${hud === "engineer" ? "eng" : "rec"})`,
  );
  box.innerHTML =
    '<i class="rc-c rc-tl"></i><i class="rc-c rc-tr"></i><i class="rc-c rc-bl"></i><i class="rc-c rc-br"></i>' +
    `<span class="rc-tag">${tag}</span>`;
  const restore = el.style.position;
  if (getComputedStyle(el).position === "static")
    el.style.position = "relative";
  el.appendChild(box);
  const kids = Array.from(el.children).filter(
    (c) => c !== box,
  ) as HTMLElement[];
  const done = () => {
    box.remove();
    el.style.position = restore;
  };
  return { box, kids, done };
}

const finished = (tl: Timeline) =>
  new Promise<void>((resolve) =>
    tl.eventCallback("onComplete", () => resolve()),
  );

/** On-screen blocks that switching to `to` will remove. */
export function leavingBlocks(to: View) {
  return blocks(to === "engineer" ? "rec" : "eng")
    .filter((el) => onScreen(el))
    .sort(byTop);
}

/** Before the commit: collapse the leaving blocks, all within `within` s. */
export function deRender(
  gsap: Gsap,
  to: View,
  leaving: HTMLElement[],
  within: number,
): Promise<void> {
  if (!leaving.length) return Promise.resolve();
  const tl = gsap.timeline();
  const step = Math.min(0.06, (within - 0.36) / Math.max(1, leaving.length));
  leaving.forEach((el, i) => {
    const { box, kids, done } = wireframe(
      el,
      `collapse › ${el.dataset.rc}`,
      to,
    );
    const at = i * Math.max(0, step);
    tl.fromTo(
      box,
      { clipPath: "inset(0 100% 100% 0)" },
      { clipPath: "inset(0 0% 0% 0)", duration: 0.16, ease: "power2.out" },
      at,
    )
      .to(
        kids,
        {
          clipPath: "inset(0 0 0 100%)",
          opacity: 0.2,
          duration: 0.24,
          ease: "power2.in",
        },
        at + 0.05,
      )
      .to(box, { autoAlpha: 0, duration: 0.1, onComplete: done }, at + 0.26);
  });
  return finished(tl);
}

/** Capture the layout just before the commit (on-screen elements only). */
export function captureLayout(Flip: FlipApi): FlipState {
  return Flip.getState(
    Array.from(document.querySelectorAll(FLIP_TARGETS)).filter((el) =>
      onScreen(el, 200),
    ),
  );
}

/**
 * After the commit: glide the layout, and render what appeared as the front
 * passes it. `reach(top)` is how many seconds from now the front reaches a
 * viewport y.
 */
export function renderAfter(
  gsap: Gsap,
  Flip: FlipApi,
  to: View,
  state: FlipState,
  sweep: number,
  reach: (top: number) => number,
): Promise<void> {
  const tl = gsap.timeline();

  // The layout glides from the old arrangement to the new one while the
  // front crosses the screen.
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(".work-grid > article"),
  ).filter((el) => onScreen(el, 200));
  gsap.set(cards, { overflow: "hidden" });
  tl.add(
    Flip.from(state, {
      duration: sweep,
      ease: "power3.inOut",
      onComplete: () => gsap.set(cards, { clearProps: "overflow" }),
    }),
    0,
  );

  // Section labels re-render as the front passes them.
  document.querySelectorAll<HTMLElement>("section[id] h2").forEach((el) => {
    if (!onScreen(el)) return;
    tl.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.4,
        ease: "power2.out",
        clearProps: "clipPath",
      },
      reach(el.getBoundingClientRect().top),
    );
  });

  // New blocks render inside a wireframe as the front passes them. Blocks in
  // the work cards wait a beat so the cards have opened first.
  blocks(to === "engineer" ? "eng" : "rec")
    .filter((el) => onScreen(el, 120))
    .forEach((el) => {
      const inCard = !!el.closest(".work-grid");
      const t = reach(el.getBoundingClientRect().top) + (inCard ? 0.2 : 0);
      const { box, kids, done } = wireframe(
        el,
        `render › ${el.dataset.rc}`,
        to,
      );
      tl.fromTo(
        box,
        { clipPath: "inset(0 100% 100% 0)" },
        { clipPath: "inset(0 0% 0% 0)", duration: 0.3, ease: "power2.out" },
        t,
      )
        .fromTo(
          kids,
          { clipPath: "inset(0 100% 0 0)", opacity: 0.25 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "clipPath,opacity",
          },
          t + 0.1,
        )
        .to(box, { autoAlpha: 0, duration: 0.3, onComplete: done }, t + 0.7);
    });

  return finished(tl).then(() => {
    // Anything collapsed before the commit is hidden now: reset it.
    blocks("eng")
      .concat(blocks("rec"))
      .forEach((el) =>
        gsap.set(el.children, { clearProps: "clipPath,opacity" }),
      );
  });
}
