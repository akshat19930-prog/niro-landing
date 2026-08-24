"use client";

import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/ds/Nav";
import { JoinCta } from "@/components/ds/JoinCta";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { StickyCta } from "@/components/sections/StickyCta";
import { Faq } from "@/components/sections/Faq";
import { logEvent } from "@/lib/track";
import { US_TESTIMONIALS, US_FAQ, US_PLANS } from "@/lib/content";

/* ------------------------------------------------------------ shared style */

const sectionPad = "48px var(--gutter)";
const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-3xl)",
  lineHeight: "var(--leading-tight)",
  letterSpacing: "var(--tracking-tight)",
  color: "var(--text-strong)",
  fontWeight: 500,
  margin: 0,
} as const;

/* -------------------------------------------------------------- chat pieces */

/** Group message: left-aligned with the sender's name, like WhatsApp. */
function AskBubble({ children, sender }: { children: React.ReactNode; sender?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "var(--brand-soft)",
          color: "var(--text-strong)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          borderTopLeftRadius: 5,
          padding: "10px 16px 12px",
          maxWidth: 500,
          fontSize: "var(--text-base)",
          lineHeight: 1.45,
          boxShadow: "var(--shadow-1)",
        }}
      >
        {sender && (
          <span
            style={{
              display: "block",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--accent-strong, #a65f28)",
              marginBottom: 3,
            }}
          >
            {sender}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

function NiroBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "var(--surface-card)",
          color: "var(--text-body)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          borderTopLeftRadius: 5,
          padding: "10px 16px 12px",
          maxWidth: 500,
          fontSize: "var(--text-base)",
          lineHeight: 1.45,
          boxShadow: "var(--shadow-1)",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--brand)",
            marginBottom: 3,
          }}
        >
          Niro
        </span>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- animated hero chat */

type ChatSide = "india" | "us";
type HeroTask = { side: ChatSide; sender: string; ask: React.ReactNode; reply: React.ReactNode };

const GROUPS: Record<ChatSide, { title: string; members: string }> = {
  india: { title: "Niro ↔ Arjun ↔ India", members: "Arjun, Ma, Papa, Niro" },
  us: { title: "Niro ↔ Arjun ↔ Home", members: "Arjun, Meera, Niro" },
};

/** India leads - it is the reason people sign up. The US-side asks appear as
 *  the bonus, never the headline. Ratio is deliberately 3:2 India:US. */
const HERO_TASKS: HeroTask[] = [
  {
    side: "india",
    sender: "Arjun",
    ask: <>Papa has a cardiology follow-up this week - can you sort it?</>,
    reply: <>Booked for Thursday 11:30. Someone will accompany him and share the prescription here after.</>,
  },
  {
    side: "us",
    sender: "Meera",
    ask: <>The dishwasher is leaking again. Can you find someone?</>,
    reply: <>Three quotes in, best-rated one can come Saturday 9am. Shall I confirm?</>,
  },
  {
    side: "india",
    sender: "Arjun",
    ask: <>Ma&rsquo;s pension life certificate is due this month.</>,
    reply: <>Handled - our person is going to the bank with her on Tuesday. Nothing for you to chase.</>,
  },
  {
    side: "us",
    sender: "Arjun",
    ask: <>Summer camp signups open tomorrow and I&rsquo;ll be in meetings all day 😩</>,
    reply: <>I&rsquo;ll be on it at 9am sharp - both kids, first-choice sessions. Will confirm once registered.</>,
  },
  {
    side: "india",
    sender: "Arjun",
    ask: <>Can someone check on Ma this week? She&rsquo;s been low.</>,
    reply: <>Visiting Thursday with her health check, and I&rsquo;ll call you right after.</>,
  },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener?.("change", apply);
    return () => m.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}

