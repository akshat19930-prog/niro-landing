import type { Metadata } from "next";

/**
 * /us-v2 -> / (retired 26 Sept 2026)
 *
 * The India-first staging copy of /us. The test it was staged for is
 * retired, so there is nothing left to review.
 *
 * The route stays as a noindex meta-refresh stub because the URL shipped: it
 * is in old ad destinations, in anything pasted into WhatsApp, and in the
 * sheets. A static export has no server redirects, so this is a meta refresh
 * plus a visible link for any browser that ignores it. Same pattern as
 * /emergency and /niro-assured.
 *
 * The page itself lives in git history, and components/sections/UsPage.tsx is still in the repo
 * unmounted, so the test can be revived without rewriting it.
 */
export const metadata: Metadata = {
  title: "Niro",
  robots: { index: false, follow: false },
  other: { refresh: "0; url=/" },
};

export default function UsV2Retired() {
  return (
    <main style={{ padding: "72px 20px", textAlign: "center" }}>
      <p style={{ fontSize: "var(--text-md)" }}>
        This page has moved to <a href="/">tellniro.com</a>.
      </p>
    </main>
  );
}
