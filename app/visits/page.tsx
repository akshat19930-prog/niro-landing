import type { Metadata } from "next";
import Image from "next/image";
import { ProofVideo } from "@/components/ds/ProofVideo";
import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { GUIDE_SCOPE, MEMBERSHIP_FEATURES } from "@/lib/content";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { VisitForm } from "./VisitForm";
import { VisitStickyCta } from "./VisitStickyCta";
import { PfLink } from "../pf/PfLink";
import "../pf/pf.css";
import "./visits.css";

/**
 * /visits - Niro Visits as its own campaign page, built on the /pf
 * construct: the same hero, section, card, pricing, form and FAQ register,
 * so the two campaign pages stay one family rather than two designs.
 *
 * What it sells is the one thing that cannot be done remotely. The PLG hook
 * is the intake itself (telling us the visit, and the serviceability answer,
 * costs nothing); the monetisation hook is that a visit is a paid benefit,
 * sweetened by the first visit free on the 3-month membership.
 *
 * noindex until the campaign is briefed: the page is live for review and for
 * paid traffic, and paid traffic does not need the organic listing.
 */
export const metadata: Metadata = {
  title: "Niro Visits: someone there in person, in 79 Indian cities - Niro",
  description:
    "You cannot fly down every time someone has to be there. A Niro Assistant turns up in person in 79 Indian cities for the hospital, the passport office or your parents' flat, and sends photos, bills and a written report the same day.",
  alternates: { canonical: "https://tellniro.com/visits/" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "You can't fly down every time someone has to be there.",
    description:
      "A Niro Assistant turns up in person in 79 Indian cities, and you get photos, bills and a written report the same day.",
    type: "website",
    url: "https://tellniro.com/visits/",
  },
};

/** The two visits we can show, with the family's permission. Both are real
 *  and both are already in the ad creatives, so the page and the ads tell
 *  the same story. */
const STORIES: {
  img: string;
  alt: string;
  tag: string;
  h: string;
  body: string;
  got: string;
}[] = [
  {
    img: "/media/visit-passport-jaipur.jpg",
    alt: "A Niro assistant sitting with a member's mother before her passport appointment in Jaipur",
    tag: "Jaipur, passport",
    h: "Mom's passport, end to end. We were there with her.",
    body: "Booked the appointment, prepared every document, went with her to the passport office, then chased dispatch and police verification.",
    got: "Passport in hand before her trip abroad, without a son flying down or a sibling taking three days off.",
  },
  {
    img: "/media/visit-hospital-chennai.jpg",
    alt: "A Niro assistant outside Dr Rela Institute in Chennai, before a second-opinion consult",
    tag: "Chennai, hospital",
    h: "A top surgeon who doesn't do online consults. We took the reports in.",
    body: "A second opinion before liver surgery: slots found the same evening, the appointment booked, our Assistant at the hospital with the reports, notes sent back the same day.",
    got: "A second opinion before major surgery, from Dubai, without anyone getting on a plane.",
  },
];

/** The home page's six categories, narrowed to the tasks that need a person
 *  standing there. Same icons, same order, so a visitor who knows the home
 *  page recognises the shape. */
const COVERS: { icon: IconName; title: string; items: string[] }[] = [
  {
    icon: "heart-pulse",
    title: "Health and hospital",
    items: [
      "Sitting with a parent through a consult",
      "Admission and discharge paperwork",
      "Carrying reports in for a second opinion",
      "Collecting scans and test results",
    ],
  },
  {
    icon: "plane",
    title: "Passport, visa and travel",
    items: [
      "Passport Seva appointments, start to finish",
      "Visa centre submissions and biometrics",
      "Police verification at the house",
      "Seeing a parent off, or receiving them",
    ],
  },
  {
    icon: "file-text",
    title: "Government paperwork",
    items: [
      "Aadhaar updates and biometric re-dos",
      "Life certificates for pension",
      "Sub-registrar and registrar offices",
      "EPFO and pension office queues",
    ],
  },
  {
    icon: "wallet",
    title: "Banks and offices",
    items: [
      "Branch visits and in-person KYC",
      "Locker operations with a parent",
      "Signatures that need a witness",
      "Collecting a cheque book or card",
    ],
  },
  {
    icon: "home",
    title: "Property",
    items: [
      "Inspection before or after a tenant",
      "A locked-up flat checked and photographed",
      "Meter readings, handover, keys",
      "Society meetings and broker viewings",
    ],
  },
  {
    icon: "wrench",
    title: "Home and staff",
    items: [
      "Supervising an appliance install or repair",
      "Meeting a cook, driver or attendant",
      "Being there for a service appointment",
      "Checking work was actually finished",
    ],
  },
];

