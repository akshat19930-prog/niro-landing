import { Wordmark } from "./Wordmark";

/**
 * Minimal footer for the waitlist stage. Only the links a page that captures
 * emails + runs a tracking pixel actually needs: About, Privacy, Terms,
 * Contact. Privacy/Terms/About are placeholders (#) until content is written.
 */
const links: { label: string; href: string }[] = [
  { label: "About", href: "/about/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
  { label: "Contact", href: "mailto:hello@tellniro.com" },
];

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
            gap: "var(--space-6)",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ maxWidth: 320 }}>
            <Wordmark dark size={30} />
            <p
              style={{
                marginTop: 14,
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                color: "#9AA79E",
              }}
            >
              Your family&apos;s presence in India. A calm, capable friend who happens to
              have world-class technology.
            </p>
          </div>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} className="footer-link">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div
          style={{
            marginTop: "var(--space-7)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span style={{ fontSize: "var(--text-xs)", color: "#7C8A80" }}>
            © {year} Destreza Eduventures Pvt Ltd
          </span>
        </div>
      </div>
    </footer>
  );
}
