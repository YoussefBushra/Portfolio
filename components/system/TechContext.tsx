"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const norm = (t: string) => t.trim().toLowerCase();

interface TechCtx {
  hover: string | null;
  setHover: (t: string | null) => void;
  filter: string | null;
  toggleFilter: (t: string) => void;
  clearFilter: () => void;
  isActive: (t: string) => boolean;
  isFiltering: (t: string) => boolean;
}

const Ctx = createContext<TechCtx | null>(null);

export function TechProvider({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const toggleFilter = useCallback(
    (t: string) => setFilter((cur) => (cur && norm(cur) === norm(t) ? null : t)),
    []
  );
  const clearFilter = useCallback(() => setFilter(null), []);

  const value = useMemo<TechCtx>(
    () => ({
      hover,
      setHover,
      filter,
      toggleFilter,
      clearFilter,
      isActive: (t: string) =>
        (hover !== null && norm(hover) === norm(t)) ||
        (filter !== null && norm(filter) === norm(t)),
      isFiltering: (t: string) => filter !== null && norm(filter) === norm(t),
    }),
    [hover, filter, toggleFilter, clearFilter]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTech(): TechCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // graceful no-op fallback if used outside a provider
    return {
      hover: null,
      setHover: () => {},
      filter: null,
      toggleFilter: () => {},
      clearFilter: () => {},
      isActive: () => false,
      isFiltering: () => false,
    };
  }
  return ctx;
}
