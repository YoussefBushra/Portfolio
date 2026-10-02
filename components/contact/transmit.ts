import { gsap } from "gsap";
import { SparkField } from "@/components/view/sparkField";

/**
 * The message-sent transformation, in the language of the view switch and in
 * the current accent colour:
 *
 *  transmit  the form is locked in a blueprint wireframe ("transmit ›
 *            message"), folds into a single line of light, and the line fires
 *            off to the right in a spray of sparks;
 *  receive   the confirmation renders in inside its own wireframe
 *            ("delivered"), left to right.
 *
 * Only played after Formspree has confirmed the message was accepted.
 */

const accentRgb = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();

const CORNERS =
  '<i class="rc-c rc-tl"></i><i class="rc-c rc-tr"></i><i class="rc-c rc-bl"></i><i class="rc-c rc-br"></i>';

/** A temporary blueprint frame inside `el`, with a mono tag. */
function frame(el: HTMLElement, tag: string) {
  const box = document.createElement("div");
  box.className = "rc-box";
  box.style.setProperty("--hud", "var(--accent)");
  box.innerHTML = `${CORNERS}<span class="rc-tag">${tag}</span>`;
  const restore = el.style.position;
  if (getComputedStyle(el).position === "static")
    el.style.position = "relative";
  el.appendChild(box);
  return {
    box,
    done: () => {
      box.remove();
      el.style.position = restore;
    },
  };
}

/** Sparks on the page-wide spark canvas, ticking until the last one dies. */
function sparks() {
  const canvas = document.querySelector<HTMLCanvasElement>(".surge-sparks");
  if (!canvas) return null;
  const f = new SparkField(canvas, 400);
  f.begin(accentRgb());
  // Stop once the sparks have come and gone (not before the first one is
  // emitted), or after 3 s at most.
  const until = performance.now() + 3000;
  let seen = false;
  const tick = (_t: number, ms: number) => {
    f.frame(Math.min(ms, 50) / 1000);
    if (f.active) seen = true;
    if ((seen && !f.active) || performance.now() > until) {
      gsap.ticker.remove(tick);
      f.clear();
    }
  };
  gsap.ticker.add(tick);
  return f;
}

const finished = (tl: gsap.core.Timeline) =>
  new Promise<void>((resolve) =>
    tl.eventCallback("onComplete", () => resolve()),
  );

/** The form folds into a line of light that fires off to the right. */
export async function transmit(form: HTMLElement) {
  const kids = Array.from(form.children) as HTMLElement[];
  const { box, done } = frame(form, "transmit › message");
  // (on the form, not in the frame: the frame folds to nothing)
  const beam = document.createElement("div");
  beam.className = "tx-beam";
  beam.style.setProperty("--hud", "var(--accent)");
  form.appendChild(beam);
  form.style.pointerEvents = "none";

  const tl = gsap.timeline();
  tl.fromTo(
    box,
    { clipPath: "inset(0 100% 100% 0)" },
    { clipPath: "inset(0 0% 0% 0)", duration: 0.28, ease: "power2.out" },
  )
    // fold: the form and its frame close on the centre line
    .to(
      kids,
      {
        clipPath: "inset(50% 0 50% 0)",
        opacity: 0.4,
        duration: 0.38,
        ease: "power3.in",
      },
      0.3,
    )
    .to(
      box,
      { clipPath: "inset(50% 0 50% 0)", duration: 0.38, ease: "power3.in" },
      0.32,
    )
    .fromTo(
      beam,
      { autoAlpha: 0, scaleX: 0.6 },
      { autoAlpha: 1, scaleX: 1, duration: 0.2, ease: "power2.out" },
      0.5,
    )
    // fire: the line runs off to the right, spitting sparks from its head
    .add(() => {
      const f = sparks();
      if (!f) return;
      const r = beam.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const run = { k: 0 };
      gsap.to(run, {
        k: 1,
        duration: 0.42,
        ease: "power2.in",
        onUpdate: () => {
          const x = r.left + r.width * run.k;
          for (let i = 0; i < 6; i++)
            f.emit(
              x,
              y,
              200 + Math.random() * 380,
              -180 + Math.random() * 260,
              { g: 700, life: [0.25, 0.6] },
            );
        },
        onComplete: () => f.burst(r.right, y, 40, 380),
      });
    }, 0.72)
    .to(
      beam,
      {
        scaleX: 0,
        transformOrigin: "100% 50%",
        x: 60,
        duration: 0.42,
        ease: "power2.in",
      },
      0.72,
    )
    .set({}, {}, 1.2);

  await finished(tl);
  beam.remove();
  done();
}

/** The confirmation renders in inside its own wireframe. */
export async function receive(panel: HTMLElement) {
  const kids = Array.from(panel.children) as HTMLElement[];
  const { box, done } = frame(panel, "delivered");
  const tl = gsap.timeline();
  tl.fromTo(
    box,
    { clipPath: "inset(0 100% 100% 0)" },
    { clipPath: "inset(0 0% 0% 0)", duration: 0.32, ease: "power2.out" },
  )
    .fromTo(
      kids,
      { clipPath: "inset(0 100% 0 0)", opacity: 0.25 },
      {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "clipPath,opacity",
      },
      0.12,
    )
    .to(box, { autoAlpha: 0, duration: 0.4 }, 1.1);
  await finished(tl);
  done();
}
