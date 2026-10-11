"use client";

import { useEffect } from "react";
import { startPostHog, trackVisit } from "@/lib/analytics";

/** Starts PostHog (if configured) and fires one rich "visit" analytics event
 *  per page load. Renders nothing. */
export function VisitTracker() {
  useEffect(() => {
    startPostHog();
    trackVisit();
  }, []);
  return null;
}
