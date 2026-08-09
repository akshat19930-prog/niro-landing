import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About Niro - Your family's own person in India",
  description:
    "Why we built Niro, and the team behind it. Operated by Destreza Eduventures Pvt Ltd.",
};

type Founder = {
  name: string;
  monogram: string;
  role: string;
  bio: string;
  linkedin: string;
};

const FOUNDERS: Founder[] = [
  {
    name: "Akshat Pandey",
    monogram: "AP",
    role: "Co-founder",
    bio: "11 years building consumer startups across healthcare (core team at Curefit), fintech (business head, payments at Navi), and ecommerce. Second-time founder.",
    linkedin: "https://www.linkedin.com/in/akshat-pandey-7b241a72/",
  },
  {
    name: "Paarth Dhar",
    monogram: "PD",
    role: "Co-founder",
    bio: "12 years building consumer startups across fintech (VP, Growth at AngelOne) and ecommerce. Second-time founder - exited his first company to AngelOne.",
    linkedin: "https://www.linkedin.com/in/paarthdhar/",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>About Niro</h1>

        <p>
          Most of us left India for the opportunity, not to leave our parents
          behind. But distance has a quiet cost. The EPFO claim that never
          resolves. The plumber who needs someone to be home. The hospital visit
          you hear about only after it&apos;s over. Your parents don&apos;t call
          because they don&apos;t want to worry you - so you carry a low hum of
          guilt instead.
        </p>

        <p>
          <strong>
            Niro is your family&apos;s own person in India.
          </strong>{" "}
          One membership gives your parents a named, capable associate for the
          errands, bills, appointments, and emergencies that are hard to manage
          from another time zone - so you can be there, from anywhere. Not an app
          that adds another thing to your list. A person who takes things off it.
        </p>

        <h2>Why we&apos;re building it</h2>
        <p>
          We&apos;ve spent our careers building consumer products that earn trust
          with people&apos;s health and money - the two things families worry about
          most. We kept meeting the same person: a successful professional abroad,
          quietly stretched thin managing a household 8,000 km away, with no one to
          hand it to. We built Niro for them, and for our own families.
        </p>

        <h2>The team</h2>
        <div className="founder-grid">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="founder-card">
              <div className="founder-avatar" aria-hidden="true">
                {f.monogram}
              </div>
              <div>
                <p className="founder-name">{f.name}</p>
                <p className="founder-role">{f.role}</p>
              </div>
              <p className="founder-bio">{f.bio}</p>
              <a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="founder-link"
              >
                LinkedIn ↗
              </a>
            </div>
          ))}
        </div>

        <h2>The company</h2>
        <p>
          Niro is operated by <strong>Destreza Eduventures Pvt Ltd</strong>. If
          you&apos;d like to reach us, email{" "}
          <a href="mailto:hello@tellniro.com">hello@tellniro.com</a>.
        </p>

        <div style={{ marginTop: 32 }}>
          <a href="/#join" className="btn btn-primary btn-lg">
            Join the waitlist
          </a>
        </div>
      </article>
    </PageShell>
  );
}
