"use client";

import { track } from "@/lib/analytics";

const CV_PATH = "/Youssef_Bushra_Fouad_CV.pdf";

/** Download-CV action styled as a Cloudscape button. */
export function CvButton({
  from,
  variant = "normal",
  className = "",
}: {
  from: string;
  variant?: "primary" | "normal";
  className?: string;
}) {
  return (
    <a
      href={CV_PATH}
      download
      onClick={() => track("cv_download", { from })}
      className={`${variant === "primary" ? "btn-primary" : "btn-normal"} focus-ring ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </svg>
      Download CV
    </a>
  );
}