const STEPS: { h: string; body: string }[] = [
  {
    h: "You tell us the visit",
    body: "What it is for, which city, and whether it is one job or an ongoing need. Two minutes in the form below.",
  },
  {
    h: "We confirm the assistant",
    body: "Name, photo and phone number in your family group the day before. You know who is turning up.",
  },
  {
    h: "They turn up",
    body: "With your parents, or on their own with the paperwork. They call you if a decision is needed.",
  },
  {
    h: "Report lands end of day",
    body: "Everything that happened, written down, with photos and bills. Below is what it looks like.",
  },
];

/** A real report's shape, filled with the Jaipur passport visit. Shown
 *  rather than described: "you get a report" is a promise, this is a
 *  specimen. */
const REPORT: { t: string; d: React.ReactNode }[] = [
  {
    t: "What was done",
    d: "Token taken at 10:52. Documents verified at Counter B, photo and biometrics done, police verification slot booked for the 14th at the house.",
  },
  { t: "Who we met", d: "Verifying officer at Counter B. Nothing was escalated." },
  {
    t: "Decisions taken",
    d: "Address proof switched from the electricity bill to the Aadhaar, on your call at 11:15.",
  },
  {
    t: "Money spent",
    d: "Government fee ₹1,500, paid online before the visit. Receipt attached. No cash changed hands.",
  },
  {
    t: "Photos",
    d: (
      <div className="vz-thumbs">
        {["Token", "Counter", "Receipt", "With Mum"].map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    ),
  },
  {
    t: "Next",
    d: "Police verification on the 14th, someone must be home between 10 and 4. We will remind your mother and be there.",
  },
];

/** Who turns up. The single biggest objection to sending a stranger to your
 *  parents' house, answered in the body of the page rather than left to the
 *  FAQ. Every line here is a standing operating rule, not a marketing claim:
 *  if one of them stops being true, this fold has to change. */
const WHO: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "shield-check",
    title: "Verified before their first visit",
    body: "Government ID, address and a police record check through a licensed verification agency. Nobody reaches a member's family on the strength of an application form.",
  },
  {
    icon: "users",
    title: "On Niro's rolls, not a marketplace",
    body: "Assistants are engaged and paid by Niro, and carry employees' compensation cover while they are on a visit. You never pay, tip or settle anything with the person who turns up.",
  },
  {
    icon: "graduation-cap",
    title: "Trained on the visit protocol",
    body: "What to photograph, what goes in the report, and the three things an assistant never does: give medical or legal advice, handle your parents' cash, or take a decision without calling you first.",
  },
  {
    icon: "user-check",
    title: "You meet them before they arrive",
    body: "Name, photo and phone number in your family group the day before, and you can speak to them first. They turn up in a Niro shirt, carrying a Niro ID.",
  },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Who actually turns up?",
    a: "A Niro Assistant from our own panel in that city, background checked, in a Niro shirt. You get their name, photo and number the day before, and you can speak to them before the visit.",
  },
  {
    q: "How much notice do you need?",
    a: "Three working days for most visits. Tell us what you need in the form and we come back on WhatsApp within 24 hours with a day and the assistant's name.",
  },
  {
    q: "What does $25 cover?",
    a: "Up to four hours of the assistant's time, including travel inside the city. Anything paid on your behalf, a government fee or a test, is passed through at cost with the receipt in the report.",
  },
  {
    q: "Can I book a visit on the free trial?",
    a: "No. The trial covers everything we can do remotely. Visits start once you are a paying member, and on the 3-month plan your first one is free.",
  },
  {
    q: "My parents' city is not a metro. Can you still come?",
    a: "We cover 79 cities, including most state capitals and large district towns. Type the city into the form and it will tell you straight away.",
  },
];

