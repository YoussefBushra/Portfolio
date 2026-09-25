"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { track } from "@/lib/analytics";
import { VIEW_STORAGE_KEY, type View } from "@/lib/view";

export type { View };

/** One user-initiated switch. `n` increments per switch so effects can key on it. */
export interface Shift {
  to: View;
  originX: number;
  originY: number;
  n: number;
}

interface ViewContextValue {
  view: View;
  setView: (next: View, origin?: { x: number; y: number }) => void;
  /** Null until the user toggles; page loads and deep links never animate. */
  lastShift: Shift | null;
}

const ViewContext = createContext<ViewContextValue | null>(null);

/**
 * The view lives on `<html data-view>`. Both layers are always rendered and CSS
 * decides what shows, so this provider only has to keep the attribute, the URL
 * and storage in step with the switch.
 */
export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<View>("recruiter");
  const [lastShift, setLastShift] = useState<Shift | null>(null);
  // Mirrors `view` so setView can bail out and run its side effects once,
  // outside a state updater (StrictMode double-invokes updaters).
  const viewRef = useRef<View>("recruiter");

  useEffect(() => {
    if (document.documentElement.dataset.view === "engineer") {
      viewRef.current = "engineer";
      setViewState("engineer");
    }
  }, []);

  const setView = useCallback(
    (next: View, origin?: { x: number; y: number }) => {
      if (viewRef.current === next) return;
      viewRef.current = next;
      setViewState(next);

      document.documentElement.dataset.view = next;
      try {
        localStorage.setItem(VIEW_STORAGE_KEY, next);
      } catch {
        // storage may be blocked; the URL still carries the view
      }
      const url = new URL(window.location.href);
      if (next === "engineer") url.searchParams.set("view", "engineer");
      else url.searchParams.delete("view");
      window.history.replaceState(window.history.state, "", url);

      track("view_toggle", { to: next });
      setLastShift((s) => ({
        to: next,
        originX: origin?.x ?? window.innerWidth - 120,
        originY: origin?.y ?? 28,
        n: (s?.n ?? 0) + 1,
      }));
    },
    []
  );

  return (
    <ViewContext.Provider value={{ view, setView, lastShift }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used inside <ViewProvider>");
  return ctx;
}
