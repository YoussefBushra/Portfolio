import type { CSSProperties, ReactNode } from "react";

/**
 * The engineer layer. Always rendered (so it's indexed and never flashes),
 * collapsed by CSS until `<html data-view="engineer">`. It adds depth under
 * the shared content; it never replaces it.
 */
export function Eng({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="eng-layer">
      <div>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

/** Inline text shown only in recruiter view. For small swaps like section meta. */
export function Rec({ children }: { children: ReactNode }) {
  return <span className="rec-only">{children}</span>;
}

/** Inline text shown only in engineer view. */
export function EngInline({ children }: { children: ReactNode }) {
  return <span className="eng-only">{children}</span>;
}

/**
 * Staggered child of an engineer layer: fades up in order when the layer
 * opens, and leaves all at once when it closes.
 */
export function Stagger({
  i,
  children,
  className = "",
  as: Tag = "div",
}: {
  i: number;
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  return (
    <Tag data-stagger className={className} style={{ "--i": i } as CSSProperties}>
      {children}
    </Tag>
  );
}
