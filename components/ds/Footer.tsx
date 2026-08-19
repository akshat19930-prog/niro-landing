import { Wordmark } from "./Wordmark";
import { SUPPORT_WHATSAPP } from "@/lib/config";

/**
 * Minimal footer for the waitlist stage. "Contact us" opens a WhatsApp chat to
 * our support line; the rest are the site's legal/about pages.
 */
const links: { label: string; href: string; external?: boolean }[] = [
  { label: "About", href: "/about/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
  {
    label: "Contact us",
    href: `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
      "Hi Niro, I have a question."
    )}`,
    external: true,
  },
];

export function Footer({
  tagline = "Niro: your presence in India - a go-getter home manager to get things done for you and your family.",
}: {
  tagline?: string;
} = {}) {
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
              {tagline}
            </p>
          </div>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="footer-link"
                {...(l.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
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
            © {year} Niro
          </span>
        </div>
      </div>
    </footer>
  );
}
