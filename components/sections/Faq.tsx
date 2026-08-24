"use client";

import { useState } from "react";
import { Card } from "@/components/ds/Card";
import { Badge } from "@/components/ds/Badge";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";
import { FAQ } from "@/lib/content";

/** `a` is a node so a page can swap in a richer answer - /us renders the full
 *  India scope as a grid inside one of these panels. `wide` drops the reading
 *  measure for those, which only makes sense for a wall of prose. */
type FaqItem = { q: string; a: React.ReactNode; special?: boolean; wide?: boolean };

/** FAQ accordion - single panel open at a time; first item open by default.
 *  Defaults to the main-site FAQ; pass `items`/`heading` to reuse on /gulf. */
export function Faq({
  items = FAQ,
  heading = "Before you join",
  showAsk = true,
}: {
  items?: FaqItem[];
  heading?: string;
  /** /us carries its own WhatsApp CTAs in the hero, capabilities and pricing
   *  sections, and pricing sits directly above this one - a fourth link a
   *  screen later stops reading as secondary. */
  showAsk?: boolean;
} = {}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section data-screen-label="FAQ" style={{ padding: "64px var(--gutter)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>Questions</Eyebrow>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            color: "var(--text-strong)",
            margin: "16px 0 36px",
            fontWeight: 500,
          }}
        >
          {heading}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Card key={f.q} padded={false}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 600,
                      color: "var(--text-strong)",
                    }}
                  >
                    {f.q}
                  </span>
                  <Icon
                    name="chevron-right"
                    size={18}
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform var(--dur-base) var(--ease-calm)",
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: "0 24px 22px" }}>
                    {f.special && (
                      <span style={{ display: "inline-block", marginBottom: 10 }}>
                        <Badge tone="brand">Never.</Badge>
                      </span>
                    )}
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-body)",
                        lineHeight: 1.6,
                        maxWidth: f.wide ? undefined : 560,
                      }}
                    >
                      {f.a}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* The escape hatch, placed where unanswered questions actually surface.
            Deliberately not a floating button: the sticky CTA already owns the
            bottom of the screen on mobile, and a second always-on CTA would
            divert the highest-intent visitors out of the measured funnel. */}
        {showAsk && (
        <div
          style={{
            marginTop: 22,
            padding: "18px 20px",
            borderRadius: "var(--radius-xl)",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", marginBottom: 2 }}>
              Still have a question?
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Ask us on WhatsApp - a real person answers.
            </div>
          </div>
          <WhatsAppLink
            placement="faq"
            message="Hi Niro, I have a question before joining."
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: "var(--radius-pill)",
              border: "1.5px solid var(--brand)",
              color: "var(--brand)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Chat on WhatsApp
          </WhatsAppLink>
        </div>
        )}
      </div>
    </section>
  );
}
