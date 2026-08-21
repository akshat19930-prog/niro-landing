"use client";

import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/ds/Nav";
import { JoinCta } from "@/components/ds/JoinCta";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon, type IconName } from "@/components/ds/Icon";
import { StickyCta } from "@/components/sections/StickyCta";
import { Faq } from "@/components/sections/Faq";
import { logEvent } from "@/lib/track";
import { GULF_TESTIMONIALS, GULF_FAQ } from "@/lib/content";

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
              // This headline is longer than the previous one, so cap the size
              // below display-4xl: large enough to dominate the fold, small
              // enough to hold ~4 lines in the hero's half-width column on
              // desktop (keeping the CTA visible) and ~5 on mobile.
              fontSize: "clamp(1.95rem, 4.6vw, 2.6rem)",
              lineHeight: 1.12,
              letterSpacing: "var(--tracking-tight)",
              color: "var(--text-strong)",
              margin: "12px 0 16px",
              fontWeight: 500,
              textWrap: "balance",
            }}
          >
            Your dedicated house manager, handling the errands, appointments and paperwork.
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
            For life in the Gulf - and your family back in India.
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
            <span>Remote Human Concierge</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp-first</span>
            <span aria-hidden="true">·</span>
            <span>Serving UAE &amp; Qatar families</span>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          <GulfHeroChat />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- how it works */

function AskBubble({ children, sender }: { children: React.ReactNode; sender?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      {sender && (
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--accent-strong, #a65f28)",
            margin: "0 4px 3px 0",
          }}
        >
          {sender}
        </span>
      )}
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

/** A reply from Niro — left-aligned received-message bubble with a sender tag,
 *  so the exchange reads as a real WhatsApp thread, not a list of requests. */
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

/* ----------------------------------------------------- animated hero chat */

type ChatSide = "gulf" | "india";
type HeroChatTask = { side: ChatSide; sender: string; ask: React.ReactNode; reply: React.ReactNode };

// The two WhatsApp groups Niro runs for one family — same shape as the earlier
// hero video: a group name plus who's in it.
const GROUPS: Record<ChatSide, { title: string; members: string }> = {
  gulf: { title: "Niro ↔ Ankush ↔ Gulf", members: "Ankush, Rhea, Niro" },
  india: { title: "Niro ↔ Ankush ↔ India", members: "Ankush, Ma, Papa, Niro" },
};

// Higher-frequency, lived-in requests (not paperwork), alternating between the
// family's Gulf group and their India group so the dual-sided story is shown.
// Ankush opens the thread; Rhea (Gulf group) chimes in too.
const HERO_TASKS: HeroChatTask[] = [
  {
    side: "gulf",
    sender: "Ankush",
    ask: <>Plan a date night this Saturday - book Paradiso for 8pm 🍷</>,
    reply: <>Done. A table for two at Paradiso, Saturday 8pm - confirmation on its way.</>,
  },
  {
    side: "india",
    sender: "Ankush",
    ask: <>Plan Ma&rsquo;s visa appointment - and send someone to accompany her.</>,
    reply: <>Booked her appointment for next week, and arranged someone to go with her and handle the queue.</>,
  },
  {
    side: "gulf",
    sender: "Rhea",
    ask: <>The car&rsquo;s overdue a service - can you sort it?</>,
    reply: <>Booked for Tuesday, with pickup and drop from home. Nothing for you to do.</>,
  },
  {
    side: "india",
    sender: "Ankush",
    ask: <>We need to find a replacement maid for Ma &amp; Papa.</>,
    reply: <>On it - lining up background-checked options near them and sharing this week.</>,
  },
  {
    side: "gulf",
    sender: "Rhea",
    ask: <>We&rsquo;re thinking Malaysia next month with the kids.</>,
    reply: <>Shortlisted the best family BnBs in Langkawi - sending options with prices now.</>,
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

/** A compact stacked-chat row used on the closing summary frame. */
function MiniChat({ title, snippet }: { title: string; snippet: string }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--surface-card)", boxShadow: "var(--shadow-1)" }}>
      <div style={{ background: "var(--brand)", color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "5px 10px" }}>{title}</div>
      <div style={{ padding: "7px 10px", fontSize: "var(--text-xs)", color: "var(--text-body)", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "var(--brand)", display: "inline-flex", flexShrink: 0 }}>
          <Icon name="check-circle" size={13} />
        </span>
        {snippet}
      </div>
    </div>
  );
}

