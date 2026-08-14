import { experience } from "@/content/experience";
import { buildTrace } from "@/lib/timeline";
import { SectionShell } from "@/components/layout/SectionShell";
import { TraceChart } from "@/components/system/TraceChart";

/**
 * Server component: the trace is computed once here, with a single `now`, so
 * the client chart never disagrees with the server about today's date.
 */
export function Experience() {
  const trace = buildTrace(new Date());
  const first = trace.years[0]?.label;
  const last = trace.years[trace.years.length - 1]?.label;

  return (
    <SectionShell
      id="experience"
      label="Experience"
      meta={first && last ? `${first} to ${last}` : undefined}
    >
      <TraceChart trace={trace} roles={experience} />
    </SectionShell>
  );
}
