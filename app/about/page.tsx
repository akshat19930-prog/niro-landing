import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About Niro - The team behind Niro",
  description:
    "Why we built Niro, and the team behind it.",
};

type Founder = {
  name: string;
  photo: string;
  role: string;
  bio: string;
  linkedin: string;
};

const FOUNDERS: Founder[] = [
  {
    name: "Akshat Pandey",
    photo: "/people/akshat.jpg",
    role: "Co-founder",
    bio: "11 years building consumer startups across healthcare (core team at Curefit), fintech (business head, payments at Navi), and ecommerce. Second-time founder.",
    linkedin: "https://www.linkedin.com/in/akshat-pandey-7b241a72/",
  },
  {
    name: "Paarth Dhar",
    photo: "/people/paarth.jpg",
    role: "Co-founder",
    bio: "12 years building consumer startups across fintech (VP, Growth at AngelOne) and ecommerce. Second-time founder - exited his first company to AngelOne.",
    linkedin: "https://www.linkedin.com/in/paarthdhar/",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>The people behind Niro</h1>
        <p>
          Two second-time founders who spent years managing a household 8,000 km
          away - and built the person we wished we&apos;d had.
        </p>

        <div className="founder-grid">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="founder-card">
              <div
                className="founder-photo"
                role="img"
                aria-label={f.name}
                style={{
                  backgroundImage: `url('${f.photo}'), linear-gradient(150deg, var(--brand-soft), #c9d8cd)`,
                }}
              />
              <p className="founder-name">{f.name}</p>
              <p className="founder-role">{f.role}</p>
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

        <h2>Why we&apos;re building it</h2>
        <p>
          We&apos;ve spent our careers building consumer products that earn trust
          with people&apos;s health and money - the two things families worry about
          most. We kept meeting the same person: a successful professional abroad,
          quietly stretched thin managing a household 8,000 km away, with no one to
          hand it to. We built Niro for them, and for our own families.
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
