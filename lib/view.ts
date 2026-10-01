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

/** Applies a view: attribute, URL (?view=engineer is shareable), analytics. */
export function commitView(to: View) {
  const root = document.documentElement;
  root.dataset.view = to;
  delete root.dataset.viewPending;

  const url = new URL(window.location.href);
  if (to === "engineer") url.searchParams.set("view", "engineer");
  else url.searchParams.delete("view");
  window.history.replaceState(window.history.state, "", url);

  track("view_toggle", { to });
  window.dispatchEvent(new CustomEvent<View>("view:change", { detail: to }));
}

/** Entry point for the switch. Ignored while a transformation is playing. */
export async function requestView(to: View) {
  if (casting || to === currentView()) return;

  if (!caster) {
    commitView(to);
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
    casting = false;
    delete root.dataset.viewBusy;
    root.style.removeProperty("--switch-progress");
    window.dispatchEvent(new Event("view:settled"));
  }
}
