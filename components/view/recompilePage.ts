import type { View } from "@/lib/view";

type Gsap = typeof import("gsap").gsap;
type FlipApi = typeof import("gsap/Flip").Flip;
type FlipState = ReturnType<FlipApi["getState"]>;

/**
 * The page half of the "recompile" transformation. Runs top-down through
 * whatever is on screen (off-screen content simply switches):
 *
 *  - elements marked [data-flip] (the work cards, the portrait) and visible
 *    section labels glide from their old layout to the new one (GSAP Flip);
 *  - each section label re-renders left to right;
 *  - each block that appears renders inside a blueprint wireframe — a dashed
 *    box with corner brackets and a mono tag — left to right, then the frame
 *    fades; blocks that disappear de-render the same way, before the commit.
 *
 * Wireframes are temporary children of the block itself, so they follow the
 * layout while cards are still resizing.
 */

const FLIP_TARGETS = "[data-flip], section[id] h2";
const onScreen = (el: Element, margin = 0) => {
  const r = el.getBoundingClientRect();
  return (
    r.height > 0 &&
    r.bottom > 56 - margin &&
    r.top < window.innerHeight + margin
  );
};

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

/** Before the commit (→ Recruiter): technical blocks on screen de-render. */
export function deRender(gsap: Gsap, to: View): Promise<void> {
  const leaving = blocks(to === "engineer" ? "rec" : "eng").filter((el) =>
    onScreen(el),
  );
  if (!leaving.length) return Promise.resolve();

  const tl = gsap.timeline();
  leaving
    .sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    )
    .forEach((el, i) => {
      const { box, kids, done } = wireframe(
        el,
        `collapse › ${el.dataset.rc}`,
        to,
      );
      const at = i * 0.07;
      tl.fromTo(
        box,
        { clipPath: "inset(0 100% 100% 0)" },
        { clipPath: "inset(0 0% 0% 0)", duration: 0.25, ease: "power2.out" },
        at,
      )
        .to(
          kids,
          {
            clipPath: "inset(0 0 0 100%)",
            opacity: 0.2,
            duration: 0.35,
            ease: "power2.in",
          },
          at + 0.08,
        )
        .to(box, { autoAlpha: 0, duration: 0.2, onComplete: done }, at + 0.4);
    });
  return new Promise((resolve) =>
    tl.eventCallback("onComplete", () => resolve()),
  );
}

/**
 * Capture the layout just before the commit. Only what's on or near the
 * screen glides; everything else snaps (animating off-screen cards would
 * stretch the page and drag the scroll position around).
 */
export function captureLayout(Flip: FlipApi): FlipState {
  return Flip.getState(
    Array.from(document.querySelectorAll(FLIP_TARGETS)).filter((el) =>
      onScreen(el, 200),
    ),
  );
}

/** After the commit: glide the layout, then render what appeared, top-down. */
export function recompileAfter(
  gsap: Gsap,
  Flip: FlipApi,
  to: View,
  state: FlipState,
): Promise<void> {
  const tl = gsap.timeline();

  // 1 · the layout glides from the old arrangement to the new one
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(".work-grid > article"),
  ).filter((el) => onScreen(el, 200));
  gsap.set(cards, { overflow: "hidden" });
  tl.add(
    Flip.from(state, {
      duration: 0.75,
      ease: "power3.inOut",
      stagger: 0.04,
      onComplete: () => gsap.set(cards, { clearProps: "overflow" }),
    }),
    0,
  );

  // 2 · render top-down: section labels and newly visible blocks, in page order
  type Step = { el: HTMLElement; kind: "label" | "block"; top: number };
  const steps: Step[] = [
    ...Array.from(document.querySelectorAll<HTMLElement>("section[id] h2"))
      .filter((el) => onScreen(el))
      .map((el) => ({
        el,
        kind: "label" as const,
        top: el.getBoundingClientRect().top,
      })),
    ...blocks(to === "engineer" ? "eng" : "rec")
      .filter((el) => onScreen(el, 120))
      .map((el) => ({
        el,
        kind: "block" as const,
        top: el.getBoundingClientRect().top,
      })),
  ].sort((a, b) => a.top - b.top);

  steps.forEach((step, i) => {
    const at = 0.08 + Math.min(i * 0.09, 0.8);
    if (step.kind === "label") {
      tl.fromTo(
        step.el,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.4,
          ease: "power2.out",
          clearProps: "clipPath",
        },
        at,
      );
      return;
    }
    // Blocks inside the work cards wait a beat so the cards open first.
    const inCard = !!step.el.closest(".work-grid");
    const t = at + (inCard ? 0.25 : 0);
    const { box, kids, done } = wireframe(
      step.el,
      `render › ${step.el.dataset.rc}`,
      to,
    );
    tl.fromTo(
      box,
      { clipPath: "inset(0 100% 100% 0)" },
      { clipPath: "inset(0 0% 0% 0)", duration: 0.32, ease: "power2.out" },
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
        t + 0.12,
      )
      .to(box, { autoAlpha: 0, duration: 0.3, onComplete: done }, t + 0.75);
  });

  return new Promise((resolve) =>
    tl.eventCallback("onComplete", () => {
      // Anything de-rendered before the commit is collapsed now: reset it.
      blocks("eng")
        .concat(blocks("rec"))
        .forEach((el) =>
          gsap.set(el.children, { clearProps: "clipPath,opacity" }),
        );
      resolve();
    }),
  );
}
