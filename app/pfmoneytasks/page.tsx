import type { Metadata } from "next";
import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { NIRO_LITE } from "@/lib/content";
import { PfAuditForm } from "./PfAuditForm";
import { PfLink } from "./PfLink";
import "./pf.css";

/**
 * /pfmoneytasks - the free PF audit, for a campaign aimed at Indians abroad
 * (mostly 30 to 40, Gulf and other served markets; North America is out of
 * the ad targeting but not out of the form).
 *
 * One offer, in two stages, kept visibly apart:
 *  1. The free audit: review, diagnosis, action plan. No purchase needed.
 *     Delivered within 24 hours of receiving the records it needs.
 *  2. Optional paid execution, through Niro Lite only ($300 once, 20 tasks,
 *     12 months). There is no standalone PF purchase, and the monthly
 *     membership is deliberately not pitched in this flow.
 *
 * Proof: Kustodian's own record, 2,000+ EPFO cases resolved, attributed to
 * Kustodian and founder-supplied (Oct 2026). It is not Niro's case count, not
 * an NRI-only figure, and implies no success rate or timeline. Two national
 * figures stay, each linked to the report it comes from; the interest-loss
 * and tax claims and the diaspora figure are gone.
 *
 * Credentials: members log in and enter OTPs themselves. Passwords and OTPs
 * for the PF case are never shared with Niro.
 *
 * Lite task counts (3 or 6 tasks for a PF case, the specialist fee included,
 * the longest cases quoted separately) are the ones in NIRO_LITE_COUNTS in
 * lib/content.ts, set by the founders on 22 Oct 2026, and match /lite.
 */
export const metadata: Metadata = {
  title: "Free PF audit for Indians abroad - Niro",
  description:
    "Left PF money behind when you moved abroad? Get a free audit of your EPF or PPF in 24 hours: the status, any blockers, and the steps to access it.",
  alternates: { canonical: "https://tellniro.com/pfmoneytasks/" },
  openGraph: {
    title: "Left PF money behind when you moved abroad?",
    description:
      "A free PF audit in 24 hours: what is blocking your money, and the steps to access it.",
    type: "website",
    url: "https://tellniro.com/pfmoneytasks/",
  },
};

const ANSWERS: string[] = [
  "What is the current status of your PF account?",
  "Is anything blocking access to the money?",
  "What steps and documents are needed next?",
];

const BLOCKERS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "phone",
    title: "Records without your Indian number",
    body: "The portal sends codes to the mobile registered with EPFO. If that number has lapsed, getting your passbook and claim history takes a different route.",
  },
  {
    icon: "users",
    title: "Employment details that don't match",
    body: "A missing exit date, a closed employer, or a name or date of birth that differs across records can each hold a claim until it is corrected.",
  },
  {
    icon: "wallet",
    title: "Bank requirements from abroad",
    body: "EPF is paid into an Indian resident or NRO account, not an NRE account or a bank abroad. The account on record has to be one that works.",
  },
  {
    icon: "file-text",
    title: "Rejections without a clear reason",
    body: "A rejected claim comes with a short code, not an explanation. Working out what it means, and what to file next, is most of the follow-up.",
  },
];

const YOU: string[] = [
  "Answer three questions below, then continue on WhatsApp.",
  "Log in to the EPFO portal yourself and send the records we ask for, or let us guide you through getting them.",
  "Enter one-time codes yourself, and approve each step before it is taken.",
];

const NIRO: string[] = [
  "Review your records and explain what is blocking access.",
  "Coordinate corrections and submissions with our specialist partner.",
  "Follow up with EPFO, your former employer and your bank.",
  "Keep you updated on WhatsApp at every stage.",
];

const PREVIEW: { label: string; body: string }[] = [
  {
    label: "Account status",
    body: "Which accounts sit under your UAN, and whether each one is active, settled or inoperative.",
  },
  {
    label: "Findings and supporting records",
    body: "Anything that would hold a claim, with the record that shows it: a missing exit date, a mismatch, an earlier rejection.",
  },
  {
    label: "Steps and documents required",
    body: "What to correct or file, in order, and which documents each step needs.",
  },
  {
    label: "Anything still needing confirmation",
    body: "What the records could not settle yet, and what would confirm it.",
  },
];

