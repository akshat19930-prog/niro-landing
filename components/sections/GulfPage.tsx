"use client";

import { useEffect, useRef } from "react";
import { Nav } from "@/components/ds/Nav";
import { JoinCta } from "@/components/ds/JoinCta";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { ChatVideo } from "@/components/ds/ChatVideo";
import { StickyCta } from "@/components/sections/StickyCta";
import { Faq } from "@/components/sections/Faq";
import { logEvent } from "@/lib/track";
import { GULF_TESTIMONIALS, GULF_FAQ } from "@/lib/content";

/* ------------------------------------------------------------ shared style */

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

/* -------------------------------------------------------------------- hero */

function GulfHero() {
  return (
    <section
      data-screen-label="Gulf hero"
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
          <Eyebrow>For Indian families in the Gulf</Eyebrow>
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
            Your life here didn&rsquo;t come with a family support system.
          </h1>
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-body)",
              color: "var(--text-body)",
              maxWidth: 540,
              margin: "0 0 24px",
            }}
          >
            The cleaner quit. Emirates ID is due in three weeks. Summer camp is already
            filling. Niro gives you a named person to handle the things that fall between
            work, school and home &mdash; and gets you back 15+ hours a month.
          </p>
          <div
            style={{
              marginBottom: 18,
              fontSize: "var(--text-md)",
              fontStyle: "italic",
              color: "var(--text-body)",
            }}
          >
            And yes &mdash; we handle your parents in India too.
          </div>
          <JoinCta className="btn btn-primary btn-lg" position="hero">
            Get Early Access
          </JoinCta>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px 14px",
              marginTop: 18,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
            }}
          >
            <span>Remote House Manager</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp-first</span>
            <span aria-hidden="true">·</span>
            <span>Serving Dubai, Abu Dhabi &amp; Sharjah</span>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          <ChatVideo
            src="/media/gulf-hero.mp4"
            poster="/media/gulf-hero-poster.jpg"
            aspect="1080 / 1920"
            ariaLabel="A WhatsApp conversation showing Niro handling tasks in Dubai and in India"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- how it works */

function AskBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          background: "var(--brand-soft)",
          color: "var(--text-strong)",
          borderRadius: 16,
          borderTopRightRadius: 5,
          padding: "12px 16px",
          maxWidth: 460,
          fontSize: "var(--text-base)",
          lineHeight: 1.45,
          boxShadow: "var(--shadow-1)",
        }}
      >
        {children}
        <span style={{ float: "right", marginLeft: 10, marginTop: 4, fontSize: 10.5, color: "var(--brand)" }}>
          ✓✓
        </span>
      </div>
    </div>
  );
}

function AskColumn({ label, asks }: { label: string; asks: string[] }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wide)",
          color: "var(--accent-strong)",
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {asks.map((a) => (
          <AskBubble key={a}>{a}</AskBubble>
        ))}
      </div>
    </div>
  );
}

function GulfHowItWorks() {
  const gulfAsks = [
    "Our cleaner quit. We need someone reliable from next week.",
    "Can you find a licensed maths tutor in JLT, twice a week?",
    "Kids’ Emirates IDs expire this month — can you start it?",
  ];
  const indiaAsks = [
    "Get Mom a cab for her hospital appointment tomorrow.",
    "Dad’s AC isn’t working — can you get someone to fix it?",
    "Check what’s happening with my father’s EPF claim.",
  ];
  return (
    <section data-screen-label="Gulf how it works" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>How it works</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px" }}>One message instead of five phone calls.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: "28px 24px",
            marginBottom: 30,
          }}
        >
          <AskColumn label="Here in the Gulf" asks={gulfAsks} />
          <AskColumn label="For your parents in India" asks={indiaAsks} />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px 14px",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-md)",
            fontWeight: 600,
            color: "var(--text-strong)",
          }}
        >
          <span>You ask</span>
          <Icon name="arrow-right" size={18} style={{ color: "var(--brand)" }} />
          <span>We handle it</span>
          <Icon name="arrow-right" size={18} style={{ color: "var(--brand)" }} />
          <span>You get an update</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ for your household + hinge */

function GulfHousehold() {
  return (
    <section data-screen-label="Gulf household" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>For your household</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 16px" }}>
          Get the weekend back. And the evenings. And each other.
        </h2>
        <p
          style={{
            fontSize: "var(--text-md)",
            lineHeight: "var(--leading-body)",
            color: "var(--text-body)",
            margin: "0 0 18px",
          }}
        >
          Not another delivery app &mdash; someone who handles what a button can&rsquo;t: a
          replacement cleaner, a tutor who turns up, school paperwork, a camp before it fills.
        </p>
        <p
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: 1.5,
            color: "var(--text-strong)",
            fontStyle: "italic",
            fontFamily: "var(--font-display)",
            margin: 0,
          }}
        >
          When did the two of you last have dinner without a to-do list running underneath it?
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- what Niro handles */

