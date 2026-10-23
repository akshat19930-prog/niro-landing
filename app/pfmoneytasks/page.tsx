import type { Metadata } from "next";
import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { NIRO_LITE, GUIDE_SCOPE, PF_CREDIT, PF_CREDIT_EXAMPLES, MEMBERSHIP_HALF_PRICE } from "@/lib/content";
import { PfAuditForm } from "./PfAuditForm";
import { PfLink } from "./PfLink";
import "./pf.css";

/**
 * /pfmoneytasks - the free PF audit, for a campaign aimed at Indians abroad
 * (mostly 30 to 40, Gulf and other served markets; North America is out of
 * the ad targeting but not out of the form).
 *
 * The first fold sells the outcome (the money back, minutes of your effort
 * instead of weeks), not the process. One offer, in two stages:
 *  1. The free audit: review, diagnosis, action plan. No purchase needed.
 *     Delivered within 24 to 48 hours of receiving the records it needs.
 *  2. Optional paid execution, through any Niro pack that carries a PF
 *     Recovery Credit: Niro Lite, or the 3- or 6-month membership (PF_CREDIT
 *     in lib/content.ts, from the founders' credit sheet, Oct 2026). The
 *     credit goes towards the specialist's fee; anything above it is the
 *     partner's exact cost, charged once the money is recovered. The monthly
 *     membership carries no credit and is not pitched here.
 *
 * Proof: Kustodian's own record, 2,000+ EPFO cases resolved, attributed to
 * Kustodian, confirmed by the founders and with Kustodian's OK to be named
 * (Oct 2026). It is not Niro's case count, not
 * an NRI-only figure, and implies no success rate or timeline. Two national
 * figures stay, each linked to the report it comes from; the interest-loss
 * and tax claims and the diaspora figure are gone.
 *
 * Credentials, per the Niro x Kustodian external SOP (section 7): the member
 * chooses between sharing the UAN login, sending the listed documents, or a
 * video call on their own screen. Sharing the login is never required, and
 * OTPs are always entered by the member.
 *
 * On Lite the ₹6,000 credit counts as 4 tasks (NIRO_LITE_COUNTS), matching
 * /lite and the home page FAQ.
 */
export const metadata: Metadata = {
  title: "Free PF audit for Indians abroad - Niro",
  description:
    "Left PF money behind when you moved abroad? Get a free audit of your EPF or PPF in 24 to 48 hours: the status, any blockers, and the steps to access it.",
  alternates: { canonical: "https://tellniro.com/pfmoneytasks/" },
  openGraph: {
    title: "Left PF money behind when you moved abroad?",
    description:
      "A free PF audit in 24 to 48 hours: what is blocking your money, and the steps to access it.",
    type: "website",
    url: "https://tellniro.com/pfmoneytasks/",
  },
};

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
  "Share your UAN login, send the documents on our list, or walk us through your account on a video call: your choice.",
  "Enter one-time codes yourself, and approve each step before it is taken.",
];

const NIRO: string[] = [
  "Review your records and explain what is blocking access.",
  "Coordinate corrections and submissions with our specialist partner.",
  "Follow up with EPFO, your former employer and your bank.",
  "Keep you updated on WhatsApp at every stage.",
];

/* The records the audit works from, as listed in the Niro x Kustodian
   external SOP (EPFO case resolution, section 7, "Mandatory documents",
   option 2: for a member not comfortable sharing credentials). */
const DOCS_PASSBOOK: string[] = [
  "Passbook profile details",
  "Claims: settled, pending and rejected",
  "Member-wise balance (passbook home page)",
  "Passbook overview for each member ID",
  "Yearly passbooks for each employer (a PDF per year and member ID)",
  "Service history and service overview",
];
const DOCS_MEMBER: string[] = [
  "Member profile details (View)",
  "Service history (View)",
  "UAN card (View)",
  "KYC details (Manage)",
  "Joint declaration (Manage)",
  "Transfer claim status (Online services)",
];
const DOCS_ID: string[] = ["Aadhaar card", "PAN card", "A cancelled cheque"];

