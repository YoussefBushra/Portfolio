"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useView, type View } from "@/components/view/ViewProvider";

const HINT_KEY = "yb.viewHint";

function rememberHint() {
  try {
    localStorage.setItem(HINT_KEY, "1");
  } catch {
    // storage blocked; the hint just won't be remembered
  }
}

const OPTIONS: { v: View; label: string }[] = [
  { v: "recruiter", label: "Recruiter" },
  { v: "engineer", label: "Engineer" },
];

/**
 * Segmented "Recruiter | Engineer" pill. The active state and the sliding
 * indicator are driven by CSS off `<html data-view>`, so a deep link renders
 * correct on first paint instead of sliding into place after hydration.
 */
export function ViewSwitch({ className = "" }: { className?: string }) {
  const { view, setView } = useView();
  const [hint, setHint] = useState(false);

  // First-visit hint: shown once, only to people still in recruiter view.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {
      // storage blocked: skip the hint rather than show it every visit
    }
    if (seen || document.documentElement.dataset.view === "engineer") return;
    const t = window.setTimeout(() => setHint(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setHint(false);
    rememberHint();
  };

  // Finding the switch on your own counts as having seen the hint.
  useEffect(() => {
    if (view !== "engineer") return;
    setHint(false);
    rememberHint();
  }, [view]);

  const choose = (v: View) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setView(v, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        role="group"
        aria-label="Choose how the page explains the work"
        className="view-switch relative grid h-9 grid-cols-2 items-stretch rounded-sm border border-line bg-surface p-[3px]"
      >
        <span aria-hidden className="view-switch-thumb" />
        {OPTIONS.map((o) => (
          <button
            key={o.v}
            type="button"
            data-for={o.v}
            aria-pressed={view === o.v}
            onClick={choose(o.v)}
            className="view-switch-btn focus-ring relative z-10 rounded-[2px] px-2.5 text-[12.5px] font-medium sm:px-3"
          >
            {o.label}
          </button>
        ))}
      </div>

      {hint ? (
        <div
          role="note"
          className="absolute right-0 top-full z-50 mt-2.5 w-[230px] rounded-sm border border-line bg-bg p-3 pr-8 text-[12.5px] leading-snug text-muted shadow-lg"
        >
          <span
            aria-hidden
            className="absolute -top-[5px] right-10 h-2.5 w-2.5 rotate-45 border-l border-t border-line bg-bg"
          />
          <span className="font-semibold text-text">Engineer?</span> Flip this for the
          architecture, trade-offs and lessons behind each project.
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss hint"
            className="focus-ring absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-sm text-faint hover:text-text"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
