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
import { GULF_TESTIMONIALS, GULF_FAQ, GULF_PLANS } from "@/lib/content";

/* ------------------------------------------------------------ shared style */

const sectionPad = "56px var(--gutter)";
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
      style={{ padding: "32px var(--gutter) 44px", position: "relative", overflow: "hidden" }}
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
            Your Gulf life doesn&rsquo;t come with a family support system. Niro does.
          </h1>
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-body)",
              color: "var(--text-body)",
              maxWidth: 520,
              margin: "0 0 24px",
            }}
          >
            A dedicated human who handles the things between work, school and home &mdash; and
            takes care of your family in India too.
          </p>
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
            <span>Human help</span>
            <span aria-hidden="true">·</span>
            <span>One dedicated contact</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp-first</span>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          <ChatVideo
            src="/media/gulf-hero.mp4"
            poster="/media/gulf-hero-poster.jpg"
            aspect="1080 / 1920"
            ariaLabel="A WhatsApp conversation showing Niro handling real family requests in the Gulf and in India"
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
          maxWidth: 500,
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

function GulfHowItWorks() {
  const asks = [
    "Our cleaner is leaving next week. Can you help?",
    "Can you find a maths tutor for my daughter?",
    "Emirates IDs expire in three weeks. Can you sort the renewals?",
    "Dad needs a hospital appointment in Bangalore on Friday.",
  ];
  return (
    <section data-screen-label="Gulf how it works" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>How it works</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 26px" }}>One message instead of five phone calls.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 26 }}>
          {asks.map((a) => (
            <AskBubble key={a}>{a}</AskBubble>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-md)",
            fontWeight: 600,
            color: "var(--text-strong)",
          }}
        >
          <span>You ask</span>
          <Icon name="arrow-right" size={18} style={{ color: "var(--brand)" }} />
          <span>Niro handles it</span>
          <Icon name="arrow-right" size={18} style={{ color: "var(--brand)" }} />
          <span>You get an update</span>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- what Niro handles */

type HandleCard = { icon: IconName; title: string; items: string; crossBorder?: boolean };

const HANDLES: HandleCard[] = [
  { icon: "home", title: "Your Gulf household", items: "Domestic help · School · Tutors · Home maintenance" },
  { icon: "star", title: "Kids & family", items: "Summer camps · Activities · Transport · Appointments" },
  { icon: "heart-pulse", title: "Your family in India", items: "Parents · Hospitals · Repairs · Paperwork" },
  {
    icon: "arrow-up-right",
    title: "Across borders",
    items: "Document attestation · Visas · Certificates · Property",
    crossBorder: true,
  },
];

function HandleCardView({ card }: { card: HandleCard }) {
  const cross = card.crossBorder;
  return (
    <div
      style={{
        background: cross ? "var(--gold-50, #FBF6EA)" : "var(--surface-card)",
        border: cross ? "1.5px solid var(--gold-300)" : "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-5)",
        boxShadow: cross ? "var(--shadow-2)" : "var(--shadow-1)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span
        style={{
          width: 46,
          height: 46,
          flexShrink: 0,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: cross ? "var(--gold-300)" : "var(--brand-soft)",
          color: cross ? "var(--forest-900)" : "var(--brand)",
        }}
      >
        <Icon name={card.icon} size={22} />
      </span>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wide)",
            color: "var(--text-strong)",
            marginBottom: 5,
          }}
        >
          {card.title}
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.4 }}>
          {card.items}
        </div>
      </div>
    </div>
  );
}

function GulfHandles() {
  return (
    <section data-screen-label="Gulf handles" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 26px" }}>The person you call when something needs doing.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
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
            marginTop: 24,
            fontSize: "var(--text-lg)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--text-strong)",
          }}
        >
          If it needs a person to sort out, ask Niro.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------- cross-border + parents */

function StepFlow({ label, steps }: { label: string; steps: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 10px" }}>
      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wide)",
          color: "var(--accent-strong)",
          minWidth: 44,
        }}
      >
        {label}
      </span>
      {steps.map((s, i) => (
        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "8px 10px" }}>
          <span
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              padding: "6px 12px",
              fontSize: "var(--text-sm)",
              color: "var(--text-strong)",
              fontWeight: 500,
            }}
          >
            {s}
          </span>
          {i < steps.length - 1 && <Icon name="arrow-right" size={15} style={{ color: "var(--brand)" }} />}
        </span>
      ))}
    </div>
  );
}

