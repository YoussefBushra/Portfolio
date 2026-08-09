import { track as vercelTrack } from "@vercel/analytics";

/**
 * Typed analytics wrapper around Vercel Web Analytics.
 *
 * Everything captured here is privacy-respecting, aggregate product analytics:
 * no PII, no cookies, no cross-site fingerprinting libraries — just the signals
 * a browser already exposes about a visit, plus the actions people take on the
 * page. Vercel's dashboard turns these into countries, cities, devices,
 * browsers, OS, referrers, top pages and per-event engagement.
 */

export type AnalyticsEvent =
  | "visit"
  | "cv_download"
  | "contact_submit"
  | "command_palette_open"
  | "command_run"
  | "theme_toggle"
  | "section_view"
  | "project_archive_toggle"
  | "tech_filter"
  | "social_click"
  | "boot_skipped"
  | "cta_click";

type Props = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props?: Props) {
  try {
    vercelTrack(event, props);
  } catch {
    // analytics must never break the UI
  }
}

/** Pull UTM + referrer attribution from the current URL / document. */
function attribution(): Props {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k) ?? null;

  let referrerHost: string | null = null;
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : "direct";
  } catch {
    referrerHost = "direct";
  }

  return {
    referrer: referrerHost,
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    landing_path: window.location.pathname,
  };
}

const RETURNING_KEY = "yb.visited";

/**
 * Fire a single rich "visit" event describing who is visiting — everything the
 * browser will tell us without invasive tracking.
 */
export function trackVisit() {
  if (typeof window === "undefined") return;

  const nav = window.navigator;
  // @ts-expect-error - connection is non-standard but widely available
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  let returning = false;
  try {
    returning = localStorage.getItem(RETURNING_KEY) === "1";
    localStorage.setItem(RETURNING_KEY, "1");
  } catch {
    // storage may be blocked
  }

  const props: Props = {
    ...attribution(),
    returning,
    language: nav.language ?? null,
    languages: Array.isArray(nav.languages) ? nav.languages.join(",") : null,
    timezone:
      Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone ?? null,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    dpr: window.devicePixelRatio ?? 1,
    orientation: window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape",
    touch: nav.maxTouchPoints > 0,
    prefers_dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    connection: connection?.effectiveType ?? null,
    hour: new Date().getHours(),
  };

  track("visit", props);
}
