"use client";

import { track } from "@/lib/analytics";

const CV_PATH = "/portfolio.pdf";
/** What the file is called once it lands in the reader's downloads folder. */
const CV_FILENAME = "Youssef-Bushra-Fouad-CV.pdf";

interface CVButtonProps {
  from: string;
  variant?: "primary" | "ghost" | "compact" | "primary-compact";
  className?: string;
}

export function CVButton({ from, variant = "ghost", className = "" }: CVButtonProps) {
  const styles = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    compact:
      "focus-ring inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur-sm transition-colors duration-200 hover:border-accent hover:text-text",
    // Small but prominent: an accent fill for the top nav on phones.
    "primary-compact":
      "focus-ring inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-on-accent shadow-[0_6px_16px_-8px_rgb(var(--accent)/0.9),inset_0_1px_0_0_rgb(255_255_255/0.4)] transition-transform duration-150 active:translate-y-px",
  }[variant];

  // The short label keeps the nav CTA from crowding on small screens.
  const label = variant === "primary-compact" ? "CV" : "Download CV";

  return (
    <a
      href={CV_PATH}
      download={CV_FILENAME}
      onClick={() => track("cv_download", { from })}
      className={`group ${styles} ${className}`}
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
        className="transition-transform duration-200 group-hover:translate-y-0.5"
        aria-hidden="true"
      >
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </svg>
      {label}
    </a>
  );
}
