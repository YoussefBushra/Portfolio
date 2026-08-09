"use client";

import { track } from "@/lib/analytics";

const CV_PATH = "/Youssef_Bushra_Fouad_CV.pdf";

interface CVButtonProps {
  from: string;
  variant?: "primary" | "ghost" | "compact";
  className?: string;
}

export function CVButton({ from, variant = "primary", className = "" }: CVButtonProps) {
  const base =
    "focus-ring group inline-flex items-center gap-2 rounded-xl text-sm font-medium transition-all";
  const styles = {
    primary:
      "bg-accent px-5 py-3 text-white shadow-glow hover:-translate-y-0.5",
    ghost:
      "border border-border bg-surface/60 px-5 py-3 text-text backdrop-blur-sm hover:border-accent/50 hover:text-accent",
    compact:
      "border border-border bg-surface/70 px-3 py-1.5 font-mono text-xs text-muted hover:border-accent/50 hover:text-accent",
  }[variant];

  return (
    <a
      href={CV_PATH}
      download
      onClick={() => track("cv_download", { from })}
      className={`${base} ${styles} ${className}`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:translate-y-0.5"
        aria-hidden="true"
      >
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </svg>
      Download CV
    </a>
  );
}
