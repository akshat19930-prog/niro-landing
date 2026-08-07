import { Wordmark } from "./Wordmark";

/**
 * Minimal top nav — wordmark left, one CTA right, nothing else competes.
 * Sticky, translucent + backdrop-blur. The CTA is an anchor to #join so it
 * smooth-scrolls with zero JS.
 */
export function Nav({
  cta = "Join the waitlist",
  href = "#join",
  dark = false,
}: {
  cta?: string;
  href?: string;
  dark?: boolean;
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: dark ? "rgba(12,31,24,0.72)" : "rgba(246,241,231,0.72)",
        backdropFilter: "saturate(1.4) blur(14px)",
        WebkitBackdropFilter: "saturate(1.4) blur(14px)",
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "var(--border)"}`,
      }}
    >
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "14px var(--gutter)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a href="/" aria-label="Niro — home" style={{ display: "inline-flex" }}>
          <Wordmark dark={dark} />
        </a>
        <a href={href} className="nav-cta">
          {cta}
        </a>
      </div>
    </header>
  );
}
