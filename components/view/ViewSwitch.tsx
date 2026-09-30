"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

type View = "recruiter" | "engineer";

const HINT_KEY = "view-hint-seen";

function currentView(): View {
  return document.documentElement.dataset.view === "engineer" ? "engineer" : "recruiter";
}

/**
 * Recruiter | Engineer. Changes how the same page is told: recruiter is plain
 * language and outcomes; engineer adds the technical layer underneath. The
 * view lives in the URL (?view=engineer) so either version can be shared.
 */
export function ViewSwitch() {
  const [view, setView] = useState<View>("recruiter");
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const v = currentView();
    setView(v);
    // One-time hint so the switch gets found. Not shown to anyone who arrived
    // on an engineer link — they already know.
    try {
      if (v === "recruiter" && !localStorage.getItem(HINT_KEY)) {
        localStorage.setItem(HINT_KEY, "1");
        setHint(true);
      }
    } catch {
      // storage unavailable (private mode): simply skip the hint
    }
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
    if (next === currentView()) return;
    document.documentElement.dataset.view = next;
    setView(next);
    const url = new URL(window.location.href);
    if (next === "engineer") url.searchParams.set("view", "engineer");
    else url.searchParams.delete("view");
    window.history.replaceState(window.history.state, "", url);
    track("view_toggle", { to: next });
  };

  const option =
    "focus-ring inline-flex h-full items-center rounded-sm px-2.5 text-[12.5px] font-medium text-muted transition-colors duration-150 hover:text-text sm:px-3";

  return (
    <div className="relative">
      <div
        role="group"
        aria-label="How this page is told"
        className="inline-flex h-9 items-stretch gap-0.5 rounded-sm border border-line bg-surface p-[3px]"
      >
        <button
          type="button"
          aria-pressed={view === "recruiter"}
          onClick={() => choose("recruiter")}
          className={`${option} view-opt-recruiter`}
        >
          Recruiter
        </button>
        <button
          type="button"
          aria-pressed={view === "engineer"}
          onClick={() => choose("engineer")}
          className={`${option} view-opt-engineer font-mono`}
        >
          Engineer
        </button>
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
