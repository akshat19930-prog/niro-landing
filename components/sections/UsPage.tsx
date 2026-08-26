"use client";

import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/ds/Nav";
import { JoinCta } from "@/components/ds/JoinCta";
import { AskNiroCta } from "@/components/ds/WhatsAppLink";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { StickyCta } from "@/components/sections/StickyCta";
import { Faq } from "@/components/sections/Faq";
import { logEvent } from "@/lib/track";
import { US_TESTIMONIALS, US_FAQ, US_PLANS, INDIA_SCOPE, US_SCOPE, VETTING } from "@/lib/content";

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
  us: { title: "Niro ↔ Arjun ↔ US", members: "Arjun, Meera, Niro" },
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
    ask: <>Need to set up quarterly blood tests for Ma from a reliable service.</>,
    reply: <>Set up with a NABL-accredited lab - home collection every quarter, reports shared here.</>,
  },
];

/**
 * India-first ordering: two India asks back to back before a US one appears, so
 * the India group is established as the point of the product rather than one of
 * two equal halves. Same five tasks, reordered and re-weighted 4:1.
 */
const HERO_TASKS_INDIA_FIRST: HeroTask[] = [
  HERO_TASKS[0], // Papa's cardiology follow-up
  HERO_TASKS[2], // Ma's pension life certificate
  HERO_TASKS[4], // Ma's quarterly blood tests
  HERO_TASKS[1], // the US dishwasher - the single add-on beat
  HERO_TASKS[3], // summer camp signups, still India-adjacent in framing
];

/** Multiplier on every hero-chat dwell time. 1.2 = 20% longer per screen. */
const PACE = 1.2;

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

function UsHeroChat({ tasks = HERO_TASKS }: { tasks?: HeroTask[] } = {}) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [showReply, setShowReply] = useState(false);
  const [op, setOp] = useState(0);
  const isSummary = step >= tasks.length;
  const task = isSummary ? null : tasks[step];

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
    // Every dwell time scales together, so the rhythm of the loop is unchanged
    // and only its pace slows. The CSS fade durations below are deliberately
    // NOT scaled - stretching the transitions as well would read as sluggish
    // rather than calm.
    const t = (ms: number) => Math.round(ms * PACE);
    if (isSummary) {
      timers.push(setTimeout(() => setOp(0), t(5200)));
      timers.push(setTimeout(() => setStep(0), t(5800)));
    } else {
      timers.push(setTimeout(() => setShowReply(true), t(1200)));
      timers.push(setTimeout(() => setOp(0), t(4100)));
      timers.push(setTimeout(() => setStep((s) => s + 1), t(4700)));
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
      aria-label="Two Niro WhatsApp groups for one family - an India group (Arjun, Ma, Papa, Niro) and a US group (Arjun, Meera, Niro) - cycling real requests: a cardiology follow-up for Papa, a leaking dishwasher, Ma's pension certificate, summer camp signups, and quarterly blood tests for Ma."
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

      <div style={{ flex: 1, minHeight: 356, display: "flex", flexDirection: "column", justifyContent: isSummary ? "center" : "flex-end", gap: 10, padding: "18px 14px" }}>
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

function UsHero({ indiaFirst = false }: { indiaFirst?: boolean }) {
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
          <Eyebrow>For Indian families in the US &amp; Canada</Eyebrow>
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
            The personal assistant you wish your whole family had.
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              lineHeight: 1.45,
              color: "var(--text-strong)",
              fontWeight: 500,
              maxWidth: 460,
              margin: "0 0 10px",
            }}
          >
            For your family in India and your life in the US or Canada.
          </p>
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-body)",
              color: "var(--text-body)",
              maxWidth: 460,
              margin: "0 0 12px",
            }}
          >
            Send Niro what needs doing. We&rsquo;ll research it, make the calls and get
            it sorted.
          </p>
          <div style={{ height: 24 }} />
          <JoinCta className="btn btn-primary btn-lg" position="hero">
            Get Early Access
          </JoinCta>
          {/* Close enough to the button to read as attached to it, far enough
              that the hierarchy is unambiguous. For the visitor who is
              interested but wants to ask about their own situation first. */}
          <AskNiroCta
            placement="hero"
            prompt="Got something specific in mind?"
            label="Ask Niro on WhatsApp"
            marginTop={14}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px 14px",
              marginTop: 14,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
            }}
          >
            <span>Remote Human Concierge</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp-first</span>
            <span aria-hidden="true">·</span>
            <span>Serving USA &amp; Canada families</span>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          <UsHeroChat tasks={indiaFirst ? HERO_TASKS_INDIA_FIRST : HERO_TASKS} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- how it works */

