"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/ds/Nav";
import { JoinCta } from "@/components/ds/JoinCta";
import { AskNiroCta } from "@/components/ds/WhatsAppLink";
import { Badge } from "@/components/ds/Badge";
import { Icon, type IconName } from "@/components/ds/Icon";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { AskStream } from "@/components/ds/AskStream";
import { VoiceStream } from "@/components/ds/VoiceStream";
import { ChatVideo } from "@/components/ds/ChatVideo";
import { StickyCta } from "@/components/sections/StickyCta";
import { Faq } from "@/components/sections/Faq";
import { PLANS, TESTIMONIALS_SHORT, COVERAGE_NOTE, GUARANTEE } from "@/lib/content";

/* ---------------------------------------------------------------- helpers */

type GeoRegion = "gulf" | "us" | "canada" | null;

/** Geo personalisation, inferred from the browser time zone — client-only,
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

function HeroB() {
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
            You can&rsquo;t always be in India. Niro can.
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
            Your family&rsquo;s personal assistant in India, getting things done for
            them and for you. Peace of mind for you, unmatched convenience for
            them - all delivered over WhatsApp.
          </p>
          <JoinCta className="btn btn-primary btn-lg">Get Early Access</JoinCta>
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
            <span>Remote Assistant</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp groups</span>
            <span aria-hidden="true">·</span>
            <span>Shows up in person when needed</span>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 360 }}>
          <ChatVideo />
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
function HowItWorksB() {
  const remoteVerbs = [
    "Research", "Find", "Book", "Order", "Arrange",
    "Plan end to end", "Coordinate with vendors",
  ];
  return (
    <section data-screen-label="How it works (B)" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>How it works</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>You ask. We do the running around.</h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", maxWidth: 560, margin: "0 0 26px" }}>
          One message is the whole of your job. Everything after it is ours.
        </p>

        <div className="beat">
          <div className="beat-label">
            <span className="beat-n">01</span>
            <span className="beat-t">You or your family asks</span>
          </div>
          <div>
            <AskStream />
          </div>
        </div>

        <div className="beat">
          <div className="beat-label">
            <span className="beat-n">02</span>
            <span className="beat-t">Your Niro Assistant takes it from there</span>
          </div>
          <div className="does-grid">
            <div className="does-card">
              <div className="does-head">
                <Icon name="message-circle" size={19} style={{ color: "var(--brand)" }} />
                <span className="does-title">Handled remotely</span>
              </div>
              <div className="does-sub">The calls, the portals, the chasing.</div>
              <div className="does-verbs">
                {remoteVerbs.map((r) => (
                  <span className="does-verb" key={r}>{r}</span>
                ))}
              </div>
            </div>
            <div className="does-card does-card-visit">
              <div className="does-head">
                <Icon name="map-pin" size={19} style={{ color: "var(--accent-strong)" }} />
                <span className="does-title">Niro Visits - booked on demand</span>
              </div>
              <div className="does-sub">When it needs a person in the room.</div>
              <ul className="does-visit-list">
                <li><Icon name="check" size={15} /><span>Home maintenance inspections</span></li>
                <li><Icon name="check" size={15} /><span>Accompanying your parents to appointments</span></li>
                <li><Icon name="check" size={15} /><span>Standing in the queue at the office, so they don&rsquo;t</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="beat">
          <div className="beat-label">
            <span className="beat-n">03</span>
            <span className="beat-t">It gets done - better and faster</span>
          </div>
          <div className="outcome">
            <div className="outcome-line">
              <Icon name="check-circle" size={20} />
              <span>
                <b>All tasks closed with proof</b> - photos, receipts and a written
                note in the group. You stop chasing, and you get your evenings back.
              </span>
            </div>
            <div className="outcome-line">
              <Icon name="check-circle" size={20} />
              <span>
                <b>Your parents ask freely</b> - because asking Niro doesn&rsquo;t
                mean worrying you. The small things they used to swallow finally
                get said, and handled.
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <AskNiroCta placement="how-it-works" prompt="Got something specific in mind?" label="Ask Niro on WhatsApp" />
        </div>
      </div>
    </section>
  );
}

/**
 * For your parents.
 *
 * The claim is not "we are kind to your parents" - anyone can say that. It is
 * that the things they quietly put up with, and never mention on a call, stop
 * being their problem: the haggling, the scam risk, the maid who vanished, the
 * grocery run on bad knees, the ten apps they were never going to learn.
 *
 * Six asks cycle three at a time so the breadth reads without a wall of text,
 * and the untranslated English ones sit alongside the Hindi ones because that
 * is how parents actually write.
 */
