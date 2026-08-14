"use client";

import { useTech } from "@/components/system/TechContext";
import { track } from "@/lib/analytics";

interface TagProps {
  label: string;
  /** Filterable tags toggle the project filter when clicked. */
  filterable?: boolean;
}

export function Tag({ label, filterable }: TagProps) {
  const { toggleFilter, isFiltering } = useTech();

  if (!filterable) {
    return <span className="tag">{label}</span>;
  }

  const active = isFiltering(label);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        toggleFilter(label);
        track("tech_filter", { tech: label });
      }}
      className={`tag focus-ring transition-colors duration-200 ${
        active
          ? "border-accent bg-accent/15 text-accent-text"
          : "hover:border-accent hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}
