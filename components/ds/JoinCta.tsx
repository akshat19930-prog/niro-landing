"use client";

import { useJoinOptional } from "@/components/JoinProvider";

/**
 * Opens the join modal. Renders a <button> styled by `className` (reuses the
 * existing .nav-cta / .btn classes). On a standalone page with no JoinProvider
 * (about/privacy/terms), it degrades to a link back to the home page.
 */
export function JoinCta({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
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

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        // Reopen at the confirmation if they already joined; otherwise start fresh.
        if (join.step !== "done") join.setStep("form");
        join.setOpen(true);
      }}
    >
      {children}
    </button>
  );
}
