/** One overlay at a time. Any floating layer (settings popover, mobile menu,
 *  command menu) announces itself when it opens; the others listen and close.
 *  This keeps two panels from stacking on top of each other on small screens. */
export const OVERLAY_OPEN_EVENT = "yb:overlay-open";

/** Announce that the overlay `id` just opened, so peers can close themselves. */
export function announceOverlay(id: string) {
  window.dispatchEvent(new CustomEvent(OVERLAY_OPEN_EVENT, { detail: id }));
}
