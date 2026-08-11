"use client";

import { useState } from "react";
import { Card } from "@/components/ds/Card";
import { Badge } from "@/components/ds/Badge";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { FAQ } from "@/lib/content";

/** FAQ accordion - single panel open at a time; first item open by default. */
export function Faq() {
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
          Before you join
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQ.map((f, i) => {
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
                        maxWidth: 560,
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
      </div>
    </section>
  );
}
