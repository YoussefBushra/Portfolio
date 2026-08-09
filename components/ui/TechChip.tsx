"use client";

import { useTech } from "@/components/system/TechContext";
import { track } from "@/lib/analytics";

interface TechChipProps {
  label: string;
  /** When true, clicking toggles a project filter. */
  filterable?: boolean;
  size?: "sm" | "md";
}

/**
 * A tech tag wired to the shared TechContext. Hovering any chip highlights
 * every chip with the same tech across the whole page (the "connective edges"
 * between experience and projects). Filterable chips also toggle the project
 * filter on click.
 */
export function TechChip({ label, filterable, size = "md" }: TechChipProps) {
  const { setHover, toggleFilter, isActive, isFiltering } = useTech();
  const active = isActive(label);
  const filtering = isFiltering(label);

  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  const className = `inline-flex items-center gap-1 rounded-md border font-mono transition-all duration-200 ${pad} ${
    active
      ? "border-accent/60 bg-accent/15 text-accent shadow-glow-sm"
      : "border-border bg-surface-2/50 text-muted"
  } ${filterable ? "cursor-pointer hover:border-accent/40" : ""}`;

  const hoverProps = {
    onMouseEnter: () => setHover(label),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(label),
    onBlur: () => setHover(null),
  };

  const content = (
    <>
      {filtering ? <span className="text-accent">◆</span> : null}
      {label}
    </>
  );

  if (filterable) {
    return (
      <button
        type="button"
        aria-pressed={filtering}
        onClick={() => {
          toggleFilter(label);
          track("tech_filter", { tech: label });
        }}
        className={className}
        {...hoverProps}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={className} {...hoverProps}>
      {content}
    </span>
  );
}
