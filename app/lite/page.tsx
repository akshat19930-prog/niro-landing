import type { Metadata } from "next";

/**
 * /lite -> /#pricing-fold (retired 4 Nov 2026)
 *
 * Niro Lite, the 20-task pack, is no longer sold: the site now shows one
 * membership, $49 a month billed $147 every 3 months, or $65 month to month.
 * Members who already bought a pack keep it for its 12 months.
 *
 * The route stays as a noindex meta-refresh stub because the URL shipped: it
 * was linked from the pricing section, and sales shared it on calls and in
 * WhatsApp. A static export has no server redirects, so this is a meta
 * refresh plus a visible link for any browser that ignores it. The refresh is
 * rendered as <meta http-equiv> in the page (React hoists it into <head>):
 * Next's `metadata.other` emits <meta name="refresh">, which browsers ignore.
 * The page itself lives in git history.
 */
export const metadata: Metadata = {
  title: "Niro",
  robots: { index: false, follow: false },
};

export default function LiteRetired() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/#pricing-fold" />
      <main style={{ padding: "72px 20px", textAlign: "center" }}>
        <p style={{ fontSize: "var(--text-md)" }}>
          Niro Lite is no longer offered. See <a href="/#pricing-fold">Niro membership pricing</a>.
        </p>
      </main>
    </>
  );
}
