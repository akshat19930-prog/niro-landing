import { Icon, type IconName } from "./Icon";
import { WhatsAppShowcase, type ChatMessage } from "./WhatsAppShowcase";

const BEATS: { time: string; place: string; text: string; icon: IconName }[] = [
  {
    time: "2:47 AM",
    place: "Jersey City",
    text: "Your phone lights the ceiling. A missed call from home is the worst kind of light.",
    icon: "clock",
  },
  {
    time: "2:47 AM",
    place: "Niro",
    text: "We're already awake. Your associate Priya is calling the Pune ambulance line while you're still reading this.",
    icon: "phone",
  },
  {
    time: "3:10 AM",
    place: "Pune",
    text: "Papa is in the car, seatbelt on, a familiar voice beside him. You approve the hospital from your bed with one tap.",
    icon: "heart-pulse",
  },
  {
    time: "6:30 AM",
    place: "Your kitchen",
    text: 'Coffee. A voice note: "He\'s admitted, stable, resting. Reports attached. I\'ll stay till morning rounds."',
    icon: "check-circle",
  },
];

const NIGHT_MESSAGES: ChatMessage[] = [
  {
    from: "leo",
    sender: "Niro",
    badge: "assoc: Priya",
    type: "text",
    text: "I've got this. Ambulance dispatched to the flat — ETA 9 minutes. I'm on the line with them now.",
    time: "2:49 AM",
  },
  {
    from: "you",
    type: "text",
    text: "I'm 12,000 km away and shaking. Please.",
    time: "2:50 AM",
  },
  { from: "leo", sender: "Niro", type: "voice", dur: "0:18", played: 0.6, time: "2:51 AM" },
  {
    from: "leo",
    sender: "Niro",
    type: "text",
    text: "He's in the car. I'm with him. Breathe — you don't have to do this alone tonight.",
    time: "3:04 AM",
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
            Emergencies don&apos;t check the time zone.
          </h2>
          <p
            style={{
              fontSize: "var(--text-md)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.6,
            }}
          >
            The call you dread comes when you can do the least. This is the one night we
            were built for.
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
              Every family sets an emergency protocol with us up front — blood group,
              preferred hospital, who to call first. So the plan exists before the night
              it&apos;s needed, and we share our written response commitment for your city
              before you ever use it.
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
            {BEATS.map((b, i) => (
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
                    <Icon name={b.icon} size={22} />
                  </span>
                  {i < BEATS.length - 1 && (
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
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-lg)",
                        color: "#fff",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {b.time}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--gold-300)",
                      }}
                    >
                      {b.place}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "var(--text-md)",
                      color: "rgba(255,255,255,0.82)",
                      lineHeight: 1.55,
                      maxWidth: 460,
                    }}
                  >
                    {b.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div style={{ justifySelf: "center", width: "100%", maxWidth: 380 }}>
            <WhatsAppShowcase
              dark
              status="online · 2:51 AM"
              messages={NIGHT_MESSAGES}
              caption="An actual night. Shared with the family's permission."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
