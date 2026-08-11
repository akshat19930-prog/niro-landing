import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Use - Niro",
  description:
    "The terms that govern your use of the Niro website and waitlist.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Terms of Use</h1>
        <p className="updated">Last updated: 6 July 2026</p>

        <p className="note">
          These terms cover our pre-launch waitlist. We recommend a review by
          legal counsel before launch.
        </p>

        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your use of tellniro.com
          (the &ldquo;Site&rdquo;), operated by{" "}
          <strong>Niro</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using
          the Site or joining the
          waitlist, you agree to these Terms. If you do not agree, please do not use
          the Site.
        </p>

        <h2>The waitlist is not a purchase</h2>
        <p>
          Joining the waitlist reserves your interest in Niro. It is{" "}
          <strong>not</strong> an order, a contract for services, or a payment. Any
          prices, plans, or features shown are indicative and may change before
          launch. A paid membership, when available, will be governed by separate
          terms you agree to at that time.
        </p>

        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years old to use the Site and join the waitlist.
          By doing so, you confirm that the information you provide is accurate and
          that you are entitled to share it.
        </p>

        <h2>Niro is not an emergency service</h2>
        <p>
          <strong>
            Niro is a concierge and coordination service, not a medical, security,
            legal, or emergency service.
          </strong>{" "}
          In any emergency, contact your local emergency number and the appropriate
          professionals directly. Nothing on this Site should be relied on as
          medical, legal, financial, or professional advice.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the Site - including attempting to disrupt it,
          access it without authorisation, submit false or others&apos; information
          without consent, or use it for any unlawful purpose.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The Niro name, logo, text, design, and other content on the Site are owned
          by Niro and protected by applicable laws. You may
          not copy, reproduce, or use them without our written permission. Names of
          third parties are the property of their respective owners.
        </p>

        <h2>Disclaimers</h2>
        <p>
          The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;.
          We make no warranties about its accuracy, availability, or fitness for a
          particular purpose. Testimonials and examples shown are illustrative of the
          kinds of tasks Niro is designed to handle and do not guarantee any specific
          outcome.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Niro and its founders, employees,
          and partners will not be liable for any indirect, incidental, or
          consequential loss arising from your use of the Site or the waitlist.
        </p>

        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of India. Any dispute is subject to
          the exclusive jurisdiction of the courts at Bengaluru, India.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Site
          after changes are posted means you accept the updated Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Email us at{" "}
          <a href="mailto:hello@tellniro.com">hello@tellniro.com</a>. Registered
          office: Indique Orion, 4th Main Rd, Agara Village, 1st Sector, HSR
          Layout, Bengaluru, Karnataka 560102.
        </p>
      </article>
    </PageShell>
  );
}
