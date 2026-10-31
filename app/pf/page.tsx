import type { Metadata } from "next";
import { ProofVideo } from "@/components/ds/ProofVideo";
import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { NIRO_LITE, GUIDE_SCOPE, PF_CREDIT, PF_CREDIT_EXAMPLES, PF_PARTNER_REVIEWS, MEMBERSHIP_HALF_PRICE, MEMBERSHIP_FEATURES } from "@/lib/content";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { PfAuditForm } from "./PfAuditForm";
import { PfLink } from "./PfLink";
import { PfStickyCta } from "./PfStickyCta";
import "./pf.css";

/**
 * /pf - the free PF audit (moved from /pf on 24 Oct 2026; the old
 * path, /epf and /pfmoney redirect here from public/), for a campaign aimed at Indians abroad
 * (mostly 30 to 40, Gulf and other served markets; North America is out of
 * the ad targeting but not out of the form).
 *
 * The first fold sells the free audit: what is blocking access and what it
 * will take to recover it, then introduces Niro in one line. The audit's
 * turnaround (24 to 48 hours of receiving the records) and the recovery's
 * (weeks to a few months, set by EPFO) are stated separately, never blurred.
 * One offer, in two stages:
 *  1. The free audit: review, diagnosis, action plan. No purchase needed.
 *     Delivered within 24 to 48 hours of receiving the records it needs.
 *  2. Optional paid execution, through any Niro pack that carries a PF
 *     Recovery Credit: Niro Lite, or the 3- or 6-month membership (PF_CREDIT
 *     in lib/content.ts, from the founders' credit sheet, Oct 2026). The
 *     credit goes towards the specialist's fee; anything above it is the
 *     partner's exact cost, charged once the money is recovered. The monthly
 *     membership carries no credit and is not pitched here.
 *
 * Proof: the specialist partner's own record, 2,000+ EPFO cases resolved,
 * confirmed by the founders. The partner is not named on the page (founders,
 * 24 Oct 2026), only described as our specialist partner. It is not Niro's case count, not
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
    "Left PF money behind when you moved abroad? Get a free audit of your EPF or PPF within 24 to 48 hours of receiving your records: what is blocking access, and what it will take to recover it.",
  alternates: { canonical: "https://tellniro.com/pf/" },
  openGraph: {
    title: "Left PF money behind when you moved abroad?",
    description:
      "A free PF audit within 24 to 48 hours of receiving your records: what is blocking your money, and what it will take to recover it.",
    type: "website",
    url: "https://tellniro.com/pf/",
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

/* What the free audit tells you. Describes the deliverable, not a result:
   no sample report, no customer case, no outcome. */
const AUDIT_TELLS: { icon: IconName; title: string; body: string }[] = [
  { icon: "lock", title: "What’s holding things up", body: "Issues identified and anything still needing verification." },
  { icon: "file-text", title: "What needs to happen next", body: "Steps, documents and approvals required." },
  { icon: "user-check", title: "What Niro would handle", body: "Work we can coordinate and what needs your involvement." },
  { icon: "wallet", title: "What it would cost", body: "A case-specific quote and applicable Niro pack credit if you want us to handle the case." },
];

