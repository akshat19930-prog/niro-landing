"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/ds/Nav";
import { JoinCta } from "@/components/ds/JoinCta";
import { AskNiroCta, WhatsAppLink, ASK_MESSAGE } from "@/components/ds/WhatsAppLink";
import { Badge } from "@/components/ds/Badge";
import { Icon, type IconName } from "@/components/ds/Icon";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { VoiceStream } from "@/components/ds/VoiceStream";
import { ChatVideo } from "@/components/ds/ChatVideo";
import { ChatThreads } from "@/components/ds/ChatThreads";
import { StickyCta } from "@/components/sections/StickyCta";
import { Faq } from "@/components/sections/Faq";
import {
  PLANS, MEMBERSHIP_FEATURES, MEMBER_STORIES, GUARANTEE, FAQ, GUIDE_SCOPE,
  ARM_COPY, B2_QUOTES, B2_FAQ_EXTRA, B2_FAQ_FIRST_ANSWER, type ArmCopy,
} from "@/lib/content";
import type { LpVariant } from "@/lib/variant";

/* ---------------------------------------------------------------- helpers */

type GeoRegion = "gulf" | "us" | "canada" | null;

/** Geo personalisation, inferred from the browser time zone - client-only,
 *  zero-latency, no external call. Drives the hero eyebrow and the testimonial
 *  order (Gulf visitors lead with Dubai stories). Falls back to "abroad". */
function useGeo(): { region: GeoRegion; label: string } {
  const [geo, setGeo] = useState<{ region: GeoRegion; label: string }>({
    region: null,
    label: "FOR INDIANS LIVING ABROAD",
  });
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const canada =
        /Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal|Moncton|Whitehorse|Yellowknife|Iqaluit|Goose_Bay|Swift_Current|Cambridge_Bay|Fort_Nelson|Rankin_Inlet|Resolute|Dawson|Creston/i;
      const us =
        /New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana|Kentucky|Boise|Juneau|Sitka|Menominee|Honolulu|Adak|Nome/i;
      if (/Dubai|Abu_Dhabi/i.test(tz))
        setGeo({ region: "gulf", label: "FOR INDIANS LIVING IN THE UAE" });
      else if (/Qatar|Bahrain|Riyadh|Kuwait|Muscat|Aden|Dubai/i.test(tz))
        setGeo({ region: "gulf", label: "FOR INDIANS LIVING IN THE GULF" });
      else if (canada.test(tz))
        setGeo({ region: "canada", label: "FOR INDIANS LIVING IN CANADA" });
      else if (us.test(tz) || /^America\//.test(tz))
        setGeo({ region: "us", label: "FOR INDIANS LIVING IN THE US" });
    } catch {
      /* keep default */
    }
  }, []);
  return geo;
}

const sectionPad = "64px var(--gutter)";
const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-3xl)",
  lineHeight: "var(--leading-tight)",
  letterSpacing: "var(--tracking-tight)",
  color: "var(--text-strong)",
  fontWeight: 500,
  margin: 0,
} as const;

/* ------------------------------------------------------------------- hero */

