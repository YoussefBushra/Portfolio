/** Smooth-scroll to a section by id, honouring reduced motion and keeping the
 *  URL hash in sync. Shared by the nav, the mobile menu and the command menu so
 *  in-page navigation behaves identically everywhere. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "hero" ? " " : `#${id}`);
}