const docList = (items: string[]) => (
  <ul className="pf-faq-list">
    {items.map((d) => (
      <li key={d}>{d}</li>
    ))}
  </ul>
);

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "What does the free audit include?",
    a: "A review of your PF records and a written action plan on WhatsApp: the current status of each account, anything blocking access to the money and the record that shows it, the steps and documents needed next, and anything that still needs confirming. It is free, and there is no purchase required.",
  },
  {
    q: "When do the 24 to 48 hours start?",
    a: "When we have what your case needs: your UAN login, the documents on our list, or a finished video call (see the question on passwords below). If a record has to be obtained first, for example because the mobile registered with EPFO has lapsed, the 24 to 48 hours start once it is in.",
  },
  {
    q: "Do I need a membership for the audit?",
    a: "No. The audit is free for anyone, and asking for one does not start any paid work.",
  },
  {
    q: "What if I want Niro to handle the case?",
    a: `Choose a Niro pack: Niro Lite (${NIRO_LITE.price} once, 20 tasks over 12 months), or a 3-month ($250) or 6-month (${MEMBERSHIP_HALF_PRICE}) membership. Each includes a PF Recovery Credit towards the specialist's fee: ₹6,000, ₹5,000 or ₹15,000. The fee depends on your case and is confirmed after the free audit, before you buy. Anything above the credit is the partner's exact cost, with no markup, charged only once your money is recovered.`,
  },
  {
    q: "Do you handle PPF too?",
    a: "Yes. EPF is most of what we see, but the audit also covers PPF accounts, including ones opened before you became an NRI. PPF usually involves the bank or post office that holds the account, and the audit sets out what that branch needs.",
  },
  {
    q: "Do I have to share my UAN password or OTPs?",
    a: (
      <>
        <span className="pf-faq-p">
          No. There are three ways to give us what the audit needs, and you
          choose:
        </span>
        <ol className="pf-faq-options">
          <li>
            <b>Share your UAN login,</b> along with a scanned Aadhaar card, PAN
            card and a cancelled cheque. It is used only for your case, and you
            can change the password as soon as the audit is done.
          </li>
          <li>
            <b>Send documents instead.</b> You log in yourself and send us:
            <span className="pf-faq-sub">From the EPFO passbook portal</span>
            {docList(DOCS_PASSBOOK)}
            <span className="pf-faq-sub">From the EPFO member portal</span>
            {docList(DOCS_MEMBER)}
            <span className="pf-faq-sub">For identity checks, scanned copies of</span>
            {docList(DOCS_ID)}
          </li>
          <li>
            <b>A video call.</b> You log in on your own phone or laptop and share
            your screen, and we go through the account with you. No password
            changes hands.
          </li>
        </ol>
        <span className="pf-faq-p">
          Whichever you pick, you enter any one-time code yourself, and we never
          ask for bank PINs, card details, net-banking or UPI logins.
        </span>
      </>
    ),
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
        {/* ------------------------------------------- 1. hero: the outcome */}
        <section className="pf-hero">
          <div className="pf-jaali" aria-hidden="true" />
          <div className="pf-wrap pf-narrow">
            <div>
              <Eyebrow>For Indians abroad</Eyebrow>
              <h1 className="pf-h1">Left PF money behind when you moved abroad?</h1>
              <p className="pf-lead pf-lead-strong">
                Retrieve money from your dormant EPF/PF accounts, with minutes
                of effort instead of weeks.
              </p>
              <p className="pf-lead">
                Get a free account audit report, including the exact steps
                needed to access the funds, within 24 to 48 hours.
              </p>
              <PfLink href="#audit" kind="cta" placement="hero" className="btn btn-primary btn-lg pf-hero-btn">
                Get my free PF audit
              </PfLink>
              <p className="pf-support">
                Free. No purchase required.
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
            <h2 className="pf-h2">
              Let Niro do the weeks of chasing, until the money hits your
              account.
            </h2>
            <div className="pf-stages">
              <div className="pf-card pf-stage pf-stage-free">
                <div className="pf-card-label">Stage 1 &middot; Free</div>
                <h3>Free audit</h3>
                <p>
                  The exact steps to access your money. Free, with no
                  obligation.
                </p>
              </div>
              <div className="pf-card pf-stage">
                <div className="pf-card-label">Stage 2 &middot; With a Niro pack</div>
                <h3>Niro handles the weeks of effort, until the money hits your account</h3>
                <p>
                  Each pack includes a{" "}
                  <PfLink href="#pricing" kind="lite" placement="stages" className="pf-text-link">
                    PF Recovery Credit
                  </PfLink>{" "}
                  towards the fee, along with 50+ other kinds of tasks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 5b. pricing */}
        {/* From the founders' PF credit sheet. Three equal cards, no "best
            value" badge: no pack is styled as preferred on this site. */}
        <section className="pf-sec" id="pricing">
          <div className="pf-wrap">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="pf-h2">How your PF recovery is priced.</h2>
            <p className="pf-p pf-p-wide">
              Every Niro pack includes a PF Recovery Credit. We cover the EPFO
              recovery fee up to that amount. Anything above it is billed at
              our partner&rsquo;s exact cost, with no markup, and charged only
              once your money is recovered.
            </p>
            <div className="pf-packs">
              {PF_CREDIT.map((p) => (
                <div key={p.id} className="pf-card pf-pack">
                  <h3>{p.name}</h3>
                  <div className="pf-pack-price">
                    {p.price} <span>/ {p.inr}</span>
                  </div>
                  <div className="pf-card-label">PF Recovery Credit</div>
                  <div className="pf-pack-credit">{p.credit}</div>
                  <p>{p.note}</p>
                </div>
              ))}
            </div>
            <p className="pf-fine">
              On a membership, the credit comes back each time it renews.{" "}
              <PfLink href="/lite/" kind="lite" placement="pricing" className="pf-text-link">
                How Niro Lite works
              </PfLink>
            </p>

            <h3 className="pf-h3">Why there is no flat fee</h3>
            <p className="pf-p pf-p-wide">
              PF specialists in India, ours included, price each case on how
              many separate issues need fixing and how complex each one is. A
              single KYC or exit-date correction is quick and inexpensive. A
              missing pension record, an untraceable old account, or anything
              that needs visits to an EPFO office and chasing past employers
              takes weeks of work on the ground. So your fee is confirmed only
              after your free audit. A full case runs from a few thousand
              rupees up to about ₹65,000.
            </p>

            <p className="pf-table-cap">What you&rsquo;d pay on top of the credit, a few examples</p>
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th scope="col">Your case</th>
                    <th scope="col">Fee</th>
                    {PF_CREDIT.map((p) => (
                      <th key={p.id} scope="col">
                        {p.id === "lite" ? "Lite" : p.name.replace(" membership", "")}
                        <span>{p.credit}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PF_CREDIT_EXAMPLES.map((e) => (
                    <tr key={e.name}>
                      <th scope="row">
                        {e.name}
                        <span>{e.what}</span>
                      </th>
                      <td>{e.fee}</td>
                      {e.pay.map((v, i) => (
                        <td key={i} className={v === "Covered" ? "pf-covered" : undefined}>
                          {v === "Covered" ? v : `+${v}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 6. about Niro */}
        <section className="pf-sec pf-inset">
          <div className="pf-wrap">
            <Eyebrow>About Niro</Eyebrow>
            <h2 className="pf-h2">
              Niro is a family assistant, purpose-built for Indians living
              abroad.
            </h2>
            <p className="pf-p">
              Niro handles 50+ types of tasks for NRIs and their families, all
              over WhatsApp.
            </p>
            {/* The home page's six categories, in its order, titles only: one
                example task under each read as if that were all we do. No
                expand control; the full catalogue is one link away. */}
            <ul className="pf-cats">
              {GUIDE_SCOPE.map((c) => (
                <li key={c.title} className="pf-card">
                  <span className="pf-ico">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <h3>{c.title}</h3>
                </li>
              ))}
            </ul>
            <PfLink href="/family-guide/" kind="guide" placement="about_niro" className="pf-text-link pf-guide-link">
              See Niro&rsquo;s 50+ tasks catalogue
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
                  <div className="pf-faq-a">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 9. final CTA */}
        <section className="pf-sec pf-close">
          <div className="pf-wrap">
            <h2 className="pf-h2">Your family&rsquo;s personal assistant in India.</h2>
            <p className="pf-p">
              Errands, bills, appointments and emergencies for your parents, and
              your own India paperwork too. All over WhatsApp.
            </p>
            <PfLink href="/" kind="guide" placement="final_about" className="btn btn-primary btn-lg">
              Know more about Niro
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
