import type { Metadata } from "next";

/**
 * /gulf -> / (retired 26 Sept 2026)
 *
 * The Gulf dual-sided test is over: one session in September, a $149 SKU
 * that no longer matches the live pricing, and a price A/B nobody is reading.
 *
 * The route stays as a noindex meta-refresh stub because the URL shipped: it
 * is in old ad destinations, in anything pasted into WhatsApp, and in the
 * sheets. A static export has no server redirects, so this is a meta refresh
 * plus a visible link for any browser that ignores it. Same pattern as
 * /emergency and /niro-assured.
 *
 * The page itself lives in git history, and components/sections/GulfPage.tsx is still in the repo
 * unmounted, so the test can be revived without rewriting it.
 */
export const metadata: Metadata = {
  title: "Niro",
  robots: { index: false, follow: false },
  other: { refresh: "0; url=/" },
};

export default function GulfRetired() {
  return (
    <main style={{ padding: "72px 20px", textAlign: "center" }}>
      <p style={{ fontSize: "var(--text-md)" }}>
        This page has moved to <a href="/">tellniro.com</a>.
      </p>
    </main>
  );
}
