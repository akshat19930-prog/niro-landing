import type { Metadata } from "next";

/**
 * /emergency -> /niro-assure
 *
 * The page was renamed to its product name. This stub stays because the old
 * URL already shipped to production - it was in the live footer, in the trust
 * section, and in anything anyone copied out of either. A static export has no
 * server redirects, so this is a meta refresh plus a visible link for any
 * browser that ignores it. noindex, so it never competes with the real page.
 */
export const metadata: Metadata = {
  title: "Niro Assure",
  robots: { index: false, follow: false },
  other: { refresh: "0; url=/niro-assure/" },
};

export default function EmergencyRedirect() {
  return (
    <main style={{ padding: "72px 20px", textAlign: "center" }}>
      <p style={{ fontSize: "var(--text-md)" }}>
        This page is now <a href="/niro-assure/">Niro Assure</a>.
      </p>
    </main>
  );
}
