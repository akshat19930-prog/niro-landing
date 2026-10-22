import type { Metadata } from "next";
import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { PLANS, NIRO_LITE } from "@/lib/content";
import { PfAuditForm } from "./PfAuditForm";
import "./pf.css";

/**
 * /pfmoneytasks - EPF and PPF recovery for Indians abroad.
 *
 * EPFO is the hero because it is most of the demand; PPF is in scope.
 *
 * Every number on this page is an official all-India figure with its source
 * printed next to it. None is NRI-specific because nobody publishes an NRI
 * split; the page says so rather than presenting a modelled estimate as fact.
 *
 * The hero says the money "may have stopped earning", not "isn't growing":
 * most EPF keeps earning until 58, so the true claims are the narrower ones.
 * Permanent migration abroad is an inoperative trigger, inoperative accounts
 * earn nothing, irregular NRI PPF accounts have earned 0% since 1 Oct 2024,
 * and EPF interest after you stop working is taxable.
 *
 * Partner figures are the partner's own published ones ("families
 * supported"), not resolutions. Fees are as agreed: members have up to
 * Rs 4,500 of the partner's fee covered; Niro Lite counts a case as 3 or 6
 * tasks; the longest cases are quoted separately.
 */
export const metadata: Metadata = {
  title: "Get your PF money out of India - Niro",
  description:
    "Your EPF or PPF in India may have stopped earning. Niro and its resolution partner recover it for you, starting with a free audit.",
  alternates: { canonical: "https://tellniro.com/pfmoneytasks/" },
  openGraph: {
    title: "Your PF money in India may have stopped earning",
    description:
      "A free audit, then Niro gets your EPF or PPF out, with minutes of effort at your end.",
    type: "website",
    url: "https://tellniro.com/pfmoneytasks/",
  },
};

const IDLE: { label: string; value: string }[] = [
  { label: "Inoperative EPF account", value: "0% interest" },
  { label: "NRI PPF account gone irregular, since Oct 2024", value: "0% interest" },
  { label: "EPF interest after you stop working", value: "Taxable" },
];

const BLOCKERS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "phone",
    title: "A portal you can't get into",
    body: "OTPs go to an Indian number you no longer have, and the portal logs you out or stalls just when you get through.",
  },
  {
    icon: "users",
    title: "An employer you can't reach",
    body: "Your exit date was never marked, or the company has closed. Most claims can't move until that is fixed.",
  },
  {
    icon: "wallet",
    title: "A bank visit, from abroad",
    body: "EPFO pays only into an Indian resident or NRO account. PPF usually means forms at the branch that holds it.",
  },
  {
    icon: "file-text",
    title: "Rules nobody explains",
    body: "A name spelt differently on Aadhaar and PAN, the wrong form, the wrong exit reason. Each one is a rejection and another month.",
  },
];

const STATS: { value: string; label: string; source: string }[] = [
  {
    value: "₹9,330 cr",
    label: "sitting in inoperative EPF accounts",
    source: "As of 31 March 2026. Government reply in Parliament, July 2026.",
  },
  {
    value: "1 in 5",
    label: "EPF claims rejected in 2024-25",
    source: "About 1.74 crore of 7.96 crore claims. EPFO annual report.",
  },
  {
    value: "18.5 M",
    label: "Indians living outside India",
    source: "UN DESA migrant stock, 2024.",
  },
];

const YOU: string[] = [
  "Tell us about your account in a two-minute form.",
  "Share your UAN login and a few documents on WhatsApp.",
  "Approve one-time codes on your phone when a step needs one.",
];

const US: string[] = [
  "Audit your passbook, service history and KYC.",
  "Fix the mismatches and chase your old employer.",
  "File the right claim, and handle the PPF branch.",
  "Update you on WhatsApp every week until the money lands.",
];

/* The rest of Niro, shown so a PF lead is not surprised when sales mentions
   it. Not a call to action: one plain link to the full list. */
const BEYOND: { icon: IconName; t: string }[] = [
  { icon: "heart-pulse", t: "Doctor visits for your parents" },
  { icon: "shield-check", t: "Emergency response" },
  { icon: "file-text", t: "Aadhaar and pension life certificates" },
  { icon: "wallet", t: "Bank KYC and dormant accounts" },
  { icon: "home", t: "Property registration and tenants" },
  { icon: "wrench", t: "Cooks, maids and home repairs" },
  { icon: "plane", t: "Travel and visas" },
  { icon: "users", t: "A fellow traveller for your parents" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why do you need my UAN password, and is it safe?",
    a: "Most stuck claims go wrong in the service history, the KYC or the exit date, and the login is how we see them. It gives view access. Filing a claim, or anything else that moves money, still needs a one-time code sent to your phone, so nothing happens without you. Only the person working your case uses it, for your case only, and you can change the password the day the case closes. We never ask for bank PINs, card details or net-banking logins.",
  },
  {
    q: "Does this cover PPF too?",
    a: "Yes. EPF is most of what we see, but we also close or withdraw PPF accounts, including ones that went irregular after you became an NRI, which is when they stop earning. PPF usually involves the bank or post office that holds the account, and we handle that part.",
  },
  {
    q: "Do I need an Indian bank account?",
    a: "EPFO pays only into an Indian resident or NRO account, not an NRE one and not abroad. If you don't have one that works, the audit tells you, and we help you set it up.",
  },
  {
    q: "What if my case can't be fixed?",
    a: "Then the audit tells you so, before you commit to anything. The audit is free, and we would rather say a case can't be won than take it on and leave you waiting.",
  },
];

