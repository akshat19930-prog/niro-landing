"use client";

import { JoinCta } from "@/components/ds/JoinCta";
import { useJoin } from "@/components/JoinProvider";

/**
 * Fixed bottom CTA for narrow viewports (≤640px, via CSS). Opens the join
 * modal. Hidden while the modal is open (it would sit behind the overlay) and
 * once the visitor has joined.
 */
export function StickyCta() {
  const { open, step } = useJoin();
  if (open || step === "done") return null;

  return (
    <div
      className="sticky-cta"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 16px",
        background: "var(--surface-card)",
        borderTop: "1px solid var(--border)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.10)",
        zIndex: 60,
      }}
    >
      <JoinCta className="btn btn-primary btn-md btn-full">Join the waitlist</JoinCta>
    </div>
  );
}
