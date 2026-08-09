"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/analytics";

/** Fires one rich "visit" analytics event per page load. Renders nothing. */
export function VisitTracker() {
  useEffect(() => {
    trackVisit();
  }, []);
  return null;
}