const LITE_USES: { icon: IconName; t: string }[] = [
  { icon: "wallet", t: "Bank KYC or a dormant account" },
  { icon: "file-text", t: "Aadhaar or other document updates" },
  { icon: "wrench", t: "Repairs or household help for parents" },
  { icon: "home", t: "Property paperwork or tenant coordination" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "What does the free audit include?",
    a: "A review of your PF records and a written action plan on WhatsApp: the current status of each account, anything blocking access to the money and the record that shows it, the steps and documents needed next, and anything that still needs confirming. It is free, and there is no purchase required.",
  },
  {
    q: "When does the 24-hour clock start?",
    a: "When we have the records needed for review. On WhatsApp we first tell you which records those are, usually your passbook and service history. If a record has to be obtained first, for example because the mobile registered with EPFO has lapsed, the 24 hours start once it is in.",
  },
  {
    q: "Do I need a membership for the audit?",
    a: "No. The audit is free for anyone, and asking for one does not start any paid work.",
  },
  {
    q: "What if I want Niro to handle the case?",
    a: `Paid help is through Niro Lite: ${NIRO_LITE.price} paid once for 20 tasks, valid for 12 months. There is no separate PF-only purchase. A PF case uses 3 or 6 tasks, depending on how complex it is, and the specialist's fee is included for most cases. The rare case that can run to five months is quoted separately. We tell you all of this before you buy.`,
  },
  {
    q: "Do you handle PPF too?",
    a: "Yes. EPF is most of what we see, but the audit also covers PPF accounts, including ones opened before you became an NRI. PPF usually involves the bank or post office that holds the account, and the audit sets out what that branch needs.",
  },
  {
    q: "Do I have to share my UAN password or OTPs?",
    a: "No. You log in to the EPFO portal yourself and send us the records we ask for, or we guide you through getting them. When a step needs a one-time code, you enter it yourself. Your passwords and OTPs are never shared with Niro, and we never ask for bank PINs, card details, net-banking or UPI logins.",
  },
  {
    q: "What if it isn't clear yet whether the money can be accessed?",
    a: "Then the audit says what is known, what is not, and which record or confirmation would settle it. You decide what to do next, with no obligation, and we don't start paid work on a case we can't yet assess.",
  },
];

