import { experience } from "@/content/experience";
import { buildTrace } from "@/lib/timeline";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHead } from "@/components/ui/SectionHead";
import { TraceChart } from "@/components/system/TraceChart";

/**
 * Server component: the trace is computed once here, with a single `now`, so
 * the client chart never disagrees with the server about today's date.
 */
export function Experience() {
  const trace = buildTrace(new Date());

  return (
    <SectionShell id="experience">
      <SectionHead
        title="Study, then production."
        lead="Each bar is placed and sized by real dates. Select a role to see what shipped inside it."
      />
      <TraceChart trace={trace} roles={experience} />
    </SectionShell>
  );
}