type HandleCard = {
  icon: IconName;
  title: string;
  items: string[];
  crossBorder?: boolean;
};

const HANDLES: HandleCard[] = [
  {
    icon: "home",
    title: "Your home here",
    items: [
      "Finding and coordinating domestic help",
      "Maintenance, utilities, and the customer-service calls nobody wants to make",
      "Rent renewal, Ejari and DEWA",
      "Car registration, fines and insurance",
    ],
  },
  {
    icon: "star",
    title: "Your kids",
    items: [
      "School applications and paperwork",
      "Summer camps, booked before they fill",
      "Tutors — licensed, checked, and they turn up",
      "Activities and the logistics around them",
    ],
  },
  {
    icon: "file-text",
    title: "Paperwork, here and there",
    items: [
      "Emirates ID and Iqama renewals for the family",
      "Medical fitness tests and biometrics appointments",
      "EPFO, banking and government paperwork in India",
      "Insurance and document follow-ups",
    ],
  },
  {
    icon: "heart-pulse",
    title: "Your parents in India",
    items: [
      "Doctor appointments and cabs",
      "Home repairs, and managing their help",
      "Health checkups and follow-ups",
      "Emergency response — ambulance partner plus our own person at the hospital",
    ],
  },
  {
    icon: "arrow-up-right",
    title: "Across both countries",
    crossBorder: true,
    items: [
      "Attestation from India: state, MEA, embassy, MOFA. We run the whole chain.",
      "Parents' visit visas and airport assistance",
      "Summer trips home, arranged end to end",
      "Anything where being in one country isn't enough",
    ],
  },
  {
    icon: "map-pin",
    title: "Property in India",
    items: [
      "Tenant issues",
      "Maintenance and repairs",
      "Property tax and paperwork",
      "Rent collection follow-ups",
    ],
  },
];

