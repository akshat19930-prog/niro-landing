/**
 * Page-level A/B test: "control" (the current page) vs "reposition" (the
 * "You can't always be in India. Niro can." rebuild).
 *
 * The 50/50 assignment is made by a tiny inline script in the document <head>
 * (see AbInit in app/layout.tsx) so it runs at HTML-parse time, before paint —
 * it sets a `niro_pg` cookie and `data-pg` on <html>, and CSS shows only the
 * assigned variant. No flash, no external calls, no added latency. This module
 * just reads the resolved arm client-side for analytics tagging.
 */
export type PageArm = "control" | "reposition";

export function readPageArm(): PageArm {
  if (typeof document === "undefined") return "control";
  const m = document.cookie.match(/(?:^|;\s*)niro_pg=(control|reposition)/);
  return m && m[1] === "reposition" ? "reposition" : "control";
}
