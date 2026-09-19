import type { ReactNode } from "react";

interface ContainerProps {
  /** Container header title (like a Cloudscape container/section header). */
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions in the header. */
  actions?: ReactNode;
  /** Small counter/label shown next to the title (e.g. "(2)"). */
  counter?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * The core Cloudscape "container": a white panel with a hairline border, a
 * subtle shadow, and an optional header row separated by a divider. This is the
 * unit the whole console is built from.
 */
export function Container({
  title,
  description,
  actions,
  counter,
  children,
  className,
  bodyClassName,
}: ContainerProps) {
  return (
    <section className={`cs-container ${className ?? ""}`}>
      {title ? (
        <div className="cs-header">
          <div className="min-w-0">
            <h2 className="cs-title">
              {title}
              {counter ? (
                <span className="ml-1.5 font-normal text-faint">{counter}</span>
              ) : null}
            </h2>
            {description ? <p className="cs-desc">{description}</p> : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      <div className={bodyClassName ?? "px-4 py-4 sm:px-5"}>{children}</div>
    </section>
  );
}

/** Cloudscape status indicator: colored dot + label. */
export function Status({
  kind = "success",
  children,
}: {
  kind?: "success" | "info" | "pending";
  children: ReactNode;
}) {
  const color =
    kind === "success"
      ? "bg-ok"
      : kind === "info"
        ? "bg-accent"
        : "bg-orange";
  const text =
    kind === "success"
      ? "text-ok"
      : kind === "info"
        ? "text-accent"
        : "text-orange";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] ${text}`}>
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {children}
    </span>
  );
}
