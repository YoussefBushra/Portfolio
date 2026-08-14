import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

/**
 * Builds the data behind the trace chart: every span is positioned and sized
 * from a real date in the content files, on one shared time axis. Nothing here
 * is decorative, so a wider bar always means a longer stretch of work.
 *
 * Everything returned is plain JSON so a server component can compute it once
 * (with a single `now`) and hand it to the client chart without a hydration
 * mismatch.
 */

export interface TraceSpan {
  id: string;
  kind: "study" | "role";
  title: string;
  subtitle: string;
  period: string;
  duration: string;
  /** Fractions of the axis, 0 to 1. */
  offset: number;
  width: number;
  current: boolean;
}

export interface ShippedTick {
  year: string;
  count: number;
  offset: number;
}

export interface Trace {
  spans: TraceSpan[];
  ticks: ShippedTick[];
  years: { label: string; offset: number }[];
  endLabel: string;
}

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

export function buildTrace(now: Date): Trace {
  const nowIndex = now.getFullYear() * 12 + now.getMonth();

  const raw = [
    ...education.map((e) => ({
      id: "study",
      kind: "study" as const,
      title: e.degree,
      subtitle: e.institution,
      period: e.period,
      start: monthIndex(e.start),
      end: monthIndex(e.end),
      current: false,
    })),
    ...experience.map((r) => ({
      id: r.company,
      kind: "role" as const,
      title: r.role,
      subtitle: `${r.company}, ${r.location}`,
      period: r.period,
      start: monthIndex(r.start),
      end: r.end ? monthIndex(r.end) : nowIndex,
      current: Boolean(r.current),
    })),
  ].sort((a, b) => a.start - b.start);

  const firstYear = Math.floor(Math.min(...raw.map((s) => s.start)) / 12);
  const axisStart = firstYear * 12;
  const axisEnd = Math.max(nowIndex, ...raw.map((s) => s.end));
  const axisLength = Math.max(axisEnd - axisStart, 1);

  const spans: TraceSpan[] = raw.map((s) => ({
    id: s.id,
    kind: s.kind,
    title: s.title,
    subtitle: s.subtitle,
    period: s.period,
    duration: formatDuration(s.end - s.start),
    offset: (s.start - axisStart) / axisLength,
    width: Math.max((s.end - s.start) / axisLength, 0.006),
    current: s.current,
  }));

  const byYear = new Map<string, number>();
  for (const p of projects) {
    byYear.set(p.year, (byYear.get(p.year) ?? 0) + 1);
  }

  const ticks: ShippedTick[] = [...byYear.entries()]
    .map(([year, count]) => ({
      year,
      count,
      // Ticks sit mid-year, which is as precise as the source data gets.
      offset: (Number(year) * 12 + 6 - axisStart) / axisLength,
    }))
    .filter((t) => t.offset >= 0 && t.offset <= 1)
    .sort((a, b) => a.offset - b.offset);

  const years: { label: string; offset: number }[] = [];
  for (let y = firstYear; y * 12 <= axisEnd; y += 1) {
    years.push({ label: String(y), offset: (y * 12 - axisStart) / axisLength });
  }

  return {
    spans,
    ticks,
    years,
    endLabel: now.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
  };
}