function HandleCardView({ card }: { card: HandleCard }) {
  const cross = card.crossBorder;
  return (
    <div
      style={{
        position: "relative",
        background: cross ? "var(--gold-50, #FBF6EA)" : "var(--surface-card)",
        border: cross ? "1.5px solid var(--gold-300)" : "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-5)",
        boxShadow: cross ? "var(--shadow-2)" : "var(--shadow-1)",
      }}
    >
      {cross && (
        // Two-dot corridor motif — the one claim no competitor can make.
        <div
          aria-hidden="true"
          style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-strong)" }} />
          <span style={{ flex: "0 0 26px", height: 1.5, background: "var(--gold-300)" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-strong)" }} />
        </div>
      )}
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: cross ? "var(--gold-300)" : "var(--brand-soft)",
          color: cross ? "var(--forest-900)" : "var(--brand)",
          marginBottom: 14,
        }}
      >
        <Icon name={card.icon} size={22} />
      </span>
      <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-strong)", marginBottom: 10 }}>
        {card.title}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
        {card.items.map((it) => (
          <li key={it} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: 1.45 }}>
            <Icon name="check" size={15} style={{ marginTop: 3, flexShrink: 0, color: cross ? "var(--accent-strong)" : "var(--brand)" }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GulfHandles() {
  return (
    <section data-screen-label="Gulf handles" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px" }}>
          Everything that falls between work, school and home.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {HANDLES.map((c) => (
            <HandleCardView key={c.title} card={c} />
          ))}
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: 26,
            fontSize: "var(--text-lg)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--text-strong)",
          }}
        >
          One team in India. One team here. Two WhatsApp groups. One place to ask.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- families */

function GulfFamilies() {
  return (
    <section data-screen-label="Gulf families" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Real families</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>
          Built for households where both adults work.
        </h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 28px", maxWidth: 560 }}>
          And nobody has the time to run the house.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {GULF_TESTIMONIALS.map((s) => (
            <figure
              key={s.name}
              style={{
                margin: 0,
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-5)",
                boxShadow: "var(--shadow-2)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <blockquote style={{ margin: "0 0 18px", fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--text-body)" }}>
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    flexShrink: 0,
                    backgroundColor: "var(--gold-200, #EAD9B8)",
                    backgroundImage: `url("${s.photo}"), linear-gradient(150deg,#EAD9B8,#C9986A)`,
                    backgroundSize: "cover, cover",
                    backgroundPosition: "center, center",
                    boxShadow: "var(--shadow-1)",
                  }}
                />
                <div style={{ lineHeight: 1.35 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-strong)" }}>{s.name}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{s.location}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--accent-strong)", fontWeight: 600, marginTop: 2 }}>
                    Beta member
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- trust */

function GulfTrust() {
  const items: { icon: IconName; text: string; sub: string }[] = [
    { icon: "user-check", text: "A real person, not a chatbot", sub: "A named human who coordinates the actual work." },
    { icon: "phone", text: "One dedicated contact", sub: "You never explain your family from scratch again." },
    { icon: "message-circle", text: "Two groups, one team", sub: "One for India, one for home here." },
    { icon: "lock", text: "No passwords or OTPs", sub: "We never ask for a banking password, an email password, or an OTP. Anyone who does isn't us." },
    { icon: "mic", text: "Nothing for your parents to learn", sub: "WhatsApp, a voice note, or a phone call. English, Hindi, Tamil or Malayalam." },
    { icon: "wallet", text: "One predictable membership", sub: "Not a different vendor and a different price every time." },
  ];
  return (
    <section data-screen-label="Gulf trust" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Why families trust Niro</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px" }}>
          Handing over your family&rsquo;s to-dos is a big deal. We treat it that way.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 18,
          }}
        >
          {items.map((it) => (
            <div key={it.text} style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
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
              <div style={{ lineHeight: 1.4 }}>
                <div style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-strong)" }}>{it.text}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- pricing */

function GulfPricing() {
  const features = [
    "Unlimited tasks, both countries",
    "Two WhatsApp groups — one for India, one for home here",
    "Your parents just WhatsApp. Nothing to install, nothing to learn.",
    "Emergency response for your parents in India — ambulance partner plus our own person at the hospital",
    "₹20 lakh cyber-fraud cover for your parents in India, plus monitoring",
    "A named contact who knows your family",
  ];
  return (
    <section data-screen-label="Gulf pricing" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--forest-700)",
            color: "var(--ivory)",
            border: "1px solid var(--forest-700)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            boxShadow: "var(--shadow-brand)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wide)",
              color: "var(--gold-300)",
            }}
          >
            Niro Prime
          </div>
          <div style={{ margin: "10px 0 4px", display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "#fff" }}>$149</span>
            <span style={{ fontSize: "var(--text-md)", color: "rgba(255,255,255,0.72)" }}>/month</span>
          </div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--gold-300)", fontWeight: 500, margin: "0 0 18px", lineHeight: 1.5 }}>
            The first house manager that works in both places your family lives. Gets you back
            15+ hours a month.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 11 }}>
            {features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: "var(--text-sm)" }}>
                <Icon name="check-circle" size={17} style={{ marginTop: 1, flexShrink: 0, color: "var(--gold-300)" }} />
                <span style={{ color: "rgba(255,255,255,0.92)", lineHeight: 1.45 }}>{f}</span>
              </li>
            ))}
          </ul>
          <JoinCta className="btn btn-accent btn-lg btn-full" position="pricing">
            Get Early Access
          </JoinCta>
          <div style={{ marginTop: 14, textAlign: "center", fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.72)" }}>
            First task free · No card required to join
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing CTA */

function GulfClosing() {
  const ref = useRef<HTMLElement>(null);

  // Scroll-depth read: fire once when the closing section (which carries the
  // two-country framing) enters view, so its pull can be separated from its
  // CTA-click share.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          logEvent("scroll_closing", { market: "gulf" });
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-screen-label="Gulf closing"
      style={{ padding: "72px var(--gutter)", background: "var(--forest-800)" }}
    >
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            lineHeight: "var(--leading-tight)",
            color: "#fff",
            fontWeight: 500,
            margin: "0 0 20px",
          }}
        >
          Your family lives in two countries. Your help should too.
        </h2>
        <JoinCta className="btn btn-accent btn-lg" position="closing">
          Get Early Access
        </JoinCta>
        <div style={{ marginTop: 14, fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>
          First task free. No card required.
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ export */

/** The /gulf dual-sided page. Dead end by design — the nav wordmark points to
 *  /gulf, and there is no cross-sell back to the India page. */
export function GulfPage() {
  return (
    <>
      <Nav cta="Get Early Access" homeHref="/gulf" ctaPosition="nav" />
      <main>
        <GulfHero />
        <GulfHowItWorks />
        <GulfHousehold />
        <GulfHandles />
        <GulfFamilies />
        <GulfTrust />
        <GulfPricing />
        <GulfClosing />
        <Faq items={GULF_FAQ} heading="Before you join" />
      </main>
      <StickyCta label="Get Early Access" />
    </>
  );
}
