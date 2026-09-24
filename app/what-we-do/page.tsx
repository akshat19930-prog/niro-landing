import { SHARE_CARD } from "@/lib/content";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { INDIA_SCOPE, SERVICE_CITIES } from "@/lib/content";
import { JoinCta } from "@/components/ds/JoinCta";

/**
 * /what-we-do - the full scope, as a page rather than a screenshot.
 *
 * This exists because the founders were pasting a screenshot of the task grid
 * into WhatsApp threads with leads. A link does the same job better: it is
 * legible on every screen, it can be updated without re-sending, and with an
 * OG image it still previews as a card in the chat. The og:image lives at
 * /og/what-we-do.png and is generated from the same list.
 */
export const metadata: Metadata = {
  title: "What Niro can do - the full list",
  description:
    "Health admin and emergencies, home and chores, travel, paperwork, banking and EPFO - the complete list of what Niro handles for your family in India.",
  alternates: { canonical: "https://tellniro.com/what-we-do" },
  openGraph: {
    title: SHARE_CARD.title,
    description: SHARE_CARD.description,
    url: "https://tellniro.com/what-we-do",
    images: [{ url: "https://tellniro.com/og/what-we-do.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: SHARE_CARD.title,
    description: SHARE_CARD.description,
    card: "summary_large_image",
    images: ["https://tellniro.com/og/what-we-do.png"],
  },
};

export default function WhatWeDoPage() {
  const total = INDIA_SCOPE.reduce((n, g) => n + g.items.length, 0);

  return (
    <PageShell>
      <article className="prose">
        <h1>Everything Niro can do</h1>
        <p>
          {total} things your family might need doing in India, grouped the way
          our ops team actually groups them. If what you need isn&rsquo;t on the
          list, ask anyway &mdash; this is a list of what comes up most, not a
          limit.
        </p>

        <div className="scope-grid">
          {INDIA_SCOPE.map((g) => (
            <section key={g.title} className="scope-group">
              <h2>{g.title}</h2>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <h2>Where we do it</h2>
        <p>
          Live today in{" "}
          <strong>
            {SERVICE_CITIES.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}
          </strong>
          . If your family is somewhere else, join anyway and tell us the city
          &mdash; we open where our members&rsquo; families already are.
        </p>

        <div className="scope-cta">
          <JoinCta className="btn btn-primary btn-lg">Join the beta</JoinCta>
        </div>
      </article>
    </PageShell>
  );
}
