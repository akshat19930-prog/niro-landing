import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { WhatsAppLink } from "./WhatsAppLink";

/**
 * Minimal footer for the waitlist stage. "Contact us" opens a WhatsApp chat to
 * our support line; the rest are the site's legal/about pages.
 */
const links: { label: string; href: string }[] = [
  { label: "About", href: "/about/" },
  { label: "Niro Assured", href: "/niro-assured/" },
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
        // Bottom padding is a variable so globals.css can grow it on mobile to
        // clear the fixed sticky CTA. An inline shorthand would outrank a
        // stylesheet rule, so the override has to come through the var.
        padding:
          "var(--space-8) var(--gutter) var(--footer-pad-bottom, var(--space-6))",
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
          {/* The registered entity, not the brand. The CIN is the part that
              actually earns trust: it is checkable against the MCA register in
              seconds, which the company name alone is not. Set at body size in a
              legible grey rather than the usual near-invisible copyright
              treatment, because the point of the block is to be read. */}
          <div
            style={{
              fontSize: "var(--text-sm)",
              lineHeight: 1.7,
              color: "#9AA79E",
            }}
          >
            <div>© {year} Domiro Private Limited</div>
            <div>
              CIN:{" "}
              <span style={{ whiteSpace: "nowrap" }}>U62099KA2026PTC228168</span>
            </div>
            <div style={{ maxWidth: 520 }}>
              Registered office: Old No. 223, New No. 2210, 2nd Main Road, 6th
              Block, Jayanagar West, Bangalore South, Bangalore 560070,
              Karnataka, India.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