function ChatListRow({ title, preview, time, unread }: { title: string; preview: string; time: string; unread?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px" }}>
      <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name="message-circle" size={20} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
          <span style={{ fontSize: 10.5, color: "var(--brand)", flexShrink: 0 }}>{time}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview}</span>
          {unread && (
            <span style={{ background: "var(--brand)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", flexShrink: 0 }}>
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroSummary() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-1)" }}>
        <ChatListRow title={GROUPS.india.title} preview="Niro: Ma's pension certificate - done" time="now" unread="2" />
        <div aria-hidden="true" style={{ height: 1, background: "var(--border)", marginLeft: 55 }} />
        <ChatListRow title={GROUPS.us.title} preview="Niro: Plumber confirmed, Saturday 9am" time="now" unread="1" />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 6 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="heart-pulse" size={20} />
          </span>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-strong)" }}>India</span>
        </div>
        <span aria-hidden="true" style={{ width: 22, height: 1.5, background: "var(--border-strong)", flexShrink: 0 }} />
        <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="user-check" size={22} />
        </span>
        <span aria-hidden="true" style={{ width: 22, height: 1.5, background: "var(--border-strong)", flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="home" size={20} />
          </span>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-strong)" }}>Here</span>
        </div>
      </div>
      <div style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 500, color: "var(--text-strong)", marginTop: 2 }}>
        One person. Both sides.
      </div>
    </div>
  );
}

