import { Icon } from "./Icon";

type Plan = {
  id: string;
  name: string;
  price: string;
  per: string;
  sub: string;
  lead?: string;
  features: string[];
  highlight: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    id: "lite",
    name: "Niro Lite",
    price: "$55",
    per: "/month",
    sub: "The essentials, covered",
    features: [
      "Family WhatsApp group for tasks",
      "8 tasks included",
      "Emergency response — ambulance partner + 24/7 remote coordination",
    ],
    highlight: false,
  },
  {
    id: "prime",
    name: "Niro Prime",
    price: "$99",
    per: "/month",
    sub: "Your family, fully covered",
    lead: "Everything in Lite, plus",
    features: [
      "Unlimited tasks",
      "Emergency response — our own person at the hospital, admission handled",
      "Fortnightly proactive check-in calls",
      "Cyber-fraud cover — insurance up to ₹20L, monitoring & education",
      "$10/mo wellness credits — tests, physio & more",
    ],
    highlight: true,
    badge: "Most popular",
  },
];

/** Niro Lite vs Niro Prime, monthly. Both CTAs go to the single #join flow;
 *  risk-reversal is "first task free · cancel anytime" (no refund promise). */
export function PricingCard({ href = "#join" }: { href?: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        alignItems: "start",
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
          {p.badge && (
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
              {p.badge}
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

          {p.lead && (
            <div
              style={{
                marginTop: 20,
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: p.highlight ? "rgba(255,255,255,0.92)" : "var(--text-strong)",
              }}
            >
              {p.lead}
            </div>
          )}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: p.lead ? "10px 0 20px" : "20px 0",
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
                    flexShrink: 0,
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
            Join the waitlist
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
            <Icon name="check-circle" size={14} />
            First task free · cancel anytime
          </div>
        </div>
      ))}
    </div>
  );
}