function HeroB({ c, arm }: { c: ArmCopy; arm: LpVariant }) {
  const { label: geo } = useGeo();
  return (
    <section
      data-screen-label="Hero (B)"
      style={{ padding: "32px var(--gutter) 40px", position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--jaali)",
          backgroundSize: "72px",
          opacity: 0.6,
          maskImage: "linear-gradient(180deg,transparent,black 30%,black 70%,transparent)",
          WebkitMaskImage: "linear-gradient(180deg,transparent,black 30%,black 70%,transparent)",
        }}
      />
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))",
          gap: 44,
          alignItems: "center",
        }}
      >
        <div>
          <Eyebrow>{geo}</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
              color: "var(--text-strong)",
              margin: "12px 0 16px",
              fontWeight: 500,
            }}
          >
            When something needs doing in India, tell Niro
          </h1>
          {c.heroSub.map((line, i) => (
            <p
              key={line}
              style={{
                fontSize: "var(--text-md)",
                lineHeight: "var(--leading-body)",
                color: "var(--text-body)",
                maxWidth: 520,
                margin: i === c.heroSub.length - 1 ? "0 0 24px" : "0 0 10px",
              }}
            >
              {line}
            </p>
          ))}
          <JoinCta className="btn btn-primary btn-lg" position="hero">Try 1st free task</JoinCta>
          {/* Matches /us placement-for-placement. The two pages are being
              compared on signup rate, so an escape hatch on one and not the
              other biases that comparison. */}
          <AskNiroCta
            placement="hero"
            prompt="Got something specific in mind?"
            label="Ask Niro on WhatsApp"
            marginTop={14}
          />
          <div
            className="hero-desc"
            style={{
              marginTop: 14,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
            }}
          >
            {c.heroDescriptors.map((d, i) => (
              <span key={d} style={{ display: "contents" }}>
                {i > 0 && (
                  <span className="hero-desc-sep" aria-hidden="true">
                    ·
                  </span>
                )}
                <span>{d}</span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          {arm === "B2" ? <ChatThreads /> : <ChatVideo />}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- how it works */

/**
 * How it works, as three beats.
 *
 * The section makes one argument: the member only does step one. So step one
 * is the only thing that moves - a live feed of asks arriving - and steps two
 * and three are calm. The asks deliberately alternate between the family's
 * ("Mum") and the member's own India admin ("You"), because the research found
 * two distinct jobs inside one product and a visitor who came for their stuck
 * EPF claim has to see themselves in the feed too.
 *
 * Step two is split into the two halves of the service: the remote work, and
 * Niro Visits. The visits card carries the accent border - it is the part no
 * amount of software can imitate, and it was previously nowhere on the page.
 */
function ParentsB({ c }: { c: ArmCopy }) {
  return (
    <section data-screen-label="Parents (B)" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <Eyebrow>{c.familyEyebrow}</Eyebrow>
          <h2 style={{ ...h2Style, margin: "14px 0 16px" }}>
            {c.familyHeading}
          </h2>
          <p style={{ fontSize: "var(--text-md)", lineHeight: "var(--leading-body)", color: "var(--text-body)", maxWidth: 520, margin: "0 0 14px" }}>
            {c.familyBody[0]}
          </p>
          <p style={{ fontSize: "var(--text-md)", lineHeight: "var(--leading-body)", color: "var(--text-strong)", maxWidth: 520, margin: "0 0 18px", fontWeight: 500 }}>
            {c.familyBody[1]}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["WhatsApp", "Voice note", "A phone call", "Any language"].map((t) => (
              <Badge key={t} tone="neutral">{t}</Badge>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "var(--wa-bg)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-5)",
            boxShadow: "var(--shadow-2)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: "var(--ink-500)",
              marginBottom: 12,
            }}
          >
            What they actually send us
          </div>
          <VoiceStream />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- use cases */

function UseCasesB() {
  // The six standard categories, worded exactly as they appear in the signup
  // qualifier, the scope page and the ops taxonomy - so a lead who ticks a box
  // here recognises the same words on the next screen and in their first
  // WhatsApp reply.
  //
  // The task list under each one is NOT duplicated here: it is read from
  // GUIDE_SCOPE, the same source /family-guide renders, matched on the icon
  // rather than the title so a wording tweak on either side cannot silently
  // break the pairing.
  const [openCard, setOpenCard] = useState<string | null>(null);
  const cases: { icon: IconName; title: string }[] = [
    { icon: "heart-pulse", title: "Family's health admin & emergency response" },
    { icon: "wrench", title: "Household chores, upkeep & staff" },
    { icon: "file-text", title: "EPFO, tax, govt paperwork & documents" },
    { icon: "plane", title: "Travel concierge & admin" },
    { icon: "wallet", title: "Bills, banking, customer support issues & refund claims" },
    { icon: "home", title: "Property management & others" },
  ];
  return (
    <section
      id="what-niro-does"
      data-screen-label="Use cases (B)"
      style={{ padding: sectionPad, background: "var(--bg-inset)", scrollMarginTop: 72 }}
    >
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px" }}>Everything that makes you wish you were in India. And more.</h2>
        <div
          style={{
            display: "grid",
            // Six cards, so the track minimum is picked to land on 3 or 2 per
            // row and never 4 - four would leave a ragged 4+2. In a 1120px
            // container with a 16px gap, four tracks need 1328px and cannot
            // fit, three need 992px and do. Below ~696px it drops to one.
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 16,
            // Cards grow when opened; without this the whole row grows with them.
            alignItems: "start",
          }}
        >
          {cases.map((c) => {
            const scope = GUIDE_SCOPE.find((g) => g.icon === c.icon);
            const isOpen = openCard === c.title;
            return (
              <div
                key={c.title}
                className={"uc-card" + (isOpen ? " uc-open" : "")}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpenCard(isOpen ? null : c.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenCard(isOpen ? null : c.title);
                  }
                }}
              >
                <span className="uc-ico">
                  <Icon name={c.icon} size={22} />
                </span>
                <div className="uc-title">{c.title}</div>
                {scope && (
                  <>
                    <span className="uc-hint">
                      {scope.items.length} things we handle
                      <span aria-hidden="true" className="uc-chev">
                        <Icon name="chevron-right" size={15} />
                      </span>
                    </span>
                    <ul className="uc-list">
                      {scope.items.map((it) => (
                        <li key={it.t}>
                          <Icon name="check" size={14} />
                          <span>
                            {it.t}
                            {it.href && (
                              // stopPropagation: the whole card is a toggle, so
                              // without this the click opens the link AND
                              // collapses the list under the cursor.
                              <a
                                href={it.href}
                                className="uc-more"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {it.hrefLabel || "Learn more"}
                              </a>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: "var(--text-md)",
            color: "var(--text-body)",
            fontStyle: "italic",
          }}
        >
          &hellip; and anything else you need done in India.
        </p>
        <AskNiroCta
          placement="capabilities"
          prompt="Not sure if Niro can handle something?"
          label="Tell us what you need"
          align="center"
          marginTop={10}
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- stories */

function StoriesB() {
  // All four, in one grid, no geo picking. The set is deliberately two members
  // and two parents: the members say what they stopped doing, the parents say
  // they actually use it themselves, which is the claim a member's quote can
  // never make on their behalf.
  return (
    <section data-screen-label="Stories (B)" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Real families</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px", maxWidth: 760 }}>
          Real people. Real things they stopped having to chase.
        </h2>
        <div className="story-grid">
          {MEMBER_STORIES.map((s) => (
            <figure key={s.name} className="story-card">
              {/* Curly doubles, because the headline IS the quote. The body
                  under it is the same person still speaking, left unquoted so
                  the card does not turn into a wall of quote marks. */}
              <blockquote>&ldquo;{s.headline}&rdquo;</blockquote>
              <p>{s.body}</p>
              <figcaption>
                <span
                  className="story-face"
                  style={
                    s.photo
                      ? { backgroundImage: `url("${s.photo}"), linear-gradient(150deg,#EAD9B8,#C9986A)` }
                      : undefined
                  }
                />
                <span>
                  <b>{s.name}</b>
                  <span>{s.location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustB({ c }: { c: ArmCopy }) {
  // Five claims, each something a member could hold us to. Four answer an
  // objection the research recorded: the emergency nobody believes, the visit
  // nobody else does, the commission everyone suspects, and the stranger
  // nobody vetted. The fifth states the everyday thing most of the membership
  // actually is, which the page had been leaving the pricing section to say.
  const items: { icon: IconName; text: string; sub: string; href?: string; hrefLabel?: string }[] = [
    {
      icon: "heart-pulse",
      text: "Assure - emergency protocol",
      sub: "The assurance of a rapid, contextual response to a medical emergency back home. You define it, we execute it.",
      href: "/niro-assure/",
      hrefLabel: "Read more on Niro Assure",
    },
    {
      icon: "map-pin",
      text: "Visits - assistant on demand",
      sub: c.visitsTrustBody,
    },
    {
      icon: "message-circle",
      text: "Unlimited tasks - done remotely",
      sub: "50+ types of task done with a simple text or voice message, saving you and your family the time, the hassle and sometimes the money too.",
    },
    {
      icon: "user-check",
      text: "Verified assistants, on our payroll",
      sub: "Vetted extensively, on our own payroll, and appraised on one thing: whether your family is satisfied.",
    },
    {
      icon: "shield-check",
      text: "Honest recommendations",
      sub: "We never earn a commission from any third-party vendor. We find and book only what is actually best for you.",
    },
  ];
  return (
    <section data-screen-label="Trust (B)" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Why families trust Niro</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 30px", maxWidth: 900 }}>
          Built to elevate the lives of NRIs and their families.
        </h2>
        {/* Four items, so an explicit two-up rather than auto-fit: auto-fit
            gives three columns at this width and orphans the fourth. */}
        <div className="trust-grid">
          {items.map((it, i) => (
            <div
              key={it.text}
              // Odd count, two columns: the last item would sit alone in the
              // left half and read as a leftover. Spanning it looks deliberate.
              className={i === items.length - 1 ? "trust-wide" : undefined}
              style={{ display: "flex", alignItems: "flex-start", gap: 13 }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                }}
              >
                <Icon name={it.icon} size={22} />
              </span>
              <div style={{ lineHeight: 1.45 }}>
                <div style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-strong)" }}>
                  {it.text}
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  {it.sub}
                  {it.href && (
                    <>
                      {" "}
                      <a href={it.href} style={{ color: "var(--brand)", fontWeight: 500 }}>
                        {it.hrefLabel} &rarr;
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

/**
 * Pricing.
 *
 * Both SKUs carry an identical feature list, so showing that list twice made
 * the section look like a comparison when there is nothing to compare. The
 * benefits move into a single shared grid underneath, and the two prices sit
 * above it as equal options - no dark card, no "most families" badge. Nothing
 * on the page should push someone toward a term length; we would rather they
 * pick the one they actually want and stay.
 *
 * No guarantee band: the site makes no written guarantees (Paarth, Sept 2026).
 */
function PricingB({ c }: { c: ArmCopy }) {
  return (
    <section id="pricing-fold" data-screen-label="Pricing (B)" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow style={{ justifyContent: "center" }}>Pricing</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 8px", textAlign: "center" }}>
          One membership. Two ways to pay.
        </h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 26px", textAlign: "center" }}>
          Your first trial task is free. And you can cancel any time.
        </p>

        <div className="price-pair">
          {PLANS.map((p) => (
            <div className="price-opt" key={p.id}>
              <div className="price-opt-name">{p.name}</div>
              <div className="price-opt-amount">
                <span className="price-opt-num">{p.price}</span>
                <span className="price-opt-per">{p.per}</span>
              </div>
              <div className="price-opt-note">
                {p.id === "quarter" ? "Billed $250 every three months." : "Billed monthly. No lock-in."}
              </div>
            </div>
          ))}
        </div>

        <div className="price-includes">
          <div className="price-includes-title">Every membership includes</div>
          <ul className="price-includes-list">
            {c.membershipFeatures.map((f) => (
              <li key={f}>
                <Icon name="check-circle" size={17} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Directly above the CTA, so it is the last thing read before the tap.
            The objection it answers is risk, not price, and risk is what stops
            someone at this exact point. */}
        <div className="guarantee">
          <Icon name="shield-check" size={19} />
          <div>
            <b>{GUARANTEE.title}</b>
            <span>{GUARANTEE.body}</span>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <JoinCta className="btn btn-primary btn-lg" position="pricing">Try Niro now</JoinCta>
          <AskNiroCta
            placement="pricing"
            prompt="Questions before joining?"
            label="Chat with us on WhatsApp"
            align="center"
            marginTop={14}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- faq */

/**
 * The page FAQ. Answers come from lib/content FAQ, except the three that carry
 * structure a plain string cannot: the data answer needs its four commitments
 * as separate lines, the emergency answer links through to Niro Assure, and
 * the trial answer needs a live WhatsApp link to claim the free task.
 */
const MAIN_FAQ_ITEMS = FAQ.map((f) => {
  // Matched on the question, not its index. The list gets reordered as we learn
  // which answers people hunt for, and an index would silently bolt this markup
  // onto whichever question happened to move into that slot.
  if (f.q.indexOf("data safe") >= 0) {
    return {
      q: f.q,
      a: (
        <>
          <p style={{ margin: "0 0 10px" }}>
            Yes, and here is how we are building it rather than how we are
            describing it.
          </p>
          <ul className="faq-points">
            <li>
              <b>You keep control.</b> We periodically tell you exactly what data we
              hold on your family, and you can delete all of it in one click. Leave
              Niro and your records are permanently erased within 30 days.
            </li>
            <li>
              <b>Documents live in a secure vault.</b> Encrypted in transit and at
              rest, and inaccessible to our staff without an open task that requires
              them. Access is scoped to the task and logged.
            </li>
            <li>
              <b>We never ask for passwords, PINs or net-banking logins.</b> Some
              tasks need a one-time code to finish. When one does, we tell you what
              we are about to do, ask you at that moment, and use it only for that
              task. Say no and we find another route.
            </li>
            <li>
              <b>Built to DPDP, and to global standards.</b> We operate under
              India&rsquo;s DPDP Act and are building to GDPR-aligned practices for
              members abroad. Your data is never sold.
            </li>
          </ul>
          <p style={{ margin: 0 }}>
            Questions? hello@tellniro.com reaches the founders.
          </p>
        </>
      ),
    };
  }
  if (f.q.indexOf("emergency response") >= 0) {
    return {
      q: f.q,
      a: (
        <>
          <p style={{ margin: "0 0 10px" }}>{f.a}</p>
          <a href="/niro-assure/" style={{ fontWeight: 600 }}>
            Read the full protocol on Niro Assure &rarr;
          </a>
        </>
      ),
    };
  }
  return { q: f.q, a: f.a };
});

/* ---------------------------------------------------------------- variant */

/** Variant B - the "You can't always be in India. Niro can." reposition. */
/**
 * The landing page, rendered for one arm of the positioning A/B.
 *
 * Arm A is / and arm B2 is /start. Both render THIS component, from one set of
 * sections, with the strings that carry the pitch pulled from ARM_COPY. That
 * is deliberate rather than tidy: a forked copy of the page would drift, and
 * every unintended difference between the arms is noise in the only number the
 * test exists to produce.
 */
export function VariantB({ arm = "A" }: { arm?: LpVariant } = {}) {
  const c = ARM_COPY[arm];
  // Arm B2 reworks the membership answer (it describes where you talk to Niro)
  // and adds the question about whether parents have to agree to anything. Both
  // are found by content rather than position, for the reason above.
  const faqItems =
    arm === "B2"
      ? MAIN_FAQ_ITEMS.flatMap((f) =>
          f.q.indexOf("membership include") >= 0
            ? [{ ...f, a: B2_FAQ_FIRST_ANSWER }, B2_FAQ_EXTRA]
            : [f]
        )
      : MAIN_FAQ_ITEMS;
  return (
    <>
      <Nav cta="What Niro does" ctaHref="#what-niro-does" />
      <main>
        <HeroB c={c} arm={arm} />
        <UseCasesB />
        <StoriesB />
        <ParentsB c={c} />
        <TrustB c={c} />
        <PricingB c={c} />
        <Faq items={faqItems} showAsk={false} />
      </main>
      <StickyCta label="Try 1st free task" />
    </>
  );
}
