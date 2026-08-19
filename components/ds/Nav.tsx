import { Wordmark } from "./Wordmark";
import { JoinCta } from "./JoinCta";

/**
 * Minimal top nav - wordmark left, one CTA right, nothing else competes.
 * Sticky, translucent + backdrop-blur. The CTA opens the join modal (home);
 * on a standalone page pass `ctaHref` to render a plain link back home instead.
 */
export function Nav({
  cta = "Join the waitlist",
  ctaHref,
  homeHref = "/",
  ctaPosition,
  dark = false,
}: {
  cta?: string;
  ctaHref?: string;
  /** Where the wordmark links. Defaults to home; on a dead-end page (e.g.
   *  /gulf) pass that page's own path so no link leads back to the main site. */
  homeHref?: string;
  /** Optional CTA-position tag for analytics (e.g. "nav"). */
  ctaPosition?: string;
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
        <a href={homeHref} aria-label="Niro - home" style={{ display: "inline-flex" }}>
          <Wordmark dark={dark} />
        </a>
        {ctaHref ? (
          <a href={ctaHref} className="nav-cta">
            {cta}
          </a>
        ) : (
          <JoinCta className="nav-cta" position={ctaPosition}>
            {cta}
          </JoinCta>
        )}
      </div>
    </header>
  );
}