function ParentsB() {
  return (
    <section data-screen-label="Parents (B)" style={{ padding: sectionPad }}>
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
          <Eyebrow>For your parents in India</Eyebrow>
          <h2 style={{ ...h2Style, margin: "14px 0 16px" }}>
            The struggles they don&rsquo;t tell you about, quietly solved.
          </h2>
          <p style={{ fontSize: "var(--text-md)", lineHeight: "var(--leading-body)", color: "var(--text-body)", maxWidth: 520, margin: "0 0 14px" }}>
            The haggling with vendors. The fear of being scammed. The maid who
            stopped turning up. The grocery run on a bad knee. The ten apps they
            were never going to learn.
          </p>
          <p style={{ fontSize: "var(--text-md)", lineHeight: "var(--leading-body)", color: "var(--text-strong)", maxWidth: 520, margin: "0 0 18px", fontWeight: 500 }}>
            All of it solved with one WhatsApp message, or a voice note in the
            language they actually speak.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["WhatsApp", "Voice note", "A phone call", "English \u00b7 Hindi \u00b7 Tamil"].map((t) => (
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
  const cases: { icon: IconName; title: string; items: string }[] = [
    {
      icon: "heart-pulse",
      title: "Family's health admin & emergency response",
      items: "Check-ups · appointments · ambulance in minutes, with our Niro Assistant at the hospital",
    },
    {
      icon: "wrench",
      title: "Household chores, upkeep & staff",
      items: "Repairs · maintenance · verified domestic help and replacements",
    },
    {
      icon: "wallet",
      title: "Bills, banking & customer support issues",
      items: "Bills and property tax · dormant accounts · the wrong bill, argued down",
    },
    {
      icon: "file-text",
      title: "EPFO, tax, govt paperwork & documents",
      items: "Stuck EPFO claims · attestation · CGHS and pension · India ITR",
    },
    {
      icon: "home",
      title: "Property management & misc",
      items: "Tenants · rent follow-ups · the small things nobody else will chase",
    },
    {
      icon: "plane",
      title: "Travel concierge & admin",
      items: "Visa and passport appointments, accompanied · travel booked end to end",
    },
  ];
  return (
    <section data-screen-label="Use cases (B)" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>What Niro handles</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px" }}>Everything that makes you wish you were in India. And more.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {cases.map((c) => (
            <div
              key={c.title}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-5)",
                boxShadow: "var(--shadow-1)",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  marginBottom: 14,
                }}
              >
                <Icon name={c.icon} size={22} />
              </span>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-strong)", marginBottom: 4 }}>
                {c.title}
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {c.items}
              </div>
            </div>
          ))}
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
  // Lead with concrete outcomes. Gulf visitors see the Dubai routes first
  // (Abhishek Dubai→Gwalior, Nikita Dubai→Noida) for regional proof.
  const { region } = useGeo();
  const picks =
    region === "gulf"
      ? ["Abhishek, 43", "Nikita, 38", "Kartik, 34"]
      : ["Kartik, 34", "Abhishek, 43", "Vaibhav, 32"];
  const stories = picks
    .map((n) => TESTIMONIALS_SHORT.find((t) => t.name === n))
    .filter(Boolean) as typeof TESTIMONIALS_SHORT;
  return (
    <section data-screen-label="Stories (B)" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Real families</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 28px" }}>What Niro has already done.</h2>
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
              <blockquote
                style={{
                  margin: "0 0 18px",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.55,
                  color: "var(--text-body)",
                }}
              >
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
                  <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-strong)" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{s.location}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ trust */

