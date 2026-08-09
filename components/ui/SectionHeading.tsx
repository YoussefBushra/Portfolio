import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface SectionHeadingProps {
  index: string;
  service: string;
  title: string;
  description?: string;
}

/**
 * Section header styled like a service manifest entry:
 *  [ 01 ]  svc/about  ·  STATUS: ONLINE
 */
export function SectionHeading({
  index,
  service,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <RevealOnScroll className="mb-10 md:mb-14">
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <span className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-accent">
          {index}
        </span>
        <span className="text-accent-2">{service}</span>
        <span className="text-faint">·</span>
        <span className="inline-flex items-center gap-1.5 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
          STATUS: ONLINE
        </span>
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
