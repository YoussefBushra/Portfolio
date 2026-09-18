import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface SectionHeadingProps {
  index: string;
  /** kept for API compatibility; not shown in the minimal theme */
  service?: string;
  title: string;
  description?: string;
}

/** Clean, professional section header: a small index, a rule, then the title. */
export function SectionHeading({ index, title, description }: SectionHeadingProps) {
  return (
    <RevealOnScroll className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 font-mono text-xs text-faint">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-border" />
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