/** Closing frame: the two group chats stacked, then the two-homes-one-manager
 *  mark — carried over from the earlier hero video. */
function HeroSummary() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      <MiniChat title={GROUPS.gulf.title} snippet="Date night & car service - sorted" />
      <MiniChat title={GROUPS.india.title} snippet="Ma's visa & a new maid - sorted" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 6 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="home" size={20} />
          </span>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-strong)" }}>Gulf</span>
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
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-strong)" }}>India</span>
        </div>
      </div>
      <div style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 500, color: "var(--text-strong)", marginTop: 2 }}>
        Two homes. One manager.
      </div>
    </div>
  );
}

/**
 * Code-driven WhatsApp hero: one request on screen at a time, alternating
 * between the family's Gulf group and their India group, with slow cross-fades
 * so each task reads cleanly (no second task crowding in). Ankush opens the
 * thread. After the tasks, a closing frame stacks both group chats and the
 * two-homes-one-manager mark. Replaces the old baked MP4 so tasks, senders and
 * the India<->Gulf rhythm stay editable.
 */
function GulfHeroChat() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0); // 0..N-1 = tasks, N = closing summary
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
    const raf = requestAnimationFrame(() => setOp(1)); // fade the new frame in
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (isSummary) {
      timers.push(setTimeout(() => setOp(0), 5200));
      timers.push(setTimeout(() => setStep(0), 5800));
    } else {
      timers.push(setTimeout(() => setShowReply(true), 1200)); // Niro replies
      timers.push(setTimeout(() => setOp(0), 4100)); // fade out before switching
      timers.push(setTimeout(() => setStep((s) => s + 1), 4700));
    }
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [step, isSummary, reduced]);

  const ease = "var(--ease-calm, ease)";
  const headerTitle = isSummary ? "Niro" : GROUPS[task!.side].title;
  const headerSub = isSummary ? "Two homes · one manager" : GROUPS[task!.side].members;

  return (
    <div
      aria-label="Two Niro WhatsApp groups for one family - a Gulf group (Ankush, Rhea, Niro) and an India group (Ankush, Ma, Papa, Niro) - cycling real requests Niro handles: a date night, Ma's visa appointment, a car service, a replacement maid, a family trip - then a summary: two homes, one manager."
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

      <div style={{ flex: 1, minHeight: 276, display: "flex", flexDirection: "column", justifyContent: isSummary ? "center" : "flex-start", gap: 10, padding: "18px 14px" }}>
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
    </div>
  );
}