export default function PfMoneyPage() {
  return (
    <>
      <Nav cta="Get my free PF audit" ctaHref="#audit" />
      <main className="pf">
        {/* ------------------------------------------- 1. hero + deliverables */}
        <section className="pf-hero">
          <div className="pf-jaali" aria-hidden="true" />
          <div className="pf-wrap pf-hero-grid">
            <div>
              <Eyebrow>For Indians abroad</Eyebrow>
              <h1 className="pf-h1">Left PF money behind when you moved abroad?</h1>
              <p className="pf-lead pf-lead-strong">
                Find out what&rsquo;s needed to access it, with a free PF audit in
                24 hours.
              </p>
              <p className="pf-lead">
                We review your account, identify any blockers and explain the
                steps to take. If you choose Niro to handle the follow-ups, you
                can continue through Niro Lite.
              </p>
              <PfLink href="#audit" kind="cta" placement="hero" className="btn btn-primary btn-lg pf-hero-btn">
                Get my free PF audit
              </PfLink>
              <p className="pf-support">
                Free diagnosis. No purchase required. Delivered within 24 hours
                of receiving the records needed for review.
              </p>
            </div>
            <div className="pf-card pf-answers">
              <h2 className="pf-answers-h">Your free audit answers</h2>
              <ol>
                {ANSWERS.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
              <p className="pf-answers-foot">
                A clear action plan, delivered on WhatsApp within 24 hours of
                receiving the required records.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 2. obstacles + delegation */}
        <section className="pf-sec pf-inset">
          <div className="pf-wrap">
            <Eyebrow>Why it stays stuck</Eyebrow>
            <h2 className="pf-h2">Weeks of chasing, from the wrong time zone.</h2>
            <div className="pf-grid">
              {BLOCKERS.map((b) => (
                <div key={b.title} className="pf-card">
                  <span className="pf-ico">
                    <Icon name={b.icon} size={20} />
                  </span>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
            <p className="pf-fine">
              You are not alone: &#8377;9,330 crore sat in inoperative EPF
              accounts on 31 March 2026, according to the government&rsquo;s
              reply in Parliament (
              <a href="https://www.outlookmoney.com/personal-finance/lic-unclaimed-funds-cross-rs-7300-crore-epfo-inoperative-accounts-at-rs-9330-crore" target="_blank" rel="noopener noreferrer">
                Outlook Money
              </a>
              ), and about 1 in 5 EPF claims filed in 2024-25 was rejected,
              according to EPFO&rsquo;s annual report (
              <a href="https://www.businesstoday.in/personal-finance/news/story/epfos-instant-pf-withdrawal-promise-has-a-catch-one-in-five-claims-still-gets-rejected-541466-2026-07-07" target="_blank" rel="noopener noreferrer">
                Business Today
              </a>
              ). Both are all-India figures.
            </p>

            <h3 className="pf-h3">
              You provide the records and approvals. Niro coordinates the
              paperwork and follow-ups.
            </h3>
            <div className="pf-split">
              <div className="pf-card">
                <div className="pf-card-label">What you do</div>
                <ul className="pf-list">
                  {YOU.map((t) => (
                    <li key={t}>
                      <Icon name="check" size={15} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pf-card">
                <div className="pf-card-label">What Niro does</div>
                <ul className="pf-list">
                  {NIRO.map((t) => (
                    <li key={t}>
                      <Icon name="check" size={15} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 3. audit preview */}
        <section className="pf-sec">
          <div className="pf-wrap pf-narrow">
            <Eyebrow>What you receive</Eyebrow>
            <h2 className="pf-h2">An action plan, not a status update.</h2>
            <div className="pf-card pf-preview" aria-label="Example audit format">
              <div className="pf-preview-top">
                <span className="pf-card-label">Example audit format</span>
                <span className="pf-preview-note">Headings shown; your audit fills them in</span>
              </div>
              <ol>
                {PREVIEW.map((p) => (
                  <li key={p.label}>
                    <b>{p.label}</b>
                    <span>{p.body}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="pf-fine">
              Not every account has a blocker, and some records take longer than
              24 hours to obtain. The audit says which applies to yours.
            </p>
          </div>
        </section>

        {/* ------------------------------------------- 4. Kustodian */}
        <section className="pf-sec pf-inset">
          <div className="pf-wrap pf-narrow">
            <Eyebrow>Our specialist partner</Eyebrow>
            <h2 className="pf-h2">Specialist experience behind your PF case</h2>
            <div className="pf-proof">
              <p className="pf-proof-line">
                2,000+ EPFO cases resolved by Kustodian, our specialist partner.
              </p>
              <p>
                Kustodian brings the EPFO expertise. Niro coordinates your case
                and keeps you informed on WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 5. free vs paid */}
        <section className="pf-sec">
          <div className="pf-wrap">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="pf-h2">Understand your case free. Decide about help afterwards.</h2>
            <div className="pf-stages">
              <div className="pf-card pf-stage pf-stage-free">
                <div className="pf-card-label">Stage 1 &middot; Free</div>
                <h3>Free audit</h3>
                <p>
                  Review, diagnosis and an action plan. Your free audit gives
                  you the diagnosis and steps needed to access your PF money.
                  There&rsquo;s no obligation to join.
                </p>
              </div>
              <div className="pf-card pf-stage">
                <div className="pf-card-label">Stage 2 &middot; Optional, paid</div>
                <h3>Niro handles the execution</h3>
                <p>
                  The corrections, submissions and follow-ups you agree to, through
                  Niro Lite: a one-time {NIRO_LITE.price} purchase for 20 tasks,
                  valid for 12 months.
                </p>
              </div>
            </div>
            <p className="pf-p pf-after">
              Requesting an audit does not start paid work. Before you buy,
              we&rsquo;ll explain how many tasks your PF case uses and any
              additional specialist charges. A PF case usually uses 3 or 6 of
              the 20 tasks, depending on how complex it is, with the
              specialist&rsquo;s fee included; the rare case that can run to five
              months is quoted separately.{" "}
              <PfLink href="/lite/" kind="lite" placement="stages" className="pf-text-link">
                How Niro Lite works
              </PfLink>
            </p>
          </div>
        </section>

        {/* ------------------------------------------- 6. broader Lite value */}
        <section className="pf-sec pf-inset">
          <div className="pf-wrap">
            <Eyebrow>Niro Lite</Eyebrow>
            <h2 className="pf-h2">
              Start with your PF. Hand over the other India tasks you keep
              postponing.
            </h2>
            <p className="pf-p">
              Use your remaining Lite tasks for things you or your family need
              done in India.
            </p>
            <ul className="pf-uses">
              {LITE_USES.map((u) => (
                <li key={u.t} className="pf-card">
                  <Icon name={u.icon} size={18} />
                  <span>{u.t}</span>
                </li>
              ))}
            </ul>
            <PfLink href="/family-guide/" kind="guide" placement="lite_uses" className="pf-text-link pf-guide-link">
              See what else Niro handles
            </PfLink>
          </div>
        </section>

        {/* ------------------------------------------- 7. intake */}
        <section className="pf-sec" id="audit">
          <div className="pf-wrap pf-form-wrap">
            <div className="pf-card pf-form-card">
              <Eyebrow>Free PF audit</Eyebrow>
              <h2 className="pf-form-h">Get your free PF audit</h2>
              <p className="pf-form-sub">
                Three quick questions, then continue on WhatsApp. No passwords,
                OTPs or documents needed here.
              </p>
              <PfAuditForm />
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 8. faq */}
        <section className="pf-sec pf-inset">
          <div className="pf-wrap">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="pf-h2">Before you start.</h2>
            <div className="pf-faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="pf-plus" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 9. final CTA */}
        <section className="pf-sec pf-close">
          <div className="pf-wrap">
            <h2 className="pf-h2">Find out where your PF money stands.</h2>
            <p className="pf-p">
              Free, within 24 hours of receiving the records needed for review.
            </p>
            <PfLink href="#audit" kind="cta" placement="final" className="btn btn-primary btn-lg">
              Get my free PF audit
            </PfLink>
            <p className="pf-fine pf-disclaimer">
              Niro is a family concierge service for Indians living abroad.
              Kustodian is an independent company and Niro&rsquo;s EPFO
              resolution partner; neither is affiliated with EPFO or the
              Government of India. Nothing on this page is tax, legal or
              investment advice. Outcomes and timelines depend on EPFO, your
              former employer and your bank.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
