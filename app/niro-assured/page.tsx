import type { Metadata } from "next";

/**
 * /niro-assured -> /niro-assure
 *
 * The product is now "Niro Assure". This stub stays because the old URL
 * shipped to production - it was in the footer, in the trust section, in the
 * emergency FAQ answer, and in anything anyone copied out of those. A static
 * export has no server redirects, so this is a meta refresh plus a visible
 * link for any browser that ignores it. noindex, so it never competes with the
 * real page. Same pattern as /emergency/.
 */
export const metadata: Metadata = {
  title: "Niro Assure",
  robots: { index: false, follow: false },
  other: { refresh: "0; url=/niro-assure/" },
};

export default function NiroAssuredRedirect() {
  return (
    <main style={{ padding: "72px 20px", textAlign: "center" }}>
      <p style={{ fontSize: "var(--text-md)" }}>
        This page is now <a href="/niro-assure/">Niro Assure</a>.
      </p>
    </main>
  );
}
