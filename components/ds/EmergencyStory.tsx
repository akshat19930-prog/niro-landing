import { Icon, type IconName } from "./Icon";
import { WhatsAppShowcase, type ChatMessage } from "./WhatsAppShowcase";

const STEPS: { title: string; text: string; icon: IconName }[] = [
  {
    icon: "phone",
    title: "Emergency trigger",
    text: "You call, a parent calls, or it fires automatically from partner hardware — a smartwatch or a fall-detection pendant.",
  },
  {
    icon: "heart-pulse",
    title: "Instant check-in & ambulance",
    text: "We call back within moments to understand the situation and dispatch an ambulance.",
  },
  {
    icon: "user-check",
    title: "On the ground, on your terms",
    text: "Our concierge reaches the hospital you designated, handles the paperwork, steadies an anxious parent, and does exactly as you say — or as you pre-defined.",
  },
];

const NIGHT_MESSAGES: ChatMessage[] = [
  {
    from: "leo",
    sender: "Niro",
    badge: "assoc: Priya",
    type: "text",
    text: "We talked on call, Ankush. Papa is having chest discomfort, and the ambulance is dispatched — should reach in ~10 mins. Taking them to Apollo, as you recommended.",
    time: "2:47 AM",
  },
  {
    from: "leo",
    sender: "Niro",
    type: "text",
    text: "Our associate Kunal will be at the hospital to handle everything and support Amma. Sharing his details here.",
    time: "2:48 AM",
  },
  {
    from: "you",
    type: "text",
    text: "Keep me posted here pls — you have all the documents?",
    time: "2:49 AM",
  },
  {
    from: "leo",
    sender: "Niro",
    type: "text",
    text: "All sorted — I'll fetch them from your app's vault, as you permitted.",
    time: "2:50 AM",
  },
  {
    from: "leo",
    sender: "Niro",
    type: "text",
    text: "Ambulance's reached. I've intimated your family doctor too. Talk soon 🙏",
    time: "2:58 AM",
  },
];

/** Emergency-story section (dark) — the 2:47 AM narrative as a vignette. */
export function EmergencyStory() {
  return (
    <section
      data-theme="dark"
      data-screen-label="Emergency story"
      style={{
        background:
          "radial-gradient(120% 80% at 80% 0%, #12281F 0%, var(--forest-950) 55%, #060F0B 100%)",
        color: "var(--text-body)",
        padding: "var(--space-9) var(--gutter)",
      }}
    >
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: "var(--space-8)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: "var(--gold-300)",
            }}
          >
            <span style={{ width: 18, height: 1, background: "var(--gold-400)" }} /> The
            2:47 AM promise
          </div>
          <h2 style={{ fontSize: "var(--text-3xl)", color: "#fff", margin: "16px 0 14px" }}>
            Emergencies don&apos;t check the time zone
          </h2>
          <p
            style={{
              fontSize: "var(--text-md)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.6,
            }}
          >
            We&apos;ll be there, acting fast, on your behalf.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginTop: 22,
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ color: "var(--gold-300)", flexShrink: 0, marginTop: 1 }}>
              <Icon name="shield-check" size={20} />
            </span>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              You set an emergency protocol with us up front — blood group, ready
              documents, which hospital and which doctor. The plan exists before it&apos;s
              needed, and we&apos;re on the ground the moment it is.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gap: "var(--space-7)",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            alignItems: "start",
          }}
        >
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            {STEPS.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: 18, position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: i === 1 ? "var(--gold-500)" : "rgba(255,255,255,0.06)",
                      color: i === 1 ? "var(--forest-950)" : "var(--gold-300)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Icon name={step.icon} size={22} />
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 26,
                        background: "rgba(255,255,255,0.14)",
                        marginTop: 6,
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--gold-300)",
                      marginBottom: 6,
                    }}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-lg)",
                      color: "#fff",
                      marginBottom: 6,
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    style={{
                      fontSize: "var(--text-md)",
                      color: "rgba(255,255,255,0.82)",
                      lineHeight: 1.55,
                      maxWidth: 460,
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div style={{ justifySelf: "center", width: "100%", maxWidth: 380 }}>
            <WhatsAppShowcase
              dark
              title="Niro <> Ankush Family"
              status="You, Priya, Kunal"
              messages={NIGHT_MESSAGES}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
