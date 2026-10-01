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
 *  - work cards turn into blueprint panels that move to their new slots in
 *    clear-path phases — shrink, shift column or row, move, grow — so no
 *    two panels ever overlap; their content renders back in once they land;
 *  - section labels re-render as the front passes them.
 *
 * Only what's on or near the screen animates; everything else simply switches.
 */

// Work cards move separately (see reflowCards), not by Flip.
const FLIP_TARGETS = '[data-flip]:not([data-flip="work"]), section[id] h2';

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

type Box = { x: number; y: number; w: number; h: number };
export type CardsBefore = { grid: HTMLElement; boxes: Map<HTMLElement, Box> };

/** An element's box relative to the work grid. */
function boxIn(el: HTMLElement, grid: HTMLElement): Box {
  const r = el.getBoundingClientRect();
  const g = grid.getBoundingClientRect();
  return { x: r.left - g.left, y: r.top - g.top, w: r.width, h: r.height };
}

/** Before the commit: where each work card sits (if the grid is in view). */
export function captureCards(): CardsBefore | null {
  const grid = document.querySelector<HTMLElement>(".work-grid");
  if (!grid || !onScreen(grid, 200)) return null;
  const boxes = new Map<HTMLElement, Box>();
  grid
    .querySelectorAll<HTMLElement>(":scope > article")
    .forEach((c) => boxes.set(c, boxIn(c, grid)));
  return { grid, boxes };
}

const CORNERS =
  '<i class="rc-c rc-tl"></i><i class="rc-c rc-tr"></i><i class="rc-c rc-bl"></i><i class="rc-c rc-br"></i>';

/**
 * After the commit: each card is stood in for by a blueprint panel (the real
 * card is hidden, its content would only reflow on the way) that travels from
 * the old slot to the new one in phases chosen so that no two panels ever
 * overlap:
 *
 *   shrink   to the smaller of old/new size, in place (nothing grows yet);
 *   shift    when the layout spreads into more columns (→ Recruiter): first
 *            sideways into the new column — the cards are still stacked, so
 *            their rows are clear — then up or down within it;
 *            when it gathers into fewer columns (→ Engineer): first up or down
 *            within the old column to the new row, then sideways;
 *   grow     to the new size, in place (the new slots don't overlap).
 *
 * Within a column the cards keep their order and the gaps between them only
 * interpolate between two non-negative values, so moving rows never collide.
 * Returns the landing time and the panels (removed by the caller).
 */