export default function PfMoneyPage() {
  return (
    <>
      <Nav cta="Get a free audit" ctaHref="#audit" />
      <main className="pf">
        {/* ----------------------------------------------------- hero */}
        <section className="pf-hero">
          <div className="pf-jaali" aria-hidden="true" />
          <div className="pf-wrap pf-hero-grid">
            <div>
              <Eyebrow>For Indians abroad &middot; EPF and PPF</Eyebrow>
              <h1 className="pf-h1">
                Your PF money in India may have stopped earning.
              </h1>
              <p className="pf-lead">
                Once you move abroad, an EPF account can go inoperative and earn
                nothing. What it does earn after you stop working is taxed. All
                the while, the rest of your portfolio keeps compounding.
              </p>
              <p className="pf-lead">
                Niro gets it out for you, with minutes of effort at your end.
              </p>
              <a href="#audit" className="btn btn-primary btn-lg">
                Get a free PF audit
              </a>
            </div>
            <div className="pf-card pf-idle">
              <div className="pf-card-label">What parked PF money earns</div>
              <ul>
                {IDLE.map((r) => (
                  <li key={r.label}>
                    <span>{r.label}</span>
                    <b>{r.value}</b>
                  </li>
                ))}
              </ul>
              <p className="pf-note">
                EPF stays live in some cases until you turn 58. The free audit
                tells you which applies to yours.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- why stuck */}
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
          </div>
        </section>

        {/* ----------------------------------------------------- numbers */}
        <section className="pf-sec pf-dark" data-theme="dark">
          <div className="pf-wrap">
            <Eyebrow>You are not the only one</Eyebrow>
            <h2 className="pf-h2">A lot of money is parked this way.</h2>
            <div className="pf-stats">
              {STATS.map((s) => (
                <div key={s.value} className="pf-stat">
                  <div className="pf-stat-v">{s.value}</div>
                  <div className="pf-stat-l">{s.label}</div>
                  <div className="pf-stat-s">{s.source}</div>
                </div>
              ))}
            </div>
            <p className="pf-fine">
              These are all-India figures. Nobody publishes a split for NRIs,
              who are among the least able to fix an account from abroad.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------- how */}
        <section className="pf-sec">
          <div className="pf-wrap">
            <Eyebrow>How Niro does it</Eyebrow>
            <h2 className="pf-h2">Minutes of your time. Weeks of ours.</h2>
            <p className="pf-p">
              Cases are worked by our resolution partner, who has supported more
              than 10,000 families with stuck provident fund and other claims.
              Niro runs everything you see, on one WhatsApp thread.
            </p>
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
                <div className="pf-card-label">What we do</div>
                <ul className="pf-list">
                  {US.map((t) => (
                    <li key={t}>
                      <Icon name="check" size={15} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pf-beyond">
              <h3>PF is one of 50+ things Niro handles for Indians abroad.</h3>
              <p>
                The same WhatsApp thread, for you and for your parents in India.
              </p>
              <ul>
                {BEYOND.map((b) => (
                  <li key={b.t}>
                    <Icon name={b.icon} size={16} />
                    <span>{b.t}</span>
                  </li>
                ))}
              </ul>
              <a href="/family-guide/" className="pf-beyond-link">
                <span>
                  See everything Niro does <span aria-hidden="true">&rarr;</span>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- steps + form */}
        <section className="pf-sec pf-inset" id="audit">
          <div className="pf-wrap pf-steps-grid">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="pf-h2">A free audit first. Then almost free.</h2>
              <ol className="pf-steps">
                <li>
                  <b>Free audit.</b> We look at your account and tell you what is
                  wrong, how complex the case is and what it takes. No
                  obligation.
                </li>
                <li>
                  <b>Almost free as a Niro member.</b> Members have up to
                  &#8377;4,500 of the partner&rsquo;s fee covered, which is most
                  simpler cases. On{" "}
                  <a href="/lite/">Niro Lite</a>, a case counts as 3 or 6 of your
                  20 tasks. Hiring help yourself, a complex case can cost
                  &#8377;10,000 to &#8377;20,000.
                  {/* Said here, before the audit, so the price is never a
                      surprise on the call that follows it. */}
                  <span className="pf-price">
                    Niro membership from {PLANS[1].price} a month, billed
                    quarterly, or Niro Lite at {NIRO_LITE.price} for 20 tasks.
                    Both cover far more than PF.
                  </span>
                </li>
                <li>
                  <b>We run it.</b> Simpler cases usually take three to eight
                  weeks. You hear from us every week until the money is in your
                  account. The rare case that runs to five months is quoted
                  separately.
                </li>
              </ol>
            </div>
            <div className="pf-card pf-form-card">
              <h3 className="pf-form-h">Get your free PF audit</h3>
              <PfAuditForm />
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- faq */}
        <section className="pf-sec">
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
            <p className="pf-fine pf-disclaimer">
              Niro is a family concierge service for Indians living abroad.
              Nothing on this page is tax, legal or investment advice. Outcomes
              and timelines depend on EPFO, your employer and your bank, which
              we work with but do not control.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
