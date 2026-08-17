/**
 * Availability, shown as a live status pill rather than a plain field: a soft
 * pulsing dot and a short label read at a glance as "available now". Announced
 * atomically to assistive tech via role="status".
 */
export function AvailabilityBadge({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1 pl-2.5 pr-3 text-[12.5px] font-medium text-text ${className}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Open to roles
    </span>
  );
}
