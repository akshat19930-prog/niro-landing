import { Card } from "@/components/ds/Card";
import { Badge } from "@/components/ds/Badge";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { WhatsAppShowcase } from "@/components/ds/WhatsAppShowcase";
import {
  MIRROR,
  STEPS,
  HOW_MESSAGES,
  HANDLE_GROUPS,
  TESTIMONIALS_SHORT,
} from "@/lib/content";

const CONTAINER = { maxWidth: "var(--container)", margin: "0 auto" } as const;
const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

/* ---- The Mirror ---- */
export function Mirror() {
  return (
    <section
      data-screen-label="The Mirror"
      style={{ padding: "80px var(--gutter)", background: "var(--bg-inset)" }}
    >
      <div style={CONTAINER}>
        <Eyebrow>Sound familiar</Eyebrow>
        <h2 style={{ ...h2Style, margin: "16px 0 40px", maxWidth: 680 }}>
          Your India to-do list is hard enough, &amp; parents don&apos;t even tell you about
          theirs
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {MIRROR.map((m) => (
            <Card key={m.title}>
              <span
                style={{
                  display: "inline-flex",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Icon name={m.icon} size={22} />
              </span>
              <div
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 600,
                  color: "var(--text-strong)",
                  marginBottom: 8,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--text-body)",
                  lineHeight: 1.55,
                }}
              >
                {m.text}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- How it works ---- */
export function HowItWorks() {
  return (
    <section data-screen-label="How it works" style={{ padding: "88px var(--gutter)" }}>
      <div
        style={{
          ...CONTAINER,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: 56,
          alignItems: "start",
        }}
      >
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ ...h2Style, margin: "16px 0 8px" }}>
            Niro is your 24/7 house manager, concierge &amp; your presence in India
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 30,
              marginTop: 36,
            }}
          >
            {STEPS.map((st) => (
              <div key={st.n} style={{ display: "flex", gap: 20 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    color: "var(--accent-strong)",
                    flexShrink: 0,
                    width: 44,
                  }}
                >
                  {st.n}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-lg)",
                      fontWeight: 600,
                      color: "var(--text-strong)",
                      marginBottom: 6,
                    }}
                  >
                    {st.title}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--text-body)",
                      lineHeight: 1.55,
                      maxWidth: 420,
                    }}
                  >
                    {st.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 380 }}>
          <WhatsAppShowcase
            messages={HOW_MESSAGES}
            caption="An actual conversation, shared with the family's permission."
          />
        </div>
      </div>
    </section>
  );
}

/* ---- What we handle ---- */
export function WhatWeHandle() {
  return (
    <section
      data-screen-label="What we handle"
      style={{ padding: "88px var(--gutter)", background: "var(--bg-inset)" }}
    >
      <div style={CONTAINER}>
        <Eyebrow>What we handle</Eyebrow>
        <h2 style={{ ...h2Style, margin: "16px 0 44px", maxWidth: 760 }}>
          Everything that&apos;s hard — or that your family doesn&apos;t like spending time
          doing
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40,
          }}
        >
          {HANDLE_GROUPS.map((group) => (
            <div key={group.name}>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  letterSpacing: "var(--tracking-wide)",
                  textTransform: "uppercase",
                  color: "var(--accent-strong)",
                  marginBottom: 22,
                }}
              >
                {group.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {group.items.map((it) => (
                  <div key={it.t} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "var(--surface-card)",
                        border: "1px solid var(--border)",
                        color: "var(--brand)",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={it.icon} size={19} />
                    </span>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--text-strong)",
                          fontSize: "var(--text-base)",
                        }}
                      >
                        {it.t}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--text-muted)",
                          marginTop: 3,
                          lineHeight: 1.5,
                        }}
                      >
                        {it.d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Proof cards (used in the auto-scrolling combined section) ---- */
const proofCardBase = {
  width: 320,
  flexShrink: 0,
  marginRight: 20,
  background: "var(--surface-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-2)",
  padding: "var(--space-5)",
  display: "flex",
  flexDirection: "column" as const,
  whiteSpace: "normal" as const,
} as const;

/** Circular photo placeholder for a testimonial (swap for a real headshot). */
function AvatarPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Photo placeholder"
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(150deg,#EAD9B8,#C9986A)",
        boxShadow: "var(--shadow-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--jaali)",
          backgroundSize: "34px",
          opacity: 0.4,
        }}
      />
      <Icon
        name="camera"
        size={16}
        style={{ color: "rgba(255,255,255,0.92)", position: "relative" }}
      />
    </div>
  );
}

/** Real circular headshot for a testimonial. Rendered as a background image
 *  layered over the gradient placeholder, so a missing file degrades to the
 *  placeholder gracefully (no broken-image icon) — static export, no JS. */
function AvatarPhoto({ src, name }: { src: string; name: string }) {
  return (
    <div
      role="img"
      aria-label={`${name.split(",")[0]}, beta member`}
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        flexShrink: 0,
        boxShadow: "var(--shadow-1)",
        backgroundColor: "var(--gold-200, #EAD9B8)",
        backgroundImage: `url("${src}"), linear-gradient(150deg,#EAD9B8,#C9986A)`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    />
  );
}

function TestimonialCard({
  name,
  location,
  quote,
  photo,
}: {
  name: string;
  location: string;
  quote: string;
  photo?: string;
}) {
  return (
    <div style={{ ...proofCardBase, gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {photo ? <AvatarPhoto src={photo} name={name} /> : <AvatarPlaceholder />}
        <div style={{ lineHeight: 1.35 }}>
          <div
            style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: "var(--text-base)" }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            <Icon name="map-pin" size={13} /> {location}
          </div>
        </div>
      </div>
      <p
        style={{
          fontSize: "var(--text-base)",
          color: "var(--text-body)",
          lineHeight: 1.55,
          margin: 0,
          flex: 1,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <Badge tone="neutral">Beta member</Badge>
      </div>
    </div>
  );
}

/* ---- Proof: beta-member testimonials, one auto-scrolling strip ---- */
export function Proof() {
  // Beta-member testimonials (with photo placeholders), duplicated once so the
  // horizontal marquee loops seamlessly.
  const track = [...TESTIMONIALS_SHORT, ...TESTIMONIALS_SHORT];

  return (
    <section
      data-screen-label="From beta access families"
      style={{ padding: "88px 0", background: "var(--bg-inset)", overflow: "hidden" }}
    >
      <div style={{ ...CONTAINER, padding: "0 var(--gutter)" }}>
        <Eyebrow>From beta access families</Eyebrow>
        <h2 style={{ ...h2Style, margin: "16px 0 8px" }}>
          Real families. Real tasks. Real relief
        </h2>
        <p
          style={{
            fontSize: "var(--text-md)",
            color: "var(--text-body)",
            lineHeight: 1.6,
            maxWidth: 640,
            margin: "0 0 36px",
          }}
        >
          Niro launched in beta three months ago — here&apos;s what our early beta-access
          members have got done through us.
        </p>
      </div>
      <div className="marquee" aria-label="Beta family testimonials">
        <div className="marquee-track">
          {track.map((t, i) => (
            <TestimonialCard
              key={`t-${i}`}
              name={t.name}
              location={t.location}
              quote={t.quote}
              photo={t.photo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