function TrustB() {
  // Four claims, not six. Each is something a member could hold us to, and
  // each answers a different objection the research actually recorded: the
  // emergency nobody believes, the visit nobody else does, the commission
  // everyone suspects, and the stranger nobody vetted.
  const items: { icon: IconName; text: string; sub: string; href?: string; hrefLabel?: string }[] = [
    {
      icon: "heart-pulse",
      text: "Emergency protocol",
      sub: "The assurance of a rapid, contextual response to a medical emergency back home. You define it, we execute it.",
      href: "/niro-assured/",
      hrefLabel: "Read more on Niro Assured",
    },
    {
      icon: "map-pin",
      text: "Niro Visits",
      sub: "Booked on demand, for whatever your family needs: a doctor or visa appointment, home maintenance, or a government office visit.",
    },
    {
      icon: "shield-check",
      text: "Honest recommendations",
      sub: "We never earn a commission from any third-party vendor. We find and book only what is actually best for you.",
    },
    {
      icon: "user-check",
      text: "Verified Niro managers",
      sub: "Vetted extensively, on our own payroll, and appraised on one thing: whether your family is satisfied.",
    },
  ];
  return (
    <section data-screen-label="Trust (B)" style={{ padding: sectionPad, background: "var(--bg-inset)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <Eyebrow>Why families trust Niro</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 30px", maxWidth: 900 }}>
          Purpose-built for NRIs, with an obsession for convenience and
          reliability at the heart of it.
        </h2>
        {/* Four items, so an explicit two-up rather than auto-fit: auto-fit
            gives three columns at this width and orphans the fourth. */}
        <div className="trust-grid">
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

function PricingB() {
  return (
    <section id="pricing-fold" data-screen-label="Pricing (B)" style={{ padding: sectionPad }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", textAlign: "center" }}>
        <Eyebrow style={{ justifyContent: "center" }}>Pricing</Eyebrow>
        <h2 style={{ ...h2Style, margin: "14px 0 8px" }}>One membership. Two ways to start.</h2>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", margin: "0 0 28px" }}>
          Your first task is free. Cancel any time.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 16,
            textAlign: "left",
            marginBottom: 28,
            alignItems: "start",
          }}
        >
          {PLANS.map((p) => {
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
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
                  {p.badge && <Badge tone={dark ? "solid" : "brand"}>{p.badge}</Badge>}
                </div>
                <div style={{ margin: "10px 0 4px", display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: dark ? "#fff" : "var(--text-strong)" }}>
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
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      lineHeight: 1.5,
                      color: dark ? "rgba(255,255,255,0.82)" : "var(--text-body)",
                      margin: "0 0 12px",
                    }}
                  >
                    {p.lead}
                  </p>
                )}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--text-xs)" }}>
                      <Icon name="check-circle" size={15} style={{ marginTop: 1, flexShrink: 0, color: dark ? "var(--gold-300)" : "var(--brand)" }} />
                      <span style={{ color: dark ? "rgba(255,255,255,0.92)" : "var(--text-body)", lineHeight: 1.4 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {/* What the fee buys and what it doesn't, stated BEFORE payment. "Are
            all tasks covered?" was a live question in the WhatsApp threads, and
            an unstated answer becomes a refund request in week two. */}
        <dl className="coverage">
          <dt>What the membership covers</dt>
          <dd>{COVERAGE_NOTE.covers}</dd>
          <dt>Billed separately, at actual cost</dt>
          <dd>{COVERAGE_NOTE.excludes}</dd>
          <dd className="promise">{COVERAGE_NOTE.promise}</dd>
        </dl>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-body)",
            margin: "0 0 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            justifyContent: "center",
            textAlign: "left",
          }}
        >
          <Icon name="shield-check" size={17} style={{ marginTop: 2, flexShrink: 0, color: "var(--brand)" }} />
          <span>{GUARANTEE}</span>
        </p>
        <JoinCta className="btn btn-primary btn-lg">Join the beta</JoinCta>
        <AskNiroCta
          placement="pricing"
          prompt="Questions before joining?"
          label="Chat with us on WhatsApp"
          align="center"
          marginTop={14}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- final CTA */

function FinalCtaB() {
  return (
    <section data-screen-label="Final CTA (B)" style={{ padding: "72px var(--gutter)", background: "var(--forest-800)" }}>
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
          You can&rsquo;t always be in India. Niro can.
        </h2>
        <JoinCta className="btn btn-accent btn-lg">Get Early Access</JoinCta>
        <div style={{ marginTop: 14, fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>
          Named Niro Assistant · WhatsApp-first · First task free
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- variant */

/** Variant B — the "You can't always be in India. Niro can." reposition. */
export function VariantB() {
  return (
    <>
      <Nav cta="Get Early Access" />
      <main>
        <HeroB />
        <HowItWorksB />
        <ParentsB />
        <UseCasesB />
        <StoriesB />
        <TrustB />
        <PricingB />
        <FinalCtaB />
        <Faq showAsk={false} />
      </main>
      <StickyCta label="Get Early Access" />
    </>
  );
}
