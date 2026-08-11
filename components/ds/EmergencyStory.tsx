import { Icon, type IconName } from "./Icon";

const STEPS: { title: string; text: string; icon: IconName }[] = [
  {
    icon: "phone",
    title: "Trigger",
    text: "You, a parent, or a fall-detection device raises the alert.",
  },
  {
    icon: "heart-pulse",
    title: "Check-in & ambulance",
    text: "We call back in moments and dispatch an ambulance.",
  },
  {
    icon: "user-check",
    title: "On the ground",
    text: "Our concierge reaches the hospital, handles the paperwork, and stays with your parent.",
  },
];

/** Emergency-story section (dark) - the 2:47 AM promise, kept tight. */
export function EmergencyStory() {
  return (
    <section
      data-theme="dark"
      data-screen-label="Emergency story"
      style={{
        background:
          "radial-gradient(120% 80% at 80% 0%, #12281F 0%, var(--forest-950) 55%, #060F0B 100%)",
        color: "var(--text-body)",
        padding: "var(--space-8) var(--gutter)",
      }}
    >
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <div style={{ maxWidth: 620, marginBottom: "var(--space-6)" }}>
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
          <h2 style={{ fontSize: "var(--text-3xl)", color: "#fff", margin: "12px 0 10px" }}>
            Emergencies don&apos;t check the time zone
          </h2>
          <p
            style={{
              fontSize: "var(--text-md)",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.55,
            }}
          >
            Set the protocol up front - blood group, documents, hospital. When it&apos;s
            needed, we&apos;re already on the ground.
          </p>
        </div>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: "var(--space-5)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          }}
        >
          {STEPS.map((step, i) => (
            <li
              key={i}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
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
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  color: "#fff",
                  margin: "14px 0 6px",
                }}
              >
                {step.title}
              </div>
              <p
                style={{
                  fontSize: "var(--text-md)",
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.55,
                }}
              >
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
