import { track } from "@/lib/analytics";

/**
 * Recruiter / Engineer view state. The view lives on `<html data-view>` so CSS
 * can render the right layer on first paint; this module is the only place
 * that changes it after load.
 *
 * A "caster" (the hero portrait) can take over a switch to play the
 * transformation and commit the view at its peak. Without one — portrait not
 * mounted, reduced motion, off-screen — the view commits immediately.
 */

export type View = "recruiter" | "engineer";

/** Plays the transformation to `to` and calls `commit` at its peak. Must
 *  resolve when finished; `commit` is also called defensively afterwards. */
export type Caster = (to: View, commit: () => void) => Promise<void> | void;

let caster: Caster | null = null;
let casting = false;

export function currentView(): View {
  return document.documentElement.dataset.view === "engineer"
    ? "engineer"
    : "recruiter";
}

export function setCaster(fn: Caster | null) {
  caster = fn;
}

/** Applies a view: attribute, URL (?view=developer is shareable — the
 *  switch calls this view "Developer"; ?view=engineer links still work),
 *  analytics. */
export function commitView(to: View) {
  const root = document.documentElement;
  root.dataset.view = to;
  delete root.dataset.viewPending;

  const url = new URL(window.location.href);
  if (to === "engineer") url.searchParams.set("view", "developer");
  else url.searchParams.delete("view");
  window.history.replaceState(window.history.state, "", url);

  track("view_toggle", { to });
  window.dispatchEvent(new CustomEvent<View>("view:change", { detail: to }));
}

/**
 * Keeps the reader where they are while a switch changes heights: notes the
 * section under the nav and how far through it the reader is, then on every
 * frame (heights ease during a transformation) scrolls so that the same point
 * of that section stays under the nav. Returns the release, which corrects
 * once more for the final layout.
 */
function holdPlace() {
  const root = document.documentElement;
  const line = () =>
    document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
  const at = line() + 1;
  const section = Array.from(
    document.querySelectorAll<HTMLElement>("main section[id]"),
  ).find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= at && r.bottom > at;
  });
  // At the very top (or between sections) there is nothing to hold.
  if (!section || window.scrollY < 1) return () => {};
  const r0 = section.getBoundingClientRect();
  const fraction = (at - r0.top) / r0.height;

  // The browser's own scroll anchoring would fight the correction.
  const anchor = root.style.overflowAnchor;
  root.style.overflowAnchor = "none";
  const correct = () => {
    const r = section.getBoundingClientRect();
    const drift = r.top + fraction * r.height - at;
    if (Math.abs(drift) >= 1)
      window.scrollTo({ top: window.scrollY + drift, behavior: "instant" });
  };
  let raf = 0;
  const loop = () => {
    correct();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    correct();
    root.style.overflowAnchor = anchor;
  };
}

/** Entry point for the switch. Ignored while a transformation is playing. */
export async function requestView(to: View) {
  if (casting || to === currentView()) return;

  if (!caster) {
    const release = holdPlace();
    commitView(to);
    requestAnimationFrame(release);
    return;
  }

  const root = document.documentElement;
  casting = true;
  // The switch reflects the choice at once, while the page waits for the peak,
  // and shows it's busy (it can't be used again) until the transformation
  // has finished playing.
  root.dataset.viewPending = to;
  root.dataset.viewBusy = to;
  window.dispatchEvent(new CustomEvent<View>("view:busy", { detail: to }));

  const release = holdPlace();
  let committed = false;
  const commit = () => {
    if (committed) return;
    committed = true;
    commitView(to);
  };

  try {
    await caster(to, commit);
  } catch {
    // an effect failing must never leave the page stuck between views
  } finally {
    commit();
    // after the commit's layout has landed
    await new Promise((r) => requestAnimationFrame(r));
    release();
    casting = false;
    delete root.dataset.viewBusy;
    root.style.removeProperty("--switch-progress");
    window.dispatchEvent(new Event("view:settled"));
  }
}
