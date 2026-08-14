import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface SectionHeadProps {
  title: string;
  /** One sentence under the heading. Stacked, never floated to the side. */
  lead?: string;
  className?: string;
}

/**
 * Section heading. The amber bar is the same mark the trace chart uses for a
 * span, so it reads as part of the page's system rather than as an ornament.
 */
export function SectionHead({ title, lead, className = "" }: SectionHeadProps) {
  return (
    <RevealOnScroll className={`mb-12 md:mb-16 ${className}`}>
      <span className="span-mark" aria-hidden="true" />
      <h2 className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
          {lead}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
