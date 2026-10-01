import type { View } from "@/lib/view";

type Gsap = typeof import("gsap").gsap;
type FlipApi = typeof import("gsap/Flip").Flip;
type FlipState = ReturnType<FlipApi["getState"]>;
type Timeline = ReturnType<Gsap["timeline"]>;

/**
 * The page part of a view switch, driven by the surge front sweeping down the
 * viewport (transform.ts decides when the front reaches a given height).
 * Nothing on screen changes instantly:
 *
 *  - blocks that disappear collapse inside a blueprint wireframe before the
 *    commit, then their space closes smoothly;
 *  - blocks that appear open their space smoothly, then render inside a
 *    wireframe — dashed box, corner brackets, mono tag — as the front passes;
 *  - work cards turn into translucent blueprint panels, glide and resize to
 *    their new slots (GSAP Flip, transform-only), and their content renders
 *    back in once they land;
 *  - section labels re-render as the front passes them.
 *
 * Only what's on or near the screen animates; everything else simply switches.
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

export type Heights = { el: HTMLElement; from: number }[];

/**
 * Before the commit: the heights of everything on screen whose height the
 * switch changes — the view layers (outside the work cards, which are handled
 * as a whole) and the work grid — so they can ease to their new height.
 */
export function captureHeights(): Heights {
  const els = [
    ...Array.from(document.querySelectorAll<HTMLElement>(".layer")).filter(
      (el) => !el.closest(".work-grid"),
    ),
    ...Array.from(document.querySelectorAll<HTMLElement>(".work-grid")),
  ];
  // A collapsed layer has no box of its own: judge it by where it sits.
  const near = (el: HTMLElement) =>
    onScreen(el.offsetHeight ? el : el.parentElement!, 200);
  return els.filter(near).map((el) => ({ el, from: el.offsetHeight }));
}

/**
 * After the commit: ease heights and glide the layout, and render what
 * appeared as the front passes it. `reach(top)` is how many seconds from now
 * the front reaches a viewport y; `sweep` is how long the layout takes.
 */
export function renderAfter(
  gsap: Gsap,
  Flip: FlipApi,
  to: View,
  state: FlipState,
  heights: Heights,
  sweep: number,
  reach: (top: number) => number,
): Promise<void> {
  const tl = gsap.timeline();
  const hud = `var(--hud-${to === "engineer" ? "eng" : "rec"})`;

  // 1 · Heights start from where they were, so nothing jumps; the layout glides
  // from the old arrangement to the new one while they ease to the new values.
  const eased = heights
    .map((h) => ({ ...h, to: h.el.offsetHeight }))
    .filter((h) => Math.abs(h.to - h.from) > 1);
  eased.forEach((h) => gsap.set(h.el, { height: h.from }));

  // Work cards travel as blueprint panels: their content is hidden in flight,
  // so they can scale (transform-only, no per-frame layout) without
  // distorting text, and panels crossing each other read as layout planes.
  // (the cards in the glide: on or near the screen before or after the commit)
  const flying = new Set(state.elementStates.map((e) => e.element));
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(".work-grid > article"),
  ).filter((el) => flying.has(el) || onScreen(el, 200));
  cards.forEach((c) => {
    c.style.setProperty("--hud", hud);
    c.classList.add("rc-ghost");
  });

  tl.add(
    Flip.from(state, {
      duration: sweep,
      ease: "power3.inOut",
      scale: true,
    }),
    0,
  );
  eased.forEach((h) =>
    tl.to(
      h.el,
      {
        height: h.to,
        duration: sweep * 0.9,
        ease: "power3.inOut",
        clearProps: "height,overflow",
      },
      0,
    ),
  );

  // 2 · Cards land, then their content renders back in, left to right.
  cards.sort(byTop).forEach((card, i) => {
    const t =
      Math.max(reach(card.getBoundingClientRect().top), sweep) + i * 0.07;
    const kids = Array.from(card.children) as HTMLElement[];
    tl.call(() => card.classList.remove("rc-ghost"), undefined, t)
      .fromTo(
        kids,
        { clipPath: "inset(0 100% 0 0)", opacity: 0.25 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05,
          clearProps: "clipPath,opacity",
        },
        t,
      )
      .call(() => card.style.removeProperty("--hud"), undefined, t + 0.6);
  });

  // 3 · Section labels re-render as the front passes them.
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

  // 4 · New blocks render inside a wireframe as the front passes them — in
  // the work cards, once the card has landed.
  blocks(to === "engineer" ? "eng" : "rec")
    .filter((el) => onScreen(el, 120))
    .forEach((el) => {
      const card = el.closest<HTMLElement>(".work-grid > article");
      const top = el.getBoundingClientRect().top;
      const t = card
        ? Math.max(reach(top), sweep) + 0.2
        : Math.max(reach(top), 0.15);
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
    cards.forEach((c) => {
      c.classList.remove("rc-ghost");
      c.style.removeProperty("--hud");
    });
  });
}

/**
 * A short, real run of the page effects — ghost card panel, a Flip, a
 * wireframe, a clip reveal — played behind the intro cover so the first real
 * switch doesn't pay for their first paint. Returns the clean-up.
 */
export function rehearsePage(
  gsap: Gsap,
  Flip: FlipApi,
  tl: Timeline,
  hud: View,
) {
  const card = document.querySelector<HTMLElement>(".work-grid > article");
  const label = document.querySelector<HTMLElement>("section[id] h2");
  const block =
    Array.from(document.querySelectorAll<HTMLElement>("[data-rc]")).find((el) =>
      onScreen(el),
    ) ?? card;
  const undo: (() => void)[] = [];
  if (card) {
    const st = Flip.getState(card);
    card.style.setProperty(
      "--hud",
      `var(--hud-${hud === "engineer" ? "eng" : "rec"})`,
    );
    card.classList.add("rc-ghost");
    tl.add(Flip.from(st, { duration: 0.3, scale: true }), 0);
    undo.push(() => {
      card.classList.remove("rc-ghost");
      card.style.removeProperty("--hud");
      gsap.set(card, { clearProps: "transform" });
    });
  }
  if (label)
    tl.fromTo(
      label,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.3, clearProps: "clipPath" },
      0,
    );
  if (block) {
    const { box, done } = wireframe(block, "render", hud);
    tl.fromTo(
      box,
      { clipPath: "inset(0 100% 100% 0)" },
      { clipPath: "inset(0 0% 0% 0)", duration: 0.3 },
      0,
    );
    undo.push(done);
  }
  return () => undo.forEach((f) => f());
}
