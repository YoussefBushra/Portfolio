import { Fragment, type CSSProperties } from "react";
import type { FlowStep } from "@/lib/types";
import { Stagger } from "@/components/view/Layers";

/**
 * A request/data flow, drawn in HTML rather than SVG: one row on wide screens,
 * a vertical stack below that. Boxes appear one by one when the engineer layer
 * opens; each arrow draws in just before the box it points at.
 */
export function FlowDiagram({ steps, failure }: { steps: FlowStep[]; failure?: string }) {
  return (
    <figure className="font-mono">
      <ol className="flex flex-col items-stretch gap-1 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 ? (
              <li aria-hidden className="flow-arrow" style={{ "--i": i * 2 - 1 } as CSSProperties}>
                <span className="flow-arrow-line" />
              </li>
            ) : null}
            <Stagger as="li" i={i * 2} className="rounded-sm border border-line bg-bg px-3 py-2 lg:min-w-0 lg:flex-1 lg:px-2.5">
              <span className="block text-[12.5px] font-medium leading-tight text-text">
                {s.label}
              </span>
              {s.note ? (
                <span className="mt-0.5 block text-[11px] leading-tight text-faint">{s.note}</span>
              ) : null}
            </Stagger>
          </Fragment>
        ))}
      </ol>
      {failure ? (
        <Stagger i={steps.length * 2}>
          <figcaption className="mt-3 flex flex-col gap-0.5 text-[12px] sm:flex-row sm:items-baseline sm:gap-2 leading-[1.6] text-muted">
            <span className="shrink-0 whitespace-nowrap text-danger">on failure ↳</span>
            <span>{failure}</span>
          </figcaption>
        </Stagger>
      ) : null}
    </figure>
  );
}
