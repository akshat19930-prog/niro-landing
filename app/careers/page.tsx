import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ROLES, CAREERS_INTRO } from "@/lib/content";
import { SUPPORT_WHATSAPP } from "@/lib/config";

/**
 * /careers - open roles.
 *
 * Built as a trust asset first and a hiring asset second. The most common
 * objection in the qualitative research was that Niro might be software
 * pretending to be people ("I would be suspicious it's basically a glorified
 * wrapper, they are not people"). A page of real, named, open roles answers
 * that better than any FAQ answer can - which is also why it must only ever
 * list roles we are genuinely filling.
 */
export const metadata: Metadata = {
  title: "Careers - Niro",
  description:
    "Open roles at Niro: Founding Engineer and Concierge Operations, both in Bengaluru.",
  alternates: { canonical: "https://tellniro.com/careers" },
};

export default function CareersPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Work at Niro</h1>
        <p>{CAREERS_INTRO}</p>

        <div className="roles">
          {ROLES.map((r) => (
            <section key={r.title} className="role-card">
              <header className="role-head">
                <h2>{r.title}</h2>
                <p className="role-meta">
                  {r.location} &middot; {r.type}
                </p>
              </header>
              <p className="role-blurb">{r.blurb}</p>
              <p className="role-looking-label">What we&rsquo;re looking for</p>
              <ul className="role-looking">
                {r.looking.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <a
                className="btn btn-secondary"
                href={`mailto:careers@tellniro.com?subject=${encodeURIComponent(
                  r.title + " - application"
                )}`}
              >
                Apply for this role
              </a>
            </section>
          ))}
        </div>

        <h2>Not one of these?</h2>
        <p>
          If you have spent years doing the kind of work our members&rsquo;
          parents need done, and you would do it well for someone else&rsquo;s
          family, write to{" "}
          <a href="mailto:careers@tellniro.com">careers@tellniro.com</a> or{" "}
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            message us on WhatsApp
          </a>
          . Tell us about one problem you solved that nobody asked you to.
        </p>
      </article>
    </PageShell>
  );
}
