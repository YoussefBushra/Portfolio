import { experience } from "@/content/experience";

/** Months since year 0 for an ISO "YYYY-MM" string. */
function monthIndex(iso: string): number {
  const [y, m] = iso.split("-").map(Number);
  return y * 12 + ((m ?? 1) - 1);
}

/** The year the earliest role began. */
export function careerStartYear(): number {
  return Math.floor(Math.min(...experience.map((r) => monthIndex(r.start))) / 12);
}
