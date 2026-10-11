import { track as vercelTrack } from "@vercel/analytics";
import type { PostHog } from "posthog-js";

/**
 * Typed analytics wrapper: every event goes to Vercel Web Analytics and, when
 * NEXT_PUBLIC_POSTHOG_KEY is set, to PostHog.
 *
 * No PII is collected: the signals a browser already exposes about a visit,
 * plus the actions people take on the page. PostHog adds pageviews, sessions,
 * autocaptured clicks, funnels and retention on top; it keeps an anonymous
 * id in first-party storage and creates no person profiles (nobody is ever
 * identified). Its requests go through this site's /ingest proxy
 * (next.config.mjs), so they are first-party.
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export type AnalyticsEvent =
  | "visit"
  | "cv_download"
  | "contact_submit"
  | "command_palette_open"
  | "command_run"
  | "view_toggle"
  | "section_view"
  | "social_click"
  | "boot_skipped"
  | "cta_click";

type Props = Record<string, string | number | boolean | null>;

let posthog: PostHog | null = null;
/** Events fired before PostHog has loaded; sent once it has. */
let queued: [AnalyticsEvent, Props | undefined][] | null = POSTHOG_KEY
  ? []
  : null;

export function track(event: AnalyticsEvent, props?: Props) {
  try {
    vercelTrack(event, props);
  } catch {
    // analytics must never break the UI
  }
  try {
    if (posthog) posthog.capture(event, props);
    else queued?.push([event, props]);
  } catch {
    // ditto
  }
}

/** The view as the switch names it. */
const viewLabel = (v: string | undefined) =>
  v === "engineer" ? "developer" : "recruiter";

/**
 * Load and start PostHog (no-op without NEXT_PUBLIC_POSTHOG_KEY). It is
 * loaded once the page is idle, so it never competes with the intro or a
 * view switch; queued events are sent after it starts.
 */
export function startPostHog() {
  if (!POSTHOG_KEY || typeof window === "undefined" || posthog) return;
  const load = async () => {
    try {
      const { default: ph } = await import("posthog-js");
      ph.init(POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: POSTHOG_HOST.replace(".i.posthog.com", ".posthog.com"),
        defaults: "2026-08-30",
        person_profiles: "never",
      });
      // Every event says which view it happened in.
      ph.register({ view: viewLabel(document.documentElement.dataset.view) });
      window.addEventListener("view:change", (e) =>
        ph.register({ view: viewLabel((e as CustomEvent<string>).detail) }),
      );
      posthog = ph;
      queued?.forEach(([event, props]) => ph.capture(event, props));
      queued = null;
    } catch {
      queued = null; // blocked or failed: carry on without it
    }
  };
  if ("requestIdleCallback" in window)
    window.requestIdleCallback(() => void load(), { timeout: 2500 });
  else setTimeout(() => void load(), 1200);
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
