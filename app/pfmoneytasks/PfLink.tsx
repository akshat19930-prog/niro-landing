"use client";

import { logEvent } from "@/lib/track";

/**
 * An in-page link on /pfmoneytasks that says which kind of interest it is.
 *
 * Three kinds, kept apart on purpose so a click is never read as more than it
 * is: "cta" scrolls to the audit form (pf_cta_click), "lite" opens the Niro
 * Lite terms (pf_lite_interest, i.e. interest in the paid plan, not a
 * purchase), "guide" opens the family guide (nav_cta_click, the existing
 * name for a secondary page link). Nothing personal rides on any of them.
 */
export function PfLink({
  href,
  kind,
  placement,
  className,
  children,
}: {
  href: string;
  kind: "cta" | "lite" | "guide";
  placement: string;
  className?: string;
  children: React.ReactNode;
}) {
  const event =
    kind === "cta" ? "pf_cta_click" : kind === "lite" ? "pf_lite_interest" : "nav_cta_click";
  return (
    <a
      href={href}
      className={className}
      onClick={() => logEvent(event, { placement, href })}
    >
      {children}
    </a>
  );
}
