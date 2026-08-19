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

/**
 * The control-vs-reposition A/B has concluded — the reposition is now the sole
 * live page (see app/page.tsx). This returns "reposition" so the page_arm still
 * logged on beacons stays accurate; the split harness (AbInit) is no longer
 * mounted. Kept as a single function to repurpose for the next test (mode:
 * parents vs dual-sided) rather than re-plumbing every call site.
 */
export function readPageArm(): PageArm {
  return "reposition";
}