function UsHeroChat() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [showReply, setShowReply] = useState(false);
  const [op, setOp] = useState(0);
  const isSummary = step >= HERO_TASKS.length;
  const task = isSummary ? null : HERO_TASKS[step];

  useEffect(() => {
    if (reduced) {
      setShowReply(true);
      setOp(1);
      return;
    }
    setShowReply(false);
    setOp(0);
    const raf = requestAnimationFrame(() => setOp(1));
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (isSummary) {
      timers.push(setTimeout(() => setOp(0), 5200));
      timers.push(setTimeout(() => setStep(0), 5800));
    } else {
      timers.push(setTimeout(() => setShowReply(true), 1200));
      timers.push(setTimeout(() => setOp(0), 4100));
      timers.push(setTimeout(() => setStep((s) => s + 1), 4700));
    }
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [step, isSummary, reduced]);

  const ease = "var(--ease-calm, ease)";
  const headerTitle = isSummary ? "Niro" : GROUPS[task!.side].title;
  const headerSub = isSummary ? "One person · both sides" : GROUPS[task!.side].members;

  return (
    <div
      aria-label="Two Niro WhatsApp groups for one family - an India group (Arjun, Ma, Papa, Niro) and a home group (Arjun, Meera, Niro) - cycling real requests: a cardiology follow-up for Papa, a leaking dishwasher, Ma's pension certificate, summer camp signups, and checking in on Ma."
      style={{
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-3)",
        border: "1px solid var(--border)",
        background: "var(--wa-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--brand)", color: "#fff" }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="message-circle" size={18} />
        </span>
        <div key={isSummary ? "sum" : task!.side} style={{ lineHeight: 1.3, transition: `opacity 500ms ${ease}` }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>{headerTitle}</div>
          <div style={{ fontSize: "var(--text-xs)", opacity: 0.85 }}>{headerSub}</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 276, display: "flex", flexDirection: "column", justifyContent: isSummary ? "center" : "flex-end", gap: 10, padding: "18px 14px" }}>
        <div
          style={{
            opacity: op,
            transform: op ? "translateY(0)" : "translateY(6px)",
            transition: `opacity 550ms ${ease}, transform 550ms ${ease}`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {isSummary ? (
            <HeroSummary />
          ) : (
            <>
              <AskBubble sender={task!.sender}>{task!.ask}</AskBubble>
              <div
                style={{
                  opacity: showReply ? 1 : 0,
                  transform: showReply ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 450ms ${ease}, transform 450ms ${ease}`,
                }}
              >
                <NiroBubble>{task!.reply}</NiroBubble>
              </div>
            </>
          )}
        </div>
      </div>

      {!isSummary && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "var(--wa-bg)", borderTop: "1px solid var(--border)" }}>
          <div
            style={{
              flex: 1,
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "8px 14px",
              color: "var(--text-muted)",
              fontSize: "var(--text-sm)",
            }}
          >
            Message
          </div>
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="mic" size={17} />
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- hero */

function UsHero() {
  return (
    <section
      data-screen-label="US hero"
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
          <Eyebrow>For Indian families in the US</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.95rem, 4.6vw, 2.6rem)",
              lineHeight: 1.12,
              letterSpacing: "var(--tracking-tight)",
              color: "var(--text-strong)",
              margin: "12px 0 16px",
              fontWeight: 500,
              textWrap: "balance",
            }}
          >
            Your parents in India, looked after. Your US household, handled too.
          </h1>
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-body)",
              color: "var(--text-body)",
              maxWidth: 460,
              margin: "0 0 12px",
            }}
          >
            One person for both sides of your family&rsquo;s life - on WhatsApp.
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              lineHeight: 1.4,
              color: "var(--text-strong)",
              fontWeight: 500,
              margin: "0 0 24px",
            }}
          >
            Less to chase. More time to live.
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
            <span>Real people, not AI</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp-first</span>
            <span aria-hidden="true">·</span>
            <span>No app for your parents</span>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          <UsHeroChat />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- how it works */

function UsHowItWorks() {
  const thread: { from: "you" | "niro"; sender?: string; text: React.ReactNode }[] = [
    { from: "you", sender: "Arjun", text: <>Ma&rsquo;s BP meds are running out and she keeps putting off the refill.</> },
    { from: "niro", text: <>I&rsquo;ll get her prescription renewed and a 3-month supply delivered this week. I&rsquo;ll confirm here once it&rsquo;s at her door.</> },
    { from: "you", sender: "Meera", text: <>Also - our car registration expires Friday and I completely forgot.</> },
    { from: "niro", text: <>On it. Renewing online now, and I&rsquo;ll flag if anything needs your signature. You won&rsquo;t miss the date.</> },
  ];
  return (
    <section data-screen-label="US how it works" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>How it works</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 24px" }}>One message instead of five phone calls.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {thread.map((m, i) =>
            m.from === "you" ? (
              <AskBubble key={i} sender={m.sender}>{m.text}</AskBubble>
            ) : (
              <NiroBubble key={i}>{m.text}</NiroBubble>
            )
          )}
        </div>
        <p
          style={{
            textAlign: "center",
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            color: "var(--text-strong)",
          }}
        >
          One message. Someone else handles the chasing.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- what you get back */

function UsTimeBack() {
  const gotBack = [
    { label: "Your lunch break", line: "Not spent on hold with an insurer." },
    { label: "Your evenings", line: "Not spent chasing repair quotes." },
    { label: "Your weekends", line: "Not spent on forms and registrations." },
    { label: "Your headspace", line: "Not spent worrying about your parents." },
  ];
  return (
    <section data-screen-label="US time back" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>What you get back</Eyebrow>
        <h2 style={{ ...h2Style, margin: "12px 0 26px" }}>Your time.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))",
            gap: "20px 32px",
          }}
        >
          {gotBack.map((b) => (
            <div key={b.label} style={{ borderTop: "2px solid var(--border-strong)", paddingTop: 12 }}>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wide)",
                  color: "var(--brand)",
                  marginBottom: 5,
                }}
              >
                {b.label}
              </div>
              <div style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.4 }}>{b.line}</div>
            </div>
          ))}
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            lineHeight: 1.3,
            color: "var(--text-strong)",
            fontWeight: 500,
            margin: "30px 0 0",
          }}
        >
          One message to Niro. <span style={{ color: "var(--brand)" }}>One less thing on your plate.</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- what Niro handles */

type HandleCard = { icon: IconName; title: string; items: string; highlight?: boolean };

/** India cards first and marked as the core - the US card is explicitly the
 *  add-on, matching the hero's India-first promise. */
const HANDLES: HandleCard[] = [
  { icon: "heart-pulse", title: "Your parents in India", items: "Health & appointments · Emergencies · Daily needs · Someone who shows up" },
  { icon: "file-text", title: "Your India paperwork", items: "EPF & pension · Banking · Property & tenants · Government work" },
  { icon: "home", title: "Your home here", items: "Repairs & vendors · DMV & registration · Warranties · Everyday admin", highlight: true },
  { icon: "star", title: "Your family here", items: "Camps & school forms · Activities · Appointments · Insurance chasing", highlight: true },
];

function HandleCardView({ card }: { card: HandleCard }) {
  const addOn = card.highlight;
  return (
    <div
      style={{
        background: addOn ? "var(--gold-50, #FBF6EA)" : "var(--surface-card)",
        border: addOn ? "1.5px solid var(--gold-300)" : "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4)",
        boxShadow: addOn ? "var(--shadow-2)" : "var(--shadow-1)",
        display: "flex",
        alignItems: "center",
        gap: 14,
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
          background: addOn ? "var(--gold-300)" : "var(--brand-soft)",
          color: addOn ? "var(--forest-900)" : "var(--brand)",
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

function labelStyle(color: string): React.CSSProperties {
  return {
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "var(--tracking-wide)",
    color: color,
    whiteSpace: "nowrap",
    alignSelf: "start",
    paddingTop: 2,
  };
}

function UsHandles() {
  return (
    <section data-screen-label="US handles" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 8px" }}>India first. Then everything here.</h2>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            color: "var(--brand)",
            margin: "0 0 22px",
          }}
        >
          Research it. Make the calls. Get it done.
        </p>
        <div className="gulf-handles-grid">
          {HANDLES.map((c) => (
            <HandleCardView key={c.title} card={c} />
          ))}
        </div>

        <div
          style={{
            marginTop: 16,
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--brand)",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-card)",
            padding: "16px 18px",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "8px 14px",
            alignItems: "baseline",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <span style={labelStyle("var(--text-muted)")}>You need</span>
          <span style={{ fontSize: "var(--text-md)", color: "var(--text-strong)", fontWeight: 500, lineHeight: 1.4 }}>
            A plumber, this week, who won&rsquo;t overcharge you.
          </span>
          <span style={labelStyle("var(--brand)")}>Niro</span>
          <span style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.5 }}>
            Sources options <span style={{ color: "var(--brand)" }}>→</span> gets three quotes{" "}
            <span style={{ color: "var(--brand)" }}>→</span> checks reviews{" "}
            <span style={{ color: "var(--brand)" }}>→</span> books the slot that suits you.
          </span>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: "var(--text-lg)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--text-strong)",
          }}
        >
          If you don&rsquo;t have time to deal with it, ask Niro.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------- the India differentiator */

function UsIndiaSide() {
  const bothSides = [
    "Parents health admin & Emergencies",
    "Home repairs, chores & Staff",
    "EPF, pension & banking recovery",
    "Property & tenant management",
  ];
  return (
    <section data-screen-label="US india side" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>Why families start with Niro</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>Life here. Family in India. One Niro.</h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: "var(--leading-body)", margin: "0 0 24px" }}>
          Anyone can book you a plumber. Almost nobody can be at your father&rsquo;s hospital
          appointment in Lucknow on a Tuesday morning. Niro does both - and starts with the
          one that matters most.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
            gap: "12px 24px",
          }}
        >
          {bothSides.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <Icon name="check-circle" size={18} style={{ marginTop: 2, flexShrink: 0, color: "var(--brand)" }} />
              <span style={{ fontSize: "var(--text-md)", color: "var(--text-strong)", lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 13,
            marginTop: 26,
            padding: "16px 18px",
            borderRadius: "var(--radius-lg)",
            background: "var(--brand-soft)",
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
              background: "var(--brand)",
              color: "#fff",
            }}
          >
            <Icon name="message-circle" size={22} />
          </span>
          <div style={{ lineHeight: 1.5 }}>
            <div style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-strong)" }}>
              Your parents don&rsquo;t need another app to figure out.
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
              They can simply WhatsApp Niro, send a voice note or call - in English or their local language.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- families */

function renderQuote(quote: string, highlight?: string): React.ReactNode {
  if (!highlight) return quote;
  const i = quote.indexOf(highlight);
  if (i === -1) return quote;
  return (
    <>
      {quote.slice(0, i)}
      <strong style={{ color: "var(--text-strong)", fontWeight: 600 }}>{highlight}</strong>
      {quote.slice(i + highlight.length)}
    </>
  );
}

function UsFamilies() {
  return (
    <section data-screen-label="US families" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Real families</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 22px" }}>Families already living this.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))",
            gap: 14,
          }}
        >
          {US_TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              style={{
                margin: 0,
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-4)",
                boxShadow: "var(--shadow-1)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <blockquote
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.55,
                  color: "var(--text-muted)",
                }}
              >
                &ldquo;{renderQuote(t.quote, t.highlight)}&rdquo;
              </blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
                {t.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.photo}
                    alt=""
                    width={38}
                    height={38}
                    style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                )}
                <span style={{ lineHeight: 1.35 }}>
                  <span style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-strong)" }}>
                    {t.name}
                  </span>
                  <span style={{ display: "block", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                    {t.location}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- trust strip */

function UsTrustStrip() {
  const items: { icon: IconName; text: string }[] = [
    { icon: "shield-check", text: "Named & background-checked people" },
    { icon: "lock", text: "No passwords or OTPs, ever" },
    { icon: "camera", text: "Every task closed with proof" },
    { icon: "user-check", text: "Built by NRIs who lived this" },
  ];
  return (
    <section
      data-screen-label="US trust strip"
      style={{ padding: "16px var(--gutter)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 26px",
        }}
      >
        {items.map((i) => (
          <span key={i.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
            <Icon name={i.icon} size={16} style={{ color: "var(--brand)", flexShrink: 0 }} />
            {i.text}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- pricing */

function UsPricing() {
  return (
    <section id="pricing-fold" data-screen-label="US pricing" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow style={{ justifyContent: "center" }}>Pricing</Eyebrow>
        <h2 style={{ ...h2Style, textAlign: "center", margin: "14px 0 8px" }}>Start with India. Add here when you need it.</h2>
        <p style={{ textAlign: "center", fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 28px" }}>
          First task free - no card to join.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          {US_PLANS.map((p) => {
            const dark = p.highlight;
            return (
              <div
                key={p.id}
                style={{
                  background: dark ? "var(--forest-700)" : "var(--surface-card)",
                  color: dark ? "var(--ivory)" : "var(--text-body)",
                  border: `1px solid ${dark ? "var(--forest-700)" : "var(--border)"}`,
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-5)",
                  boxShadow: dark ? "var(--shadow-brand)" : "var(--shadow-2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "var(--tracking-wide)",
                      color: dark ? "var(--gold-300)" : "var(--accent-strong)",
                    }}
                  >
                    {p.name}
                  </span>
                  {p.badge && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "var(--tracking-wide)",
                        padding: "3px 9px",
                        borderRadius: 999,
                        background: dark ? "var(--gold-300)" : "var(--brand-soft)",
                        color: dark ? "var(--forest-900)" : "var(--brand)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <div style={{ margin: "10px 0 4px", display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, color: dark ? "#fff" : "var(--text-strong)" }}>
                    {p.price}
                  </span>
                  <span style={{ fontSize: "var(--text-sm)", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
                    {p.per}
                  </span>
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: dark ? "var(--gold-300)" : "var(--brand)", fontWeight: 500, marginBottom: 12 }}>
                  {p.sub}
                </div>
                {p.lead && (
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)", marginBottom: 8 }}>
                    {p.lead}
                  </div>
                )}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: "var(--text-sm)" }}>
                      <Icon
                        name="check-circle"
                        size={16}
                        style={{ marginTop: 2, flexShrink: 0, color: dark ? "var(--gold-300)" : "var(--brand)" }}
                      />
                      <span style={{ color: dark ? "rgba(255,255,255,0.92)" : "var(--text-body)", lineHeight: 1.45 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 22, textAlign: "center" }}>
          <JoinCta className="btn btn-primary btn-lg" position="pricing">
            Get Early Access
          </JoinCta>
          <div style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            First task free · No card required to join
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing CTA */

function UsClosing() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            logEvent("scroll_closing", { market: "us_dual" });
            io.disconnect();
          }
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
      data-screen-label="US closing"
      style={{ padding: "64px var(--gutter)", background: "var(--forest-800)" }}
    >
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            lineHeight: "var(--leading-tight)",
            color: "#fff",
            fontWeight: 500,
            margin: "0 0 12px",
            textWrap: "balance",
          }}
        >
          Let Niro take it from here.
        </h2>
        <p style={{ fontSize: "var(--text-md)", color: "rgba(255,255,255,0.78)", margin: "0 0 24px", lineHeight: 1.6 }}>
          Join the families who stopped running two households from one calendar.
        </p>
        <JoinCta className="btn btn-accent btn-lg" position="closing">
          Get Early Access
        </JoinCta>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- page */

export function UsPage() {
  return (
    <>
      <Nav cta="Get Early Access" homeHref="/us" ctaPosition="nav" />
      <main>
        <UsHero />
        <UsHowItWorks />
        <UsTimeBack />
        <UsHandles />
        <UsIndiaSide />
        <UsFamilies />
        <UsTrustStrip />
        <UsPricing />
        <Faq items={US_FAQ} heading="Questions" />
        <UsClosing />
      </main>
      <StickyCta label="Get Early Access" />
    </>
  );
}