function GulfHowItWorks() {
  // A genuine exchange: problem → Niro takes ownership → next step, twice, so
  // the "someone else carries it" magic is shown, not asserted. Both a Gulf
  // household problem and an India problem, in one thread.
  const thread: { from: "you" | "niro"; text: React.ReactNode }[] = [
    { from: "you", text: <>Our cleaner just quit 😩 We need someone from next week.</> },
    { from: "niro", text: <>Got it - I&rsquo;ll line up a few background-checked options and share them here.</> },
    { from: "you", text: <>Also, Dad needs a hospital appointment in Bangalore on Friday.</> },
    { from: "niro", text: <>On it - I&rsquo;ll book it and arrange his cab, and keep you posted here.</> },
  ];
  return (
    <section data-screen-label="Gulf how it works" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>How it works</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 24px" }}>One message instead of five phone calls.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {thread.map((m, i) =>
            m.from === "you" ? <AskBubble key={i}>{m.text}</AskBubble> : <NiroBubble key={i}>{m.text}</NiroBubble>
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

/* ----------------------------------------------------------- time + payoff */

function GulfTimeBack() {
  const offList = [
    "No more spending your lunch break calling schools.",
    "No more evenings searching for tutors.",
    "No more weekends chasing paperwork.",
    "No more coordinating something in India from the Gulf.",
  ];
  return (
    <section data-screen-label="Gulf time back" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <h2 style={{ ...h2Style, margin: "0 0 22px" }}>
          The point isn&rsquo;t getting things done. It&rsquo;s getting your time back.
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          {offList.map((t) => (
            <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Icon name="x" size={15} />
              </span>
              <span style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.45 }}>{t}</span>
            </li>
          ))}
        </ul>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            lineHeight: 1.35,
            color: "var(--text-strong)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Niro handles the chasing. <span style={{ color: "var(--brand)" }}>You get the time back.</span>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- what Niro handles */

type HandleCard = { icon: IconName; title: string; items: string; highlight?: boolean };

const HANDLES: HandleCard[] = [
  { icon: "home", title: "Your Gulf household", items: "Domestic help · Repairs · Maintenance · Household admin" },
  { icon: "star", title: "Kids & family", items: "Tutors · Camps · Activities · Appointments" },
  { icon: "heart-pulse", title: "Your family in India", items: "Parents · Hospitals · Repairs · Paperwork" },
  {
    icon: "map-pin",
    title: "Travel, Local experiences & Gifting",
    items: "Trips & itineraries · Restaurants & staycations · Gifts & occasions · Bookings",
    highlight: true,
  },
];

function HandleCardView({ card }: { card: HandleCard }) {
  const cross = card.highlight;
  return (
    <div
      style={{
        background: cross ? "var(--gold-50, #FBF6EA)" : "var(--surface-card)",
        border: cross ? "1.5px solid var(--gold-300)" : "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4)",
        boxShadow: cross ? "var(--shadow-2)" : "var(--shadow-1)",
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
    <section data-screen-label="Gulf handles" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 22px" }}>The person you call when something needs doing.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 12,
          }}
        >
          {HANDLES.map((c) => (
            <HandleCardView key={c.title} card={c} />
          ))}
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: "var(--text-lg)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--text-strong)",
          }}
        >
          From planning &amp; research, to booking &amp; execution.
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
    <section data-screen-label="Gulf cross-border" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        <Eyebrow>The cross-border difference</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>And when something needs to happen in India&hellip;</h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 22px" }}>
          Your same Niro team can handle it - parents&rsquo; appointments, EPFO and bank
          admin, repairs, or a document that has to move between both countries.
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
            marginTop: 22,
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

/** Render a real quote with its outcome phrase emphasised. The highlight must
 *  be a verbatim substring of the quote — we only add visual weight, never
 *  words. Falls back to the plain quote if it isn't found. */
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

function GulfFamilies() {
  // Two real, permission-cleared Dubai testimonials: one Gulf-led (Nikita —
  // cleaner + Emirates IDs), one India/cross-border-led (Abhishek — EPF + visit).
  const picks = ["Nikita, 38", "Abhishek, 43"];
  const stories = picks
    .map((n) => GULF_TESTIMONIALS.find((t) => t.name === n))
    .filter(Boolean) as typeof GULF_TESTIMONIALS;
  return (
    <section data-screen-label="Gulf families" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
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
                &ldquo;{renderQuote(s.quote, s.highlight)}&rdquo;
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
    <section data-screen-label="Gulf trust strip" style={{ padding: "16px var(--gutter)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px 12px",
          fontSize: "var(--text-xs)",
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

function GulfPricing() {
  const features = [
    "Unlimited tasks, both countries",
    "Two WhatsApp groups - one for India, one for home here",
    "Your parents just WhatsApp. Nothing to install, nothing to learn.",
    "Emergency response for your parents in India - ambulance partner plus our own person at the hospital",
    "₹20 lakh cyber-fraud cover for your parents in India, plus monitoring",
    "A named contact who knows your family",
  ];
  return (
    <section id="pricing-fold" data-screen-label="Gulf pricing" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
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
            The one house manager that works in both places your family lives - so you
            get hours of your week back.
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
          Let Niro take it from here.
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
        <GulfTimeBack />
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
