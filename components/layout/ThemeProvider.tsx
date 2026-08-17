"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  // `reducedMotion="user"` lets Framer Motion honour the OS setting internally,
  // so components can keep a single deterministic `initial` (no server/client
  // branch on useReducedMotion, which caused hydration mismatches).
  return (
    <NextThemesProvider {...props}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
