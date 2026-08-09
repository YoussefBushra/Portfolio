import type { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionShell({ id, children, className }: SectionShellProps) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 ${
        className ?? ""
      }`}
    >
      {children}
    </section>
  );
}
