import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Use - Niro",
  description:
    "The terms that govern your use of the Niro website and beta.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Terms of Use</h1>
        <p className="updated">Last updated: 24 September 2026</p>

        <p className="note">
          These terms cover both paid memberships and the beta. They have not
          yet been reviewed by legal counsel - that review is outstanding.
        </p>

        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your use of tellniro.com
          (the &ldquo;Site&rdquo;) and the Niro service, both operated by{" "}
          <strong>Domiro Private Limited</strong>, a company incorporated in
          India (CIN{" "}
          <span style={{ whiteSpace: "nowrap" }}>U62099KA2026PTC228168</span>)
          and trading as <strong>Niro</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;). By using the Site or joining the beta, you agree
          to these Terms. If you do not agree, please do not use the Site.
        </p>

        <h2>Membership, billing and renewal</h2>
        <p>
          Niro is sold as a membership. There are two ways to start:{" "}
          <strong>US $99 per month</strong>, or <strong>US $250 for three
          months</strong>, billed once at the start of the term. Both continue at
          US $99 per month afterwards, charged to the card you have on file, until
          you cancel. We send you a reminder{" "}
          <strong>seven days before every renewal</strong> so no charge is a
          surprise.
        </p>
        <p>
          Joining the beta without paying is{" "}
          <strong>not</strong> an order, a contract for services, or a payment. Any
          prices, plans, or features shown to a beta member are indicative and
          may change before they join.
        </p>

        <h2>What your membership fee covers</h2>
        <p>
          Your fee covers Niro&rsquo;s own time - the calls, the chasing, the
          coordination, and a Niro Assistant on the ground - with no cap on the
          number of tasks. It does <strong>not</strong> cover third-party costs
          incurred on your behalf, which are billed to you at actual cost: lab
          charges, ambulance fees, government and legal fees, vendor and
          contractor payments, and cab fares among them. We will always tell you
          the expected cost and obtain your approval before spending on your
          behalf.
        </p>

        <h2>30-day money-back guarantee</h2>
        <p>
          If Niro is not right for your family, tell your family manager or write
          to <a href="mailto:hello@tellniro.com">hello@tellniro.com</a> within{" "}
          <strong>30 days</strong> of your first payment and we will refund you in
          full. No forms, and no exit interview. Three boundaries apply:
        </p>
        <ul>
          <li>
            <strong>Third-party costs already paid out are not refundable.</strong>{" "}
            We can refund our own fee; we cannot recall money already spent with a
            hospital, vendor or government office on your behalf.
          </li>
          <li>
            <strong>The three-month membership is refunded in full within the
            first 30 days</strong>, less any such third-party costs. After day 30
            it runs to the end of its term.
          </li>
          <li>
            <strong>One guarantee per household.</strong>
          </li>
        </ul>
        <p>
          Refunds are returned to the original payment method within five working
          days of us confirming them.
        </p>

        <h2>Cancelling</h2>
        <p>
          You can cancel at any time, with no notice period, by telling your
          family manager or writing to{" "}
          <a href="mailto:hello@tellniro.com">hello@tellniro.com</a>. Cancellation
          stops future charges and takes effect at the end of the period you have
          already paid for - you keep the service until then.{" "}
          <strong>Cancelling is not the same as claiming a refund</strong>: outside
          the 30-day guarantee, cancelling does not refund the current period.
        </p>

        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years old to use the Site and join the beta.
          By doing so, you confirm that the information you provide is accurate and
          that you are entitled to share it.
        </p>

        <h2>Niro is not an emergency service</h2>
        <p>
          <strong>
            Niro is an assistance and coordination service, not a medical, security,
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
          The Niro name, logo, text, design, and other content on the Site are
          owned by Domiro Private Limited and protected by applicable laws. You
          may not copy, reproduce, or use them without our written permission.
          Names of third parties are the property of their respective owners.
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
          To the fullest extent permitted by law, Domiro Private Limited and its
          directors, employees, and partners will not be liable for any indirect,
          incidental, or consequential loss arising from your use of the Site or
          the beta.
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
          <a href="mailto:hello@tellniro.com">hello@tellniro.com</a>.
        </p>
        <p>
          <strong>Domiro Private Limited</strong>
          <br />
          CIN:{" "}
          <span style={{ whiteSpace: "nowrap" }}>U62099KA2026PTC228168</span>
          <br />
          Registered office: Old No. 223, New No. 2210, 2nd Main Road, 6th Block,
          Jayanagar West, Bangalore South, Bangalore 560070, Karnataka, India.
        </p>
      </article>
    </PageShell>
  );
}
