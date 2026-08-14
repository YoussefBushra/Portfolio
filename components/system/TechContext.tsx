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
  filter: string | null;
  toggleFilter: (t: string) => void;
  clearFilter: () => void;
  isFiltering: (t: string) => boolean;
}

const Ctx = createContext<TechCtx | null>(null);

export function TechProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<string | null>(null);

  const toggleFilter = useCallback(
    (t: string) => setFilter((cur) => (cur && norm(cur) === norm(t) ? null : t)),
    []
  );
  const clearFilter = useCallback(() => setFilter(null), []);

  const value = useMemo<TechCtx>(
    () => ({
      filter,
      toggleFilter,
      clearFilter,
      isFiltering: (t: string) => filter !== null && norm(filter) === norm(t),
    }),
    [filter, toggleFilter, clearFilter]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTech(): TechCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // No-op fallback so tags still render outside the provider.
    return {
      filter: null,
      toggleFilter: () => {},
      clearFilter: () => {},
      isFiltering: () => false,
    };
  }
  return ctx;
}
