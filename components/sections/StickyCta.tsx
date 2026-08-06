"use client";

import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";

/**
 * Fixed bottom CTA for narrow viewports. Visibility is a CSS breakpoint
 * (≤640px) per the design-system note. It hides once the visitor has entered
 * the join flow (task picker / confirmation) — showing a "Join the waitlist"
 * bar while they're already mid-flow is redundant and would overlap the
 * flow's own Continue button.
 */
export function StickyCta() {
  const { step } = useJoin();
  if (step !== "form") return null;

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
      <Button href="#join" full>
        Join the waitlist
      </Button>
    </div>
  );
}
