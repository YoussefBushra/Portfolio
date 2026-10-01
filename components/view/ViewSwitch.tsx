"use client";

import { useEffect, useState } from "react";
import { currentView, requestView, type View } from "@/lib/view";

const HINT_KEY = "view-hint-seen";

/**
 * Recruiter | Engineer. Changes how the same page is told: recruiter is plain
 * language and outcomes; engineer adds the technical layer underneath. The
 * view lives in the URL (?view=engineer) so either version can be shared.
 */
export function ViewSwitch() {
  const [view, setView] = useState<View>("recruiter");
  const [hint, setHint] = useState(false);
  /** The view being switched to while a transformation plays (the switch
   *  can't be used again until it's done). */
  const [busy, setBusy] = useState<View | null>(null);

  useEffect(() => {
    setView(currentView());
    const onChange = (e: Event) => setView((e as CustomEvent<View>).detail);
    const onBusy = (e: Event) => setBusy((e as CustomEvent<View>).detail);
    const onSettled = () => setBusy(null);
    window.addEventListener("view:change", onChange);
    window.addEventListener("view:busy", onBusy);
    window.addEventListener("view:settled", onSettled);

    // One-time hint so the switch gets found — after the intro, and never for
    // someone who arrived on an engineer link.
    let timer = 0;
    const offerHint = () => {
      try {
        if (currentView() === "recruiter" && !localStorage.getItem(HINT_KEY)) {
          localStorage.setItem(HINT_KEY, "1");
          // Anyone who found the switch in the meantime doesn't need the hint
          // (and it must never pop up over a transformation).
          timer = window.setTimeout(() => {
            const root = document.documentElement;
            if (currentView() === "recruiter" && !root.dataset.viewBusy)
              setHint(true);
          }, 600);
        }
      } catch {
        // storage unavailable (private mode): simply skip the hint
      }
    };
    if (document.documentElement.dataset.intro === "done") offerHint();
    else window.addEventListener("intro:done", offerHint, { once: true });

    return () => {
      window.removeEventListener("view:change", onChange);
      window.removeEventListener("view:busy", onBusy);
      window.removeEventListener("view:settled", onSettled);
      window.removeEventListener("intro:done", offerHint);
      window.clearTimeout(timer);
    };
  }, []);

  // Let the hint get out of the way once the reader moves on.
  useEffect(() => {
    if (!hint) return;
    const hide = () => setHint(false);
    const timer = window.setTimeout(hide, 12000);
    const onScroll = () => window.scrollY > 480 && hide();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hint]);

  const choose = (next: View) => {
    setHint(false);
    if (busy || next === currentView()) return;
    setView(next);
    void requestView(next);
  };

  const option =
    "focus-ring inline-flex h-full items-center rounded-sm px-2.5 text-[12.5px] font-medium text-muted transition-colors duration-150 hover:text-text sm:px-3";

  return (
    <div className="relative">
      <div
        role="group"
        aria-label="How this page is told"
        aria-busy={busy ? true : undefined}
        className="view-switch relative inline-flex h-9 items-stretch gap-0.5 rounded-sm border border-line bg-surface p-[3px]"
      >
        <button
          type="button"
          aria-pressed={view === "recruiter"}
          aria-disabled={busy ? true : undefined}
          onClick={() => choose("recruiter")}
          className={`${option} view-opt-recruiter`}
        >
          Recruiter
        </button>
        <button
          type="button"
          aria-pressed={view === "engineer"}
          aria-disabled={busy ? true : undefined}
          onClick={() => choose("engineer")}
          className={`${option} view-opt-engineer font-mono`}
        >
          Engineer
        </button>
        {/* Progress of the transformation; the switch is locked meanwhile. */}
        <span className="view-progress" aria-hidden />
        <span className="sr-only" role="status">
          {busy ? `Switching to the ${busy} view…` : ""}
        </span>
      </div>

      {hint ? (
        <div
          role="status"
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-max max-w-[15rem] rounded-sm bg-text px-3 py-2 text-[12.5px] leading-snug text-bg shadow-lg"
        >
          <span
            className="absolute -top-1 right-8 h-2 w-2 rotate-45 bg-text"
            aria-hidden
          />
          Engineer? Switch for architecture, patterns and trade-offs.
          <button
            type="button"
            onClick={() => setHint(false)}
            className="focus-ring ml-2 rounded-sm px-1 text-bg/70 hover:text-bg"
            aria-label="Dismiss hint"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
