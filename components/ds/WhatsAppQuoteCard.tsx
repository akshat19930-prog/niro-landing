import { Icon } from "./Icon";

/** WhatsApp-screenshot-style quote card from a paying NRI. */
export function WhatsAppQuoteCard({
  quote,
  name,
  location,
  time = "6:12 AM",
}: {
  quote: string;
  name: string;
  location: string;
  time?: string;
}) {
  return (
    <div
      style={{
        background: "var(--wa-bg)",
        backgroundImage: "var(--jaali)",
        backgroundSize: "56px",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-2)",
      }}
    >
      <div
        style={{
          background: "var(--wa-in)",
          borderRadius: 14,
          borderTopLeftRadius: 4,
          padding: "12px 14px 8px",
          boxShadow: "0 1px 1px rgba(0,0,0,0.10)",
          maxWidth: "94%",
        }}
      >
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "var(--forest-600)",
            marginBottom: 4,
          }}
        >
          {name}
        </div>
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--ink-900)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {quote}
        </p>
        <span
          style={{
            float: "right",
            marginTop: 4,
            fontSize: 10.5,
            color: "var(--ink-400)",
          }}
        >
          {time}{" "}
          <span style={{ color: "#4C8BF5", letterSpacing: -3 }}>✓✓</span>
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "var(--text-sm)",
          color: "var(--ink-500)",
        }}
      >
        <Icon name="map-pin" size={14} /> {location}
      </div>
    </div>
  );
}