function GulfCrossBorder() {
  return (
    <section data-screen-label="Gulf cross-border" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>The cross-border difference</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>And when something needs to happen in India&hellip;</h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 24px" }}>
          Your same Niro team can handle it.
        </p>

        <div
          style={{
            background: "var(--surface-card)",
            border: "1.5px solid var(--gold-300)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-5)",
            boxShadow: "var(--shadow-2)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text-strong)",
              marginBottom: 18,
            }}
          >
            Need your marriage certificate attested for the UAE?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <StepFlow label="India" steps={["Collect original", "State attestation", "MEA"]} />
            <StepFlow label="UAE" steps={["Embassy", "MOFA"]} />
          </div>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--text-strong)",
            }}
          >
            One team coordinating both sides.
          </div>
        </div>

        {/* Compact parents callout — integrated here rather than a full section. */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 13,
            marginTop: 26,
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--brand-soft)",
              color: "var(--brand)",
            }}
          >
            <Icon name="message-circle" size={22} />
          </span>
          <div style={{ lineHeight: 1.5 }}>
            <div style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-strong)" }}>
              Your parents don&rsquo;t need an app.
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              They can message Niro or send a voice note in English, Hindi or Tamil.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- families */

function GulfFamilies() {
  // Two real, permission-cleared Dubai testimonials: one Gulf-led (Nikita —
  // cleaner + Emirates IDs), one India/cross-border-led (Abhishek — EPF + visit).
  const picks = ["Nikita, 38", "Abhishek, 43"];
  const stories = picks
    .map((n) => GULF_TESTIMONIALS.find((t) => t.name === n))
    .filter(Boolean) as typeof GULF_TESTIMONIALS;
  return (
    <section data-screen-label="Gulf families" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Real families</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 26px" }}>Already doing this for families like yours.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {stories.map((s) => (
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

/* -------------------------------------------------------------- trust strip */

function GulfTrustStrip() {
  const items = [
    "Human, not a chatbot",
    "Dedicated contact",
    "WhatsApp-first",
    "No passwords or OTPs",
    "Clear pricing",
  ];
  return (
    <section data-screen-label="Gulf trust strip" style={{ padding: "28px var(--gutter)" }}>
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 14px",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--text-muted)",
        }}
      >
        {items.map((it, i) => (
          <span key={it} style={{ display: "inline-flex", alignItems: "center", gap: "8px 14px" }}>
            <span style={{ color: "var(--text-body)" }}>{it}</span>
            {i < items.length - 1 && <span aria-hidden="true">·</span>}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- pricing */

function PlanCard({ plan }: { plan: (typeof GULF_PLANS)[number] }) {
  const dark = plan.highlight;
  return (
    <div
      style={{
        position: "relative",
        background: dark ? "var(--forest-700)" : "var(--surface-card)",
        color: dark ? "var(--ivory)" : "var(--text-body)",
        border: `1.5px solid ${dark ? "var(--forest-700)" : "var(--border)"}`,
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        boxShadow: dark ? "var(--shadow-brand)" : "var(--shadow-2)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wide)",
            color: dark ? "var(--gold-300)" : "var(--accent-strong)",
          }}
        >
          {plan.name}
        </span>
        {plan.badge && (
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wide)",
              background: "var(--gold-300)",
              color: "var(--forest-900)",
              borderRadius: "var(--radius-pill)",
              padding: "3px 10px",
            }}
          >
            {plan.badge}
          </span>
        )}
      </div>
      <div style={{ margin: "10px 0 2px", display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600, color: dark ? "#fff" : "var(--text-strong)" }}>
          {plan.price}
        </span>
        <span style={{ fontSize: "var(--text-sm)", color: dark ? "rgba(255,255,255,0.72)" : "var(--text-muted)" }}>/month</span>
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: dark ? "var(--gold-300)" : "var(--brand)", fontWeight: 500, marginBottom: 16 }}>
        {plan.tagline}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 9 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--text-sm)" }}>
            <Icon name="check-circle" size={16} style={{ marginTop: 1, flexShrink: 0, color: dark ? "var(--gold-300)" : "var(--brand)" }} />
            <span style={{ color: dark ? "rgba(255,255,255,0.92)" : "var(--text-body)", lineHeight: 1.4 }}>{f}</span>
          </li>
        ))}
      </ul>
      <div
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          color: dark ? "var(--gold-300)" : "var(--accent-strong)",
        }}
      >
        First task free · No card required
      </div>
    </div>
  );
}

function GulfPricing() {
  return (
    <section data-screen-label="Gulf pricing" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow style={{ justifyContent: "flex-start" }}>Pricing</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 26px" }}>One membership. Your whole family, both countries.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          {GULF_PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <JoinCta className="btn btn-primary btn-lg" position="pricing">
            Get Early Access
          </JoinCta>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing CTA */

function GulfClosing() {
  const ref = useRef<HTMLElement>(null);

  // Scroll-depth read: fire once when the closing section enters view.
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
          Your family is busy enough. Let someone else handle the chasing.
        </h2>
        <JoinCta className="btn btn-accent btn-lg" position="closing">
          Get Early Access
        </JoinCta>
        <div style={{ marginTop: 14, fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>
          First task free · No card required
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
        <GulfHandles />
        <GulfCrossBorder />
        <GulfFamilies />
        <GulfTrustStrip />
        <GulfPricing />
        <Faq items={GULF_FAQ} heading="Questions" />
        <GulfClosing />
      </main>
      <StickyCta label="Get Early Access" />
    </>
  );
}
