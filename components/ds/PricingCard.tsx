import { Icon } from "./Icon";

type Plan = {
  id: string;
  name: string;
  price: string;
  per: string;
  sub: string;
  features: string[];
  highlight: boolean;
};

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$69",
    per: "/month",
    sub: "Cancel anytime. No lock-in.",
    features: [
      "Unlimited everyday tasks",
      "One dedicated associate",
      "Voice-note updates",
      "Every task closed with proof",
    ],
    highlight: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: "$590",
    per: "/year",
    sub: "Two months on us — $49/mo.",
    features: [
      "Everything in Monthly",
      "Priority on emergencies",
      "Quarterly parent well-being call",
      "Locked price for life",
    ],
    highlight: true,
  },
];

/** Monthly + annual side by side, annual highlighted, refund promise inline.
 *  CTAs anchor to #join (single conversion goal). */
export function PricingCard({ href = "#join" }: { href?: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      }}
    >
      {plans.map((p) => (
        <div
          key={p.id}
          style={{
            position: "relative",
            background: p.highlight ? "var(--forest-700)" : "var(--surface-card)",
            color: p.highlight ? "var(--ivory)" : "var(--text-body)",
            border: p.highlight
              ? "1.5px solid var(--forest-700)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6) var(--space-5) var(--space-5)",
            boxShadow: p.highlight ? "var(--shadow-brand)" : "var(--shadow-2)",
          }}
        >
          {p.highlight && (
            <span
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--forest-950)",
                background: "var(--gold-400)",
                padding: "4px 11px",
                borderRadius: 999,
              }}
            >
              Best value
            </span>
          )}
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: p.highlight ? "var(--gold-300)" : "var(--accent-strong)",
            }}
          >
            {p.name}
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 46,
                fontWeight: 600,
                color: p.highlight ? "#fff" : "var(--text-strong)",
                lineHeight: 1,
              }}
            >
              {p.price}
            </span>
            <span
              style={{
                fontSize: "var(--text-md)",
                color: p.highlight ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
              }}
            >
              {p.per}
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: "var(--text-sm)",
              color: p.highlight ? "var(--gold-300)" : "var(--brand)",
              fontWeight: 500,
            }}
          >
            {p.sub}
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "20px 0",
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}
          >
            {p.features.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: "var(--text-sm)",
                }}
              >
                <Icon
                  name="check-circle"
                  size={18}
                  style={{
                    marginTop: 1,
                    color: p.highlight ? "var(--gold-300)" : "var(--brand)",
                  }}
                />
                <span
                  style={{ color: p.highlight ? "rgba(255,255,255,0.92)" : "var(--text-body)" }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
          <a
            href={href}
            className={`price-cta ${p.highlight ? "price-cta-hl" : "price-cta-plain"}`}
          >
            Reserve at {p.price}
            {p.per}
          </a>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              fontSize: "var(--text-xs)",
              color: p.highlight ? "rgba(255,255,255,0.72)" : "var(--text-muted)",
            }}
          >
            <Icon name="shield-check" size={14} />
            30-day full refund. No questions, ever.
          </div>
        </div>
      ))}
    </div>
  );
}
