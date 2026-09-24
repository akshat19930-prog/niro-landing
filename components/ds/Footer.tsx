import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { WhatsAppLink } from "./WhatsAppLink";
import { SUPPORT_WHATSAPP } from "@/lib/config";

/**
 * Minimal footer for the waitlist stage. "Contact us" opens a WhatsApp chat to
 * our support line; the rest are the site's legal/about pages.
 */
const links: { label: string; href: string }[] = [
  { label: "About", href: "/about/" },
  { label: "Niro Assure", href: "/niro-assure/" },
  { label: "We're hiring", href: "/careers/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
];

export function Footer({
  tagline = "Niro: your presence in India, and your family\u2019s 24\u00d77 personal assistant.",
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
          <nav className="footer-nav">
            {/* Internal pages use client-side navigation (prefetched) so the
                footer never triggers a full-document reload. */}
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
            {/* Was a plain wa.me link with a fixed prefill, so an inbound chat
                arrived with no page, campaign or creative attached. */}
            <WhatsAppLink
              placement="footer"
              phone={SUPPORT_WHATSAPP}
              className="footer-link"
              showIcon={false}
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              Contact us
            </WhatsAppLink>
          </nav>
        </div>
        <div
          style={{
            marginTop: "var(--space-7)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {/* The registered entity, not the brand. This line is the only place
              on the page a visitor can check that Niro is a real, incorporated
              company - so it is set at body size and a legible grey rather than
              the usual near-invisible copyright treatment. */}
          <span style={{ fontSize: "var(--text-sm)", color: "#9AA79E" }}>
            © {year} Domiro Private Limited
          </span>
        </div>
      </div>
    </footer>
  );
}
