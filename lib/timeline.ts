import { experience } from "@/content/experience";

/** Months since year 0 for an ISO "YYYY-MM" string. */
function monthIndex(iso: string): number {
  const [y, m] = iso.split("-").map(Number);
  return y * 12 + ((m ?? 1) - 1);
}

function formatDuration(months: number): string {
  if (months < 12) return `${Math.max(months, 1)} mo`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} yr ${rest} mo` : `${years} yr`;
}

/**
 * Total professional experience, measured from the earliest role, so the
 * figure on the page cannot go stale. Pass a single `now` from a server
 * component to keep the server and client in agreement about today's date.
 */
export function experienceSince(now: Date): string {
  const first = Math.min(...experience.map((r) => monthIndex(r.start)));
  return formatDuration(now.getFullYear() * 12 + now.getMonth() - first);
}

/** The year the earliest role began. */
export function careerStartYear(): number {
  return Math.floor(Math.min(...experience.map((r) => monthIndex(r.start))) / 12);
}
