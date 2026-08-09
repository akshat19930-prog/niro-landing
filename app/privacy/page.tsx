import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy - Niro",
  description:
    "How Niro (Destreza Eduventures Pvt Ltd) collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: 6 July 2026</p>

        <p className="note">
          This policy covers our pre-launch waitlist. We recommend a review by
          legal counsel before onboarding paying members.
        </p>

        <p>
          This Privacy Policy explains how <strong>Destreza Eduventures Pvt Ltd</strong>{" "}
          (&ldquo;Niro&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses,
          and protects information when you visit tellniro.com and join our
          waitlist. We are the data fiduciary responsible for your personal data.
          By joining the waitlist you agree to this policy.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Your email address</strong> - so we can contact you about early
            access.
          </li>
          <li>
            <strong>What you tell us you need</strong> - the task categories you
            select and any plan preference, so we understand demand and can tailor
            our first conversation with you.
          </li>
          <li>
            <strong>Campaign attribution</strong> - how you arrived (UTM tags,
            referral code, and ad-click identifiers such as Meta&apos;s{" "}
            <em>fbclid</em>), so we can measure which messages resonate.
          </li>
          <li>
            <strong>Basic device and usage data</strong> - collected automatically
            through cookies and similar technologies (see below).
          </li>
        </ul>
        <p>
          We do <strong>not</strong> ask for or store passwords, one-time
          passcodes, bank details, government ID numbers, or your parents&apos;
          personal information at the waitlist stage.
        </p>

        <h2>How we use it</h2>
        <ul>
          <li>To let you know when early access opens and to run onboarding.</li>
          <li>
            To understand which offers and audiences to serve, and to improve the
            product before launch.
          </li>
          <li>
            To measure and optimise our advertising, including matching signups to
            the campaigns that drove them.
          </li>
          <li>To respond to your questions and provide support.</li>
        </ul>

        <h2>Advertising &amp; analytics cookies</h2>
        <p>
          We use the <strong>Meta Pixel</strong> and Meta&apos;s Conversions API to
          measure the performance of ads on Facebook and Instagram. These tools set
          cookies and share limited event data (such as page views and waitlist
          signups) with Meta so we can attribute results and reach relevant
          audiences. We share a hashed event identifier so the same signup is not
          counted twice. You can control cookies through your browser settings and
          manage ad personalisation within your Meta account.
        </p>

        <h2>Who we share it with</h2>
        <p>
          We do not sell your personal data. We share it only with service providers
          who help us operate - for example, our website host, email tooling, and
          Meta for advertising measurement - and only to the extent they need it.
          These providers may process data outside India; where they do, we take
          reasonable steps to ensure it remains protected. We may also disclose
          information if required by law.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep waitlist information for as long as needed to invite you to the
          product and for our legitimate business records. You can ask us to delete
          your data at any time, and we will do so within 30 days unless we are
          required to retain it by law.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct,
          or delete your personal data, to withdraw consent, and to complain to a
          regulator. This policy is intended to align with India&apos;s Digital
          Personal Data Protection Act, 2023 and, for members in the EU/UK, the
          GDPR. To exercise any right, email us at the address below.
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable technical and organisational measures to protect your
          information. No method of transmission or storage is completely secure,
          but we work to keep the little data we hold safe.
        </p>

        <h2>Children</h2>
        <p>
          Niro is intended for adults (18+). We do not knowingly collect data from
          children.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy as the product develops. We will post the
          revised version here with a new date.
        </p>

        <h2>Contact</h2>
        <p>
          For any privacy question or request, email us at{" "}
          <a href="mailto:privacy@tellniro.com">privacy@tellniro.com</a>. Destreza
          Eduventures Pvt Ltd, Indique Orion, 4th Main Rd, Agara Village, 1st
          Sector, HSR Layout, Bengaluru, Karnataka 560102.
        </p>
      </article>
    </PageShell>
  );
}