function reflowCards(
  gsap: Gsap,
  tl: Timeline,
  before: CardsBefore,
  hud: string,
  at: number,
) {
  const { grid, boxes } = before;
  const cards = Array.from(boxes.keys());
  const restore = grid.style.position;
  if (getComputedStyle(grid).position === "static")
    grid.style.position = "relative";

  const plan = cards.map((card) => {
    const a = boxes.get(card)!;
    const b = boxIn(card, grid);
    const panel = document.createElement("div");
    panel.className = "rc-proxy";
    panel.innerHTML = CORNERS;
    panel.style.setProperty("--hud", hud);
    grid.appendChild(panel);
    gsap.set(panel, { left: a.x, top: a.y, width: a.w, height: a.h });
    card.classList.add("rc-hidden");
    return { card, panel, a, b };
  });

  const cols = (pick: (p: (typeof plan)[number]) => Box) =>
    new Set(plan.map((p) => Math.round(pick(p).x))).size;
  const spreading = cols((p) => p.b) > cols((p) => p.a);

  type Step = (p: (typeof plan)[number]) => Partial<Box>;
  const small = (p: (typeof plan)[number]) => ({
    w: Math.min(p.a.w, p.b.w),
    h: Math.min(p.a.h, p.b.h),
  });
  const steps: Step[] = [
    (p) => small(p),
    spreading ? (p) => ({ x: p.b.x }) : (p) => ({ y: p.b.y }),
    spreading ? (p) => ({ y: p.b.y }) : (p) => ({ x: p.b.x }),
    (p) => ({ w: p.b.w, h: p.b.h }),
  ];

  // The grid's height follows the panels — always just tall enough to hold
  // them — so the content below moves with them and is never covered.
  const fit = () => {
    const bottom = Math.max(
      ...plan.map(
        (p) =>
          (gsap.getProperty(p.panel, "top") as number) +
          (gsap.getProperty(p.panel, "height") as number),
      ),
    );
    grid.style.height = `${bottom}px`;
  };
  // Play the phases in order, skipping any in which nothing moves. Each phase
  // tweens only what it changes (size, then x, then y, or the other way
  // round), so neighbouring phases can overlap: the motion curves smoothly
  // from one into the next instead of stopping between them. Size never
  // changes in two overlapping phases (shrink and grow are never adjacent).
  const PHASE = 0.46;
  const NEXT = 0.55; // a phase starts this far into the one before
  const cur = new Map(plan.map((p) => [p, { ...p.a }]));
  const css = { x: "left", y: "top", w: "width", h: "height" } as const;
  let t = at;
  let end = at;
  for (const step of steps) {
    const moves = plan
      .map((p) => {
        const from = cur.get(p)!;
        const next = { ...from, ...step(p) };
        cur.set(p, next);
        const props: Record<string, number> = {};
        (Object.keys(css) as (keyof typeof css)[]).forEach((k) => {
          if (Math.abs(next[k] - from[k]) > 0.5) props[css[k]] = next[k];
        });
        return Object.keys(props).length ? { p, props } : null;
      })
      .filter(Boolean) as {
      p: (typeof plan)[number];
      props: Record<string, number>;
    }[];
    if (!moves.length) continue;
    moves.forEach(({ p, props }) =>
      tl.to(
        p.panel,
        {
          ...props,
          duration: PHASE,
          ease: "power2.inOut",
          lazy: false,
          onUpdate: () => fit(),
        },
        t,
      ),
    );
    end = t + PHASE;
    t += PHASE * NEXT;
  }

  fit();
  tl.call(() => grid.style.removeProperty("height"), undefined, end);

  const cleanup = () => {
    plan.forEach((p) => {
      p.panel.remove();
      p.card.classList.remove("rc-hidden");
    });
    grid.style.position = restore;
    grid.style.removeProperty("height");
  };
  return { land: end, plan, cleanup };
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
  cardsBefore: CardsBefore | null,
  sweep: number,
  reach: (top: number) => number,
  /** Sparks at a viewport point (the cards land in a spray of them). */
  spark?: (x: number, y: number, n: number) => void,
): Promise<void> {
  const tl = gsap.timeline();
  const hud = `var(--hud-${to === "engineer" ? "eng" : "rec"})`;

  // 1 · Heights start from where they were, so nothing jumps; the layout glides
  // from the old arrangement to the new one while they ease to the new values.
  // (the work grid's height follows its cards instead, when they re-flow)
  const eased = heights
    .map((h) => ({ ...h, to: h.el.offsetHeight }))
    .filter((h) => Math.abs(h.to - h.from) > 1 && h.el !== cardsBefore?.grid);

  // The cards' new slots are measured first: a grid held at a taller height
  // would stretch its rows.
  const reflow = cardsBefore
    ? reflowCards(gsap, tl, cardsBefore, hud, 0)
    : null;

  eased.forEach((h) => gsap.set(h.el, { height: h.from }));
  tl.add(Flip.from(state, { duration: sweep, ease: "power3.inOut" }), 0);
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

  // 2 · Work cards travel as blueprint panels, then their content renders
  // back in, left to right, as each lands.
  const landing = new Map<HTMLElement, number>();
  let cleanupCards = () => {};
  if (reflow) {
    const { land, plan, cleanup } = reflow;
    cleanupCards = cleanup;
    plan
      .sort((x, y) => x.b.y - y.b.y || x.b.x - y.b.x)
      .forEach(({ card, panel }, i) => {
        const t =
          Math.max(reach(card.getBoundingClientRect().top), land) + i * 0.07;
        landing.set(card, t);
        const kids = Array.from(card.children) as HTMLElement[];
        tl.call(
          () => {
            card.classList.remove("rc-hidden");
            // a spit of sparks from each corner as it locks into place
            if (!spark) return;
            const r = panel.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) return;
            for (const [x, y] of [
              [r.left, r.top],
              [r.right, r.top],
              [r.left, r.bottom],
              [r.right, r.bottom],
            ])
              spark(x, y, 7);
          },
          undefined,
          t,
        )
          .to(panel, { autoAlpha: 0, duration: 0.3 }, t)
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
          );
      });
  }

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
      const landed = card ? landing.get(card) : undefined;
      const t =
        landed !== undefined ? landed + 0.2 : Math.max(reach(top), 0.15);
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
    cleanupCards();
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
    // a blueprint panel resizing over the first card, and a Flip in place
    const grid = card.parentElement!;
    const before: CardsBefore = {
      grid,
      boxes: new Map([[card, boxIn(card, grid)]]),
    };
    const st = Flip.getState(card);
    const { cleanup } = reflowCards(
      gsap,
      tl,
      before,
      `var(--hud-${hud === "engineer" ? "eng" : "rec"})`,
      0,
    );
    tl.add(Flip.from(st, { duration: 0.3 }), 0);
    undo.push(() => {
      cleanup();
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
