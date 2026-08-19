"use client";

import { useJoinOptional } from "@/components/JoinProvider";
import { logEvent } from "@/lib/track";

/**
 * Opens the join modal. Renders a <button> styled by `className` (reuses the
 * existing .nav-cta / .btn classes). On a standalone page with no JoinProvider
 * (about/privacy/terms), it degrades to a link back to the home page.
 *
 * `position` tags the click with the CTA's location on the page
 * (e.g. "hero", "nav", "closing") so the split test can read which framing
 * pulls signups — fires `waitlist_click_<position>`, carrying the page's market.
 */
export function JoinCta({
  className,
  style,
  position,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  position?: string;
  children: React.ReactNode;
}) {
  const join = useJoinOptional();

  if (!join) {
    return (
      <a href="/#join" className={className} style={style}>
        {children}
      </a>
    );
  }

  function onClick() {
    if (position) {
      logEvent(
        `waitlist_click_${position}`,
        join!.market ? { market: join!.market } : undefined
      );
    }
    join!.openForm();
  }

  return (
    <button type="button" className={className} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