export default function VisitsPage() {
  return (
    <>
      <Nav
        cta="Schedule a Niro Visit"
        ctaHref="#book"
        mobileCta={{ label: "What Niro does", href: "#about" }}
      />
      <main className="pf">
        {/* ------------------------------------------- 1. hero */}
        <section className="pf-hero" data-screen-label="Visits hero">
          <div className="pf-jaali" aria-hidden="true" />
          <div className="pf-wrap pf-narrow">
            <div>
              <Eyebrow>For Indians living abroad</Eyebrow>
              <h1 className="pf-h1">
                You can&rsquo;t fly down every time someone has to be there.
              </h1>
              <p className="pf-lead pf-lead-strong">
                So we go - the passport appointment, the doctor
                consultation, the flat that needs checking.
              </p>
              {/* Sub-text, not a second claim: it sits a shade lighter than
                  the lead above it so the hero reads as one statement with a
                  line of detail under it, not two headlines.

                  The line above says "so we go". This one answers the
                  question that follows, which is who exactly, and it is the
                  one objection worth spending the hero on: you are letting a
                  stranger into your parents' day. */}
              <p className="pf-lead vz-subtext">
                Not a stranger off an app. A Niro Assistant from our own bench
                in that city, verified, and you get their name and photo the
                day before.
              </p>
              <PfLink href="#book" kind="cta" placement="hero" className="btn btn-primary btn-lg pf-hero-btn">
                Schedule a Niro Visit
              </PfLink>
              <p className="pf-support">
                We come back with a slot and the assistant&rsquo;s name, within
                24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 2. real stories */}
        {/* Straight after the hero: the question a visitor actually has is
            "has anyone really done this", and these two answer it before
            any claim about scope or price. */}
        <section className="pf-sec pf-inset" data-screen-label="Visits stories">
          <div className="pf-wrap">
            <Eyebrow>Real Niro stories</Eyebrow>
            <h2 className="pf-h2">What a visit looks like.</h2>
            <p className="pf-p">
              Real families, real assistants, shared with their permission.
            </p>
            <div className="vz-stories">
              {STORIES.map((s) => (
                <article key={s.tag} className="vz-story">
                  <Image src={s.img} alt={s.alt} width={1080} height={608} sizes="(max-width: 760px) 92vw, 440px" />
                  <div className="vz-story-h">
                    <span className="vz-tag">{s.tag}</span>
                    <h3>{s.h}</h3>
                  </div>
                  <p className="vz-story-b">{s.body}</p>
                  <p className="vz-got">
                    <b>What the family got back</b>
                    {s.got}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 3. what a visit covers */}
        <section className="pf-sec" data-screen-label="Visits scope">
          <div className="pf-wrap">
            <Eyebrow>What a visit covers</Eyebrow>
            <h2 className="pf-h2">Anything in India that needs a person standing there.</h2>
            <p className="pf-p">
              6 categories Niro handles every day. These are the ones that
              cannot be done over a phone call.
            </p>
            <ul className="vz-covers">
              {COVERS.map((c) => (
                <li key={c.title} className="pf-card">
                  <span className="pf-ico">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <h3>{c.title}</h3>
                  <ul>
                    {c.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------- 4. how it works + report */}
        <section className="pf-sec pf-inset" data-screen-label="Visits how">
          <div className="pf-wrap">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="pf-h2">Form to report, in one day.</h2>
            <ol className="vz-steps">
              {STEPS.map((s, i) => (
                <li key={s.h} className="vz-step">
                  <div className="vz-step-n">{i + 1}</div>
                  <h3>{s.h}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="vz-report">
              <div className="vz-report-h">
                <b>Visit report: Passport Seva Kendra, Jaipur</b>
                <span>Thursday, 10:40 to 13:05 IST &middot; Assistant: Ravi K.</span>
              </div>
              <dl>
                {REPORT.map((r) => (
                  <div key={r.t} className="vz-report-row">
                    <dt>{r.t}</dt>
                    <dd>{r.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 5. who turns up */}
        {/* After the report, before the company: a reader who has just seen
            what lands at the end of the day asks who produced it. */}
        <section className="pf-sec" data-screen-label="Visits assistants">
          <div className="pf-wrap">
            <Eyebrow>Who turns up</Eyebrow>
            <h2 className="pf-h2">You know who is coming before they knock.</h2>
            <p className="pf-p">
              We keep our own bench in each city. The same people do the
              hospital sit-in, the passport queue and the locked-up flat, which
              is why they get better at it.
            </p>
            <ul className="vz-who">
              {WHO.map((w) => (
                <li key={w.title} className="pf-card">
                  <span className="pf-ico">
                    <Icon name={w.icon} size={22} />
                  </span>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------- 6. about Niro */}
        {/* The /pf fold, unchanged: the home page's six categories, titles
            only, then Niro Diaries and the catalogue link. Shared across the
            campaign pages on purpose. */}
        <section className="pf-sec" id="about" data-screen-label="Visits about">
          <div className="pf-wrap">
            <Eyebrow>About Niro</Eyebrow>
            <h2 className="pf-h2">
              Niro is a family assistant, purpose-built for Indians living
              abroad.
            </h2>
            <p className="pf-p">50+ types of tasks for NRIs and their families, all over WhatsApp.</p>
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
              <ProofVideo placement="visits_about" caption="Beyond visits: real tasks we have done for NRI families." />
            </div>
            <PfLink href="/family-guide/" kind="guide" placement="about_niro" className="pf-text-link pf-guide-link">
              See Niro&rsquo;s 50+ tasks catalogue
            </PfLink>
          </div>
        </section>

        {/* ------------------------------------------- 7. pricing */}
        {/* The membership card alone: Lite has no visits and the six-month
            pack is a /pf offer, so neither belongs on this page. The welcome
            benefit sits where /pf puts the PF Recovery Credit. */}
        <section className="pf-sec pf-inset" id="pricing" data-screen-label="Visits pricing">
          <div className="pf-wrap pf-pricing">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="pf-h2">One membership. Visits on demand.</h2>
            <p className="pf-p pf-p-wide">
              Telling us about the visit is free. For Niro to actually make it,
              you will need to be a member.
            </p>
            <PricingTiers
              membershipFeatures={MEMBERSHIP_FEATURES}
              memberLead="Your first Niro Visit free, worth $25, when you sign up for 3 months"
            />
            <PfLink href="#book" kind="cta" placement="pricing" className="pf-text-link">
              Start with your visit details
            </PfLink>
          </div>
        </section>

        {/* ------------------------------------------- 8. intake */}
        <section className="pf-sec" id="book" data-screen-label="Visits form">
          <div className="pf-wrap pf-form-wrap">
            <div className="pf-card pf-form-card">
              <Eyebrow>Schedule a visit</Eyebrow>
              <h2 className="pf-form-h">Schedule a Niro Visit today</h2>
              <p className="pf-form-sub">
                Your name and WhatsApp number first, then two quick questions.
              </p>
              <VisitForm />
            </div>
          </div>
        </section>

        {/* ------------------------------------------- 9. faq */}
        <section className="pf-sec pf-inset" data-screen-label="Visits FAQ">
          <div className="pf-wrap">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="pf-h2">Before you book.</h2>
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

        {/* ------------------------------------------- 10. final CTA */}
        <section className="pf-sec pf-close" data-screen-label="Visits close">
          <div className="pf-wrap">
            <h2 className="pf-h2">Your family&rsquo;s personal assistant in India.</h2>
            <p className="pf-p">
              Errands, bills, appointments and emergencies for your parents,
              and someone who turns up in person when the job needs it.
            </p>
            <PfLink href="/" kind="guide" placement="final_about" className="btn btn-primary btn-lg">
              Know more about Niro
            </PfLink>
          </div>
        </section>
      </main>
      <VisitStickyCta />
      <Footer />
    </>
  );
}
