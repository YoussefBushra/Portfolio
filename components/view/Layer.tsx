import type { ReactNode } from "react";

interface LayerProps {
  children: ReactNode;
  /** Classes for the innermost element. Put spacing here (e.g. `pt-6`), not on
   *  the wrapper, so it collapses along with the content. */
  className?: string;
}

/**
 * Content shown only in engineer view. It is always in the HTML; the
 * `html[data-view]` attribute expands or collapses it (see globals.css).
 */
export function Engineer({ children, className = "" }: LayerProps) {
  return (
    <div className="layer layer-eng">
      <div>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

/** Content shown only in recruiter view (for places where the two views
 *  genuinely say different things, rather than one adding to the other). */
export function Recruiter({ children, className = "" }: LayerProps) {
  return (
    <div className="layer layer-rec">
      <div>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

/** Renders `backtick` spans as inline code, for technical notes. */
export function withCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="font-mono text-[0.88em] text-text">
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
