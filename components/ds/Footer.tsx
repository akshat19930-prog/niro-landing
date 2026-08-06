import { Wordmark } from "./Wordmark";

const cols = [
  { head: "Niro", links: ["How it works", "Pricing", "For your parents", "Our associates"] },
  { head: "Company", links: ["Our story", "Careers", "Press", "Contact"] },
  { head: "Legal", links: ["Terms", "Privacy", "Refund Policy", "Data & security"] },
];

/** Niro footer — quiet, warm, legal links. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background: "var(--forest-950)",
        color: "#CBD4CB",
        padding: "var(--space-8) var(--gutter) var(--space-6)",
      }}
    >
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-7)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: 300 }}>
            <Wordmark dark size={30} />
            <p
              style={{
                marginTop: 14,
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                color: "#9AA79E",
              }}
            >
              Your family&apos;s presence in India. A calm, capable friend who
              happens to have world-class technology.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-7)" }}>
            {cols.map((c) => (
              <nav
                key={c.head}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minWidth: 130,
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-semibold)",
                    letterSpacing: "var(--tracking-wide)",
                    textTransform: "uppercase",
                    color: "var(--accent-strong)",
                  }}
                >
                  {c.head}
                </span>
                {c.links.map((l) => (
                  <a key={l} href="#" className="footer-link">
                    {l}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: "var(--space-7)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "var(--text-xs)", color: "#7C8A80" }}>
            © {year} Niro Family Concierge, Inc. Serving families across the US
            &amp; UAE.
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: "#7C8A80" }}>
            Made with care, 12,000 km apart.
          </span>
        </div>
      </div>
    </footer>
  );
}