const YOU: string[] = [
  "Leave your name and WhatsApp number, then answer a few quick taps.",
  "Walk us through your account on a guided screen-sharing call, or log in yourself and share the records we request.",
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
const DOCS_ID: string[] = ["Aadhaar card", "PAN card"];

/** The how-to video for downloading the records above (YouTube, unlisted).
 *  A plain link, not an embed, so the FAQ loads nothing until someone taps.
 *  Empty hides the link. */
const DOCS_VIDEO_URL = "https://youtu.be/wFTB7AVNJIo";

const docList = (items: string[]) => (
  <ul className="pf-faq-list">
    {items.map((d) => (
      <li key={d}>{d}</li>
    ))}
  </ul>
);

const FAQ: { q: string; a: React.ReactNode }[] = [
  // Ordered by what stops people first (Oct 2026): sharing the login is the
  // hesitation leads actually voiced, then whether it is really free, what
  // they get, what paid help costs, the unclear case, and PPF last.
  {
    q: "Do I have to share my UAN password or OTPs?",
    a: (
      <>
        <span className="pf-faq-p">
          No. You stay in control of your login, and you choose how we see
          your records:
        </span>
        <ol className="pf-faq-options">
          <li>
            <b>A guided screen-sharing call.</b> You log in on your own phone or
            laptop and share your screen, and we go through the account with
            you. No password changes hands.
          </li>
          <li>
            <b>Share the records yourself.</b> You log in and send us:
            {DOCS_VIDEO_URL && (
              <a className="pf-video-link" href={DOCS_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                &#9654; Watch how to download these
              </a>
            )}
            <span className="pf-faq-sub">From the EPFO passbook portal</span>
            {docList(DOCS_PASSBOOK)}
            <span className="pf-faq-sub">From the EPFO member portal</span>
            {docList(DOCS_MEMBER)}
            <span className="pf-faq-sub">For identity checks, scanned copies of</span>
            {docList(DOCS_ID)}
          </li>
          <li>
            <b>Optional: share your UAN login,</b> with a scanned Aadhaar card
            and PAN card. Used only for your case; change the password once the
            audit is done.
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
    q: "Do I need a membership for the audit?",
    a: "No. The audit is free for anyone, and asking for one does not start any paid work.",
  },
  {
    q: "What does the free audit include?",
    a: "A review of your PF records and a written action plan on WhatsApp: the current status of each account, anything blocking access to the money and the record that shows it, the steps and documents needed next, and anything that still needs confirming. It is free, and there is no purchase required.",
  },
  {
    q: "What if I want Niro to handle the case?",
    a: (
      <>
        <span className="pf-faq-p">
          Choose a Niro pack: Niro Lite ({NIRO_LITE.price} once, 20 tasks over
          12 months), or a 3-month ($250) or 6-month ({MEMBERSHIP_HALF_PRICE})
          membership. Each includes a PF Recovery Credit towards the
          specialist&rsquo;s fee: ₹6,000, ₹5,000 or ₹15,000.
        </span>
        <span className="pf-faq-p">
          There is no flat fee for PF recovery. The fee depends on how many
          separate issues your case has and how complex each one is, and a full
          case runs from a few thousand rupees up to about ₹65,000. You get the
          exact quote after your free audit, before you pay anything. Your
          total is the pack price plus any specialist fee above the credit,
          which is the partner&rsquo;s exact cost, with no markup, charged
          only once your money is recovered. Specialist fee left after the
          credit, a few examples:
        </span>
        <ul className="pf-faq-list">
          {PF_CREDIT_EXAMPLES.map((e) => (
            <li key={e.name}>
              <b>{e.name}</b> ({e.what}), fee {e.fee}:{" "}
              {PF_CREDIT.map((p, i) => {
                const v = e.pay[i];
                return `${p.id === "lite" ? "Lite" : p.name.replace(" membership", "")} ${v === "Covered" ? "fully covered" : `+${v}`}`;
              }).join(", ")}
              .
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    q: "What if it isn't clear yet whether the money can be accessed?",
    a: "Then the audit says what is known, what is not, and which record or confirmation would settle it. You decide what to do next, with no obligation, and we don't start paid work on a case we can't yet assess.",
  },
  {
    q: "Do you handle PPF too?",
    a: "Yes. EPF is most of what we see, but the audit also covers PPF accounts, including ones opened before you became an NRI. PPF usually involves the bank or post office that holds the account, and the audit sets out what that branch needs.",
  },
];

export default function PfMoneyPage() {
  return (
    <>
      <Nav cta="Get my free PF audit" ctaHref="#audit" mobileCta={{ label: "What Niro does", href: "#about" }} />
      <main className="pf">
        {/* ------------------------------------------- 1. hero: the outcome */}
        <section className="pf-hero">
          <div className="pf-jaali" aria-hidden="true" />
          <div className="pf-wrap pf-narrow">
            <div>
              <Eyebrow>For Indians living abroad</Eyebrow>
              <h1 className="pf-h1">Left PF money behind when you moved abroad?</h1>
              <p className="pf-lead pf-lead-strong">
                Find out what&rsquo;s blocking access and what it will take to
                recover it, with a free PF audit.
              </p>
              <p className="pf-lead pf-intro">
                <b>Niro</b> is your personal assistant in India. We coordinate
                the paperwork and follow-ups for your PF, and everyday tasks for
                you and your family.
              </p>
              <PfLink href="#audit" kind="cta" placement="hero" className="btn btn-primary btn-lg pf-hero-btn">
                Get my free PF audit
              </PfLink>
              <p className="pf-support">
                Free. No purchase required. Audit delivered within 24 to 48
                hours of receiving the required records.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 1b. what the audit tells you */}
        <section className="pf-sec pf-sec-tight">
          <div className="pf-wrap">
            <Eyebrow>Free PF audit</Eyebrow>
            <h2 className="pf-h2">What your free audit tells you</h2>
            <ul className="pf-tells">
              {AUDIT_TELLS.map((t) => (
                <li key={t.title} className="pf-card">
                  <span className="pf-ico">
                    <Icon name={t.icon} size={20} />
                  </span>
                  <div>
                    <h3>{t.title}</h3>
                    <p>{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Why audit first. Deliberately no partner statistic: the partner
                is unnamed and its figures are not confirmed for publication. */}
            <div className="pf-why">
              <b>A withdrawal request is often only the last step.</b>{" "}
              PF withdrawal can get held up by records that need correcting
              first. Your free audit identifies what needs fixing and the steps
              needed to move forward.
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

        {/* ------------------------------------------- 4. specialist partner (unnamed on the page) */}
        <section className="pf-sec pf-inset">
          <div className="pf-wrap pf-narrow">
            <Eyebrow>Our specialist partner</Eyebrow>
            <h2 className="pf-h2">Specialist experience behind your PF case</h2>
            <div className="pf-proof">
              <p className="pf-proof-line">
                Our specialist partner has resolved 2,000+ EPFO cases. Niro
                coordinates your case and keeps you updated on WhatsApp.
              </p>
            </div>
          </div>
          {/* Outside pf-narrow, so the three cards get the full width. The
              quotes are the reviewers' own LinkedIn posts (sources in
              lib/content PF_PARTNER_REVIEWS); the note under them says whose
              work they review, so none reads as a review of Niro. */}
          <div className="pf-wrap">
            <div className="story-grid pf-reviews">
              {PF_PARTNER_REVIEWS.map((r) => (
                <figure key={r.name} className="story-card">
                  <blockquote>&ldquo;{r.headline}&rdquo;</blockquote>
                  <p>{r.body}</p>
                  <figcaption>
                    <span
                      className="story-face"
                      style={{ backgroundImage: `url("${r.photo}"), linear-gradient(150deg,#EAD9B8,#C9986A)` }}
                    />
                    <span>
                      <b>{r.name}</b>
                      <span>{r.location}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="pf-fine pf-reviews-note">
              Shared with permission: reviews of our specialist partner&rsquo;s
              EPFO work, from the reviewers&rsquo; own posts, lightly trimmed.
            </p>
          </div>
        </section>

        {/* ------------------------------------------- 5. free vs paid */}
        <section className="pf-sec">
          <div className="pf-wrap">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="pf-h2">Let Niro handle the paperwork and follow-ups.</h2>
            <div className="pf-stages">
              <div className="pf-card pf-stage pf-stage-free">
                <div className="pf-card-label">Stage 1 &middot; Free</div>
                <h3>Free audit</h3>
                <p>
                  What&rsquo;s blocking access and how to fix it, within 24 to
                  48 hours of getting your records.
                </p>
              </div>
              <div className="pf-card pf-stage">
                <div className="pf-card-label">Stage 2 &middot; With a Niro pack</div>
                <h3>Niro manages your recovery case</h3>
                <p>
                  Your pack&rsquo;s{" "}
                  <PfLink href="#pricing" kind="lite" placement="stages" className="pf-text-link">
                    PF Recovery Credit
                  </PfLink>{" "}
                  goes towards the specialist fee. Recovery usually takes weeks
                  to a few months, depending on your records and EPFO.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 6. about Niro */}
        <section className="pf-sec pf-inset" id="about">
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
            <div className="pf-diaries">
              <ProofVideo placement="pf_about" caption="Beyond EPFO: real tasks we have done for NRI families." />
            </div>
            <PfLink href="/family-guide/" kind="guide" placement="about_niro" className="pf-text-link pf-guide-link">
              See Niro&rsquo;s 50+ tasks catalogue
            </PfLink>
          </div>
        </section>

        {/* ------------------------------------------- 5b. pricing */}
        {/* The home page's two tiers (PricingTiers), with the PF Recovery
            Credit as each card's first line. The detailed fee examples live
            in the paid-help FAQ answer. */}
        <section className="pf-sec" id="pricing">
          <div className="pf-wrap pf-pricing">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="pf-h2">One membership. Or just the tasks you need.</h2>
            <p className="pf-p pf-p-wide">
              The audit is free. If you want Niro to manage recovery, you&rsquo;ll
              need a Niro pack.
            </p>
            <PricingTiers
              membershipFeatures={MEMBERSHIP_FEATURES}
              liteLead="Includes a ₹6,000 PF Recovery Credit (counts as 4 of your 20 tasks)"
              memberLead="Includes a PF Recovery Credit: ₹5,000 on the 3-month plan, ₹15,000 on 6 months, renewed each time"
            />
            <p className="pf-p pf-p-wide pf-recovery-cost">
              <b>Your total price</b> is the Niro pack price plus any specialist
              fee remaining after your PF Recovery Credit, charged at our
              partner&rsquo;s cost once your money arrives. Your audit will show
              the breakdown before you buy. For some simple cases, the credit
              covers the full specialist fee; the pack price still applies.
            </p>
            <PfLink href="#audit" kind="cta" placement="pricing" className="pf-text-link">
              Start with the free audit
            </PfLink>
          </div>
        </section>

        {/* ------------------------------------------- 7. intake */}
        <section className="pf-sec" id="audit">
          <div className="pf-wrap pf-form-wrap">
            <div className="pf-card pf-form-card">
              <Eyebrow>Free EPF audit</Eyebrow>
              <h2 className="pf-form-h">Get your free EPF audit</h2>
              <p className="pf-form-sub">
                Your name and WhatsApp number first, then a few quick taps. No
                passwords, OTPs or documents needed here.
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
              Our EPFO resolution partner is an independent company. Neither
              Niro nor the partner is affiliated with EPFO or the Government of
              India. Nothing on this page is tax, legal or
              investment advice. Outcomes and timelines depend on EPFO, your
              former employer and your bank.
            </p>
          </div>
        </section>
      </main>
      <PfStickyCta />
      <Footer />
    </>
  );
}
