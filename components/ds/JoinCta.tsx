"use client";

import { useJoinOptional } from "@/components/JoinProvider";
import { logEvent } from "@/lib/track";

/**
 * Opens the join modal. Renders a <button> styled by `className` (reuses the
 * existing .nav-cta / .btn classes). On a standalone page with no JoinProvider
 * (about/privacy/terms), it degrades to a link home that ASKS for the modal.
 *
 * It used to point at "/#join", an anchor that exists nowhere on the site, so
 * the main CTA on those pages dropped the visitor at the top of the home page
 * with nothing open and no sign anything had happened. "?join=1" is read by
 * JoinProvider on mount, which opens the form and tidies the URL.
 *
 * `position` tags the click with the CTA's location on the page
 * (e.g. "hero", "nav", "closing") so the split test can read which framing
 * pulls signups - fires `waitlist_click_<position>`, carrying the page's market.
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
      <a href="/?join=1" className={className} style={style}>
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
