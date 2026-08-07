import { Icon } from "./Icon";

export type ChatMessage = {
  from: "you" | "leo";
  type?: "text" | "voice";
  text?: string;
  sender?: string;
  badge?: string;
  dur?: string;
  played?: number;
  time: string;
};

const WAVE_BARS = [7, 12, 20, 14, 9, 16, 22, 18, 11, 24, 15, 8, 13, 19, 10, 6, 14, 21, 12, 7];

function Waveform({ played = 0.4, dark }: { played?: number; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 26, flex: 1 }}>
      {WAVE_BARS.map((h, i) => (
        <span
          key={i}
          style={{
            width: 2.5,
            height: h,
            borderRadius: 2,
            background:
              i / WAVE_BARS.length < played
                ? dark
                  ? "#E0BE84"
                  : "var(--forest-600)"
                : dark
                  ? "rgba(255,255,255,0.28)"
                  : "rgba(30,69,54,0.28)",
          }}
        />
      ))}
    </div>
  );
}

function ReadReceipt() {
  return (
    <span style={{ color: "#4C8BF5", fontWeight: 700, letterSpacing: -3, marginLeft: 2 }}>
      ✓✓
    </span>
  );
}

function Bubble({ m, dark }: { m: ChatMessage; dark?: boolean }) {
  const out = m.from === "you";
  return (
    <div
      style={{
        maxWidth: "82%",
        alignSelf: out ? "flex-end" : "flex-start",
        background: out ? "var(--wa-out)" : "var(--wa-in)",
        color: dark ? "var(--text-strong)" : "var(--ink-900)",
        padding: m.type === "voice" ? "10px 12px" : "8px 11px 6px",
        borderRadius: 14,
        borderBottomRightRadius: out ? 4 : 14,
        borderBottomLeftRadius: out ? 14 : 4,
        boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
        fontSize: "var(--text-sm)",
        lineHeight: 1.45,
        position: "relative",
      }}
    >
      {m.sender && (
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "var(--forest-600)",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {m.sender}
          {m.badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "var(--accent-strong)",
                background: "var(--accent-soft)",
                padding: "1px 6px",
                borderRadius: 999,
              }}
            >
              {m.badge}
            </span>
          )}
        </div>
      )}
      {m.type === "voice" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 200 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: out ? "var(--forest-600)" : "var(--forest-700)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="play" size={15} strokeWidth={0} style={{ fill: "#fff" }} />
          </span>
          <div style={{ flex: 1 }}>
            <Waveform played={m.played ?? 0.35} dark={dark} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
            {m.dur}
          </span>
        </div>
      ) : (
        <span>{m.text}</span>
      )}
      <span
        style={{
          float: "right",
          marginLeft: 10,
          marginTop: 4,
          fontSize: 10.5,
          color: "var(--text-muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        {m.time}
        {out && <ReadReceipt />}
      </span>
    </div>
  );
}

/**
 * WhatsApp-conversation showcase — the hero proof format. Native-feeling but
 * elevated: sender label, voice-note bubbles, read receipts.
 */
export function WhatsAppShowcase({
  title = "Niro",
  status = "online",
  dark = false,
  messages,
  caption,
}: {
  title?: string;
  status?: string;
  dark?: boolean;
  messages: ChatMessage[];
  caption?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-3)",
        border: "1px solid var(--border)",
        background: "var(--wa-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          background: "var(--forest-700)",
          color: "var(--ivory)",
        }}
      >
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--gold-500)",
            color: "var(--forest-950)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          N
        </span>
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#7BdfA6" }}
            />
            {status}
          </div>
        </div>
        <Icon
          name="phone"
          size={19}
          style={{ marginLeft: "auto", color: "rgba(255,255,255,0.85)" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          padding: "18px 14px",
          background: "var(--wa-bg)",
          backgroundImage: "var(--jaali)",
          backgroundSize: "60px",
        }}
      >
        <div
          style={{
            alignSelf: "center",
            background: "rgba(255,255,255,0.7)",
            color: "var(--ink-500)",
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 999,
            marginBottom: 4,
          }}
        >
          Today
        </div>
        {messages.map((m, i) => (
          <Bubble key={i} m={m} dark={dark} />
        ))}
      </div>
      {caption && (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--surface-card)",
            borderTop: "1px solid var(--border)",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