function UsHowItWorks() {
  const thread: { from: "you" | "niro"; sender?: string; text: React.ReactNode }[] = [
    { from: "you", sender: "Arjun", text: <>Ma&rsquo;s prescription needs renewing and picking up in Bangalore.</> },
    { from: "niro", text: <>On it - we&rsquo;ll coordinate with her doctor and the pharmacy, and keep you posted here.</> },
    { from: "you", sender: "Meera", text: <>Our AC here has stopped working. Can you find someone for Friday?</> },
    { from: "niro", text: <>Yes - we&rsquo;ll get quotes, book the visit and follow up until it&rsquo;s sorted.</> },
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
          India or here. <span style={{ color: "var(--brand)" }}>You don&rsquo;t have to chase either.</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- what you get back */

function UsTimeBack() {
  const gotBack = [
    { label: "Your lunch break", line: "Not spent calling insurance or service providers." },
    { label: "Your evenings", line: "Not spent comparing quotes or chasing appointments." },
    { label: "Your weekends", line: "Not spent on forms, registrations and things you\u2019ve been putting off." },
    { label: "Your headspace", line: "Not constantly split between life here and family back home." },
  ];
  return (
    <section data-screen-label="US time back" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>What you get back</Eyebrow>
        <h2 style={{ ...h2Style, margin: "12px 0 26px" }}>Get your time back. And some headspace too.</h2>
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

/* ============================================================ CORE POSITIONING
   "Life here. Family in India. One Niro." - moved up to sit directly after
   how-it-works, and rebuilt as two EQUAL sides joined by a single Niro node.
   Previously the US column was gold-flagged as an "add-on", which made the page
   read as "Niro India, plus some errands". Equal visual weight plus one shared
   connector is what makes the dual proposition read as the core product. */

type SideItem = { icon: IconName; label: string };
type SideDef = { eyebrow: string; items: SideItem[] };

/** Both columns carry the same weight and the same shape - a distinct icon per
 *  capability rather than a repeated tick, so the two sides read as one
 *  service with two surfaces instead of a headline plus a footnote. */
const SIDES: SideDef[] = [
  {
    eyebrow: "Your family in India",
    items: [
      { icon: "heart-pulse", label: "Parents' health admin & appointments" },
      { icon: "shield-check", label: "Emergency response" },
      { icon: "users", label: "Domestic staff management" },
      { icon: "wrench", label: "Household admin & repairs" },
      { icon: "map-pin", label: "Property management" },
      { icon: "wallet", label: "EPFO, banking & paperwork" },
      { icon: "plane", label: "Travel planning & visa" },
    ],
  },
  {
    eyebrow: "Your life in the US or Canada",
    items: [
      { icon: "car", label: "Vehicle" },
      { icon: "wrench", label: "Household admin & repairs" },
      { icon: "calendar", label: "Restaurant & events bookings" },
      { icon: "heart-pulse", label: "Health & insurance admin" },
      { icon: "graduation-cap", label: "Kids logistics & school" },
      { icon: "file-text", label: "Immigration & paperwork support" },
    ],
  },
];

/** `muted` is the add-on treatment: no card, no shadow, quieter heading. The
 *  point is that the two sides should not read as equals. */
function SideCard({ side, muted = false }: { side: SideDef; muted?: boolean }) {
  return (
    <div
      style={{
        background: muted ? "transparent" : "var(--surface-card)",
        border: muted ? "1px solid var(--border)" : "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-5)",
        boxShadow: muted ? "none" : "var(--shadow-2)",
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wide)",
          color: muted ? "var(--text-muted)" : "var(--brand)",
          marginBottom: 12,
        }}
      >
        {side.eyebrow}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
        {side.items.map((i) => (
          <li key={i.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "var(--text-md)" }}>
            <span
              aria-hidden="true"
              style={{
                width: 28,
                height: 28,
                flexShrink: 0,
                borderRadius: 8,
                background: "var(--brand-soft)",
                color: "var(--brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={i.icon} size={16} />
            </span>
            <span style={{ color: "var(--text-body)", lineHeight: 1.4, paddingTop: 4 }}>{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The connector between the two sides: one Niro mark. A vertical column on
 *  desktop, a horizontal divider on mobile, so "one team between two sides"
 *  survives the stack without becoming a literal diagram. */
function NiroNode() {
  return (
    <div className="us-node" aria-hidden="true">
      <span className="us-node-rule" />
      <span className="us-node-mark">
        <Icon name="user-check" size={20} />
      </span>
      <span className="us-node-rule" />
    </div>
  );
}

/**
 * The full India scope, promoted out of the FAQ and onto the page.
 *
 * "What can Niro handle in India?" is the most-opened question on this page and
 * it outdraws the US-side equivalent 2:1 - on a page that leads with both sides
 * equally. Burying the answer in an accordion was costing us the thing visitors
 * most want to read.
 */
function UsIndiaScope() {
  return (
    <section data-screen-label="US india scope" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles back home</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>Everything your parents need, handled.</h2>
        <p
          style={{
            fontSize: "var(--text-md)",
            color: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            margin: "0 0 26px",
            maxWidth: 640,
          }}
        >
          Not a shortlist. This is the actual scope your family manager covers in
          India, from a routine appointment to the call you dread getting.
        </p>
        <ScopeList groups={INDIA_SCOPE} icons={INDIA_SCOPE_ICONS} />
        <AskNiroCta
          placement="capabilities"
          prompt="Need something that isn&rsquo;t on the list?"
          label="Tell us what you need"
          marginTop={22}
        />
      </div>
    </section>
  );
}

/** `indiaFirst` demotes the US column from an equal partner to the add-on it
 *  was originally briefed as. The equal-sides treatment was a deliberate answer
 *  to the repositioning brief; the engagement data says it was the wrong call. */
function UsPositioning({ indiaFirst = false }: { indiaFirst?: boolean }) {
  return (
    <section data-screen-label="US positioning" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>{indiaFirst ? "And your side of the world" : "One Niro"}</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>
          {indiaFirst ? "Family in India. Life here. One Niro." : "Life here. Family in India. One Niro."}
        </h2>
        <p
          style={{
            fontSize: "var(--text-md)",
            color: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            margin: "0 0 26px",
            maxWidth: 620,
          }}
        >
          {indiaFirst
            ? "The same team that looks after your parents can take the household admin off your plate here too - on Niro Prime Global."
            : "One team handling what needs doing on both sides of your life."}
        </p>

        {indiaFirst ? (
          <div className="us-sides-lead">
            <SideCard side={SIDES[0]} />
            <SideCard side={SIDES[1]} muted />
          </div>
        ) : (
          <div className="us-sides">
            <SideCard side={SIDES[0]} />
            <NiroNode />
            <SideCard side={SIDES[1]} />
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: 30,
            marginBottom: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            color: "var(--text-strong)",
          }}
        >
          Research it. Make the calls. Get it done.
        </p>

        {/* In india-first the same invitation already sits under the India
            scope section above, so repeating it here would be the fourth
            WhatsApp CTA in three screens. */}
        {!indiaFirst && (
          <AskNiroCta
            placement="capabilities"
            prompt="Not sure if Niro can handle something?"
            label="Tell us what you need"
            align="center"
            marginTop={14}
          />
        )}
      </div>
    </section>
  );
}

/* ==================================================== when India needs you */

function UsIndiaDepth() {
  const cases = [
    "Parents' health & appointments",
    "EPFO, pension & banking",
    "Property & tenant management",
    "Home repairs & vendor coordination",
  ];
  return (
    <section data-screen-label="US india depth" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>When family needs you in India</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>
          Some things can&rsquo;t wait until your next call home.
        </h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: "var(--leading-body)", margin: "0 0 24px" }}>
          When your parents need something handled, Niro coordinates on the ground -
          appointments, paperwork, repairs and the things that are hard to manage from
          thousands of miles away.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
            gap: "12px 24px",
          }}
        >
          {cases.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <Icon name="check-circle" size={18} style={{ marginTop: 2, flexShrink: 0, color: "var(--brand)" }} />
              <span style={{ fontSize: "var(--text-md)", color: "var(--text-strong)", lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* The parents-don't-need-an-app insight, given real weight rather than
            sitting as a footnote: it is why the India side actually works. */}
        <div
          style={{
            marginTop: 28,
            padding: "22px 24px",
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--brand)",
            boxShadow: "var(--shadow-2)",
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <span
            style={{
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--brand)",
              color: "#fff",
            }}
          >
            <Icon name="message-circle" size={24} />
          </span>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                color: "var(--text-strong)",
                lineHeight: 1.3,
                marginBottom: 6,
              }}
            >
              Your parents don&rsquo;t need another app to figure out.
            </div>
            <div style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.5 }}>
              They can simply message Niro or send a voice note - in English, Hindi or Tamil.
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

function UsPricing({ indiaFirst = false }: { indiaFirst?: boolean }) {
  return (
    <section id="pricing-fold" data-screen-label="US pricing" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow style={{ justifyContent: "center" }}>Pricing</Eyebrow>
        <h2 style={{ ...h2Style, textAlign: "center", margin: "14px 0 8px" }}>Start with family. Add life here when you need it.</h2>
        <p style={{ textAlign: "center", fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 28px" }}>
          First task free. No card required to join.
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
            // india-first flips which SKU is the visual default. Shipping the
            // $169 dual plan as the dark, badged card made it the recommended
            // option on a page that is meant to lead with India at $99 - and it
            // is the likeliest reason "what's the difference between the two
            // memberships?" is the second-most-opened question here.
            const dark = indiaFirst ? p.id === "prime" : p.highlight;
            // The India plan carries no badge of its own, so give it one when it
            // becomes the default - an unbadged dark card next to a badged light
            // one reads as ambiguous rather than recommended.
            const badge = indiaFirst && p.id === "prime" ? "Start here" : p.badge;
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
                  {badge && (
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
                      {badge}
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
            Cancel anytime · No payment to join the list
          </div>
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
          Your family back home. Your life here. One less thing to manage.
        </p>
        <JoinCta className="btn btn-accent btn-lg" position="closing">
          Get Early Access
        </JoinCta>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- scope lists */

const INDIA_SCOPE_ICONS: IconName[] = ["heart-pulse", "home", "plane", "wallet", "shield-check"];
/** Same icons, same order as the "Your life in the US or Canada" column above,
 *  so the FAQ answer is legibly a double-click on that list. */
const US_SCOPE_ICONS: IconName[] = ["car", "wrench", "calendar", "heart-pulse", "graduation-cap", "file-text"];

/** A full capability list, inside a FAQ answer. Column-flowed rather than a
 *  grid of equal boxes: the groups are very different lengths, and masonry-ish
 *  flow keeps it compact instead of leaving ragged gaps. */
function ScopeList({
  groups,
  icons,
}: {
  groups: { title: string; items: string[]; note?: string }[];
  icons: IconName[];
}) {
  return (
    <div className="us-scope">
      {groups.map((group, gi) => (
        <div key={group.title} className="us-scope-group">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <span
              aria-hidden="true"
              style={{
                width: 26,
                height: 26,
                flexShrink: 0,
                borderRadius: 7,
                background: "var(--brand-soft)",
                color: "var(--brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={icons[gi]} size={15} />
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wide)",
                color: "var(--brand)",
              }}
            >
              {group.title}
            </span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
            {group.items.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Icon
                  name="check"
                  size={14}
                  style={{ marginTop: 4, flexShrink: 0, color: "var(--accent-strong)" }}
                />
                <span style={{ color: "var(--text-body)", lineHeight: 1.45 }}>{item}</span>
              </li>
            ))}
          </ul>
          {group.note && (
            <div
              style={{
                marginTop: 9,
                paddingLeft: 22,
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {group.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Vetting() {
  return (
    <div>
      <p style={{ margin: "0 0 16px", color: "var(--text-strong)", fontWeight: 500 }}>{VETTING.lead}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {VETTING.points.map((p) => (
          <div key={p.title} style={{ borderLeft: "2px solid var(--brand-soft)", paddingLeft: 14 }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", marginBottom: 3 }}>{p.title}</div>
            <div style={{ lineHeight: 1.6 }}>{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** US_FAQ with the two long answers swapped for rendered versions. Kept here
 *  rather than in content.ts because that file is plain data, no JSX. */
const US_FAQ_ITEMS = US_FAQ.map((f) => {
  if (f.q === "What can Niro handle in India?")
    return { ...f, a: <ScopeList groups={INDIA_SCOPE} icons={INDIA_SCOPE_ICONS} />, wide: true };
  if (f.q.startsWith("And what can Niro handle"))
    return { ...f, a: <ScopeList groups={US_SCOPE} icons={US_SCOPE_ICONS} />, wide: true };
  if (f.q.startsWith("What is the process for vetting")) return { ...f, a: <Vetting /> };
  return f;
});

/** India-first moves the India scope onto the page, so the FAQ drops that
 *  question entirely rather than repeating 23 line items a screen later. */
const US_FAQ_ITEMS_INDIA_FIRST = US_FAQ_ITEMS.filter(
  (f) => f.q !== "What can Niro handle in India?"
);

/* -------------------------------------------------------------------- page */

export function UsPage({ indiaFirst = false }: { indiaFirst?: boolean } = {}) {
  return (
    <>
      <Nav cta="Get Early Access" homeHref={indiaFirst ? "/us-v2" : "/us"} ctaPosition="nav" />
      <main>
        <UsHero indiaFirst={indiaFirst} />
        <UsHowItWorks />
        {/* India-first puts the scope and the urgency together, high, and
            demotes the two-equal-sides block to an add-on beat after them. */}
        {indiaFirst ? (
          <>
            <UsIndiaScope />
            <UsIndiaDepth />
            <UsPositioning indiaFirst />
            <UsTimeBack />
          </>
        ) : (
          <>
            <UsPositioning />
            <UsTimeBack />
            <UsIndiaDepth />
          </>
        )}
        <UsFamilies />
        <UsTrustStrip />
        <UsPricing indiaFirst={indiaFirst} />
        <Faq
          items={indiaFirst ? US_FAQ_ITEMS_INDIA_FIRST : US_FAQ_ITEMS}
          heading="Questions"
          showAsk={false}
        />
        <UsClosing />
      </main>
      <StickyCta label="Get Early Access" />
    </>
  );
}
