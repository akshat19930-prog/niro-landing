import { Icon, type IconName } from "./Icon";

export type TrustItem = { icon: IconName; text: string; sub: string };

/** Trust bar — the four promises. Legible even as a cropped ad screenshot. */
export function TrustBar({
  items,
  dark = false,
}: {
  items: TrustItem[];
  dark?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "var(--space-4)",
        padding: "var(--space-5)",
        background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-card)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "var(--border)"}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: dark ? "none" : "var(--shadow-2)",
      }}
    >
      {items.map((it) => (
        <div
          key={it.text}
          style={{ display: "flex", alignItems: "flex-start", gap: 13 }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: dark ? "rgba(224,190,132,0.14)" : "var(--brand-soft)",
              color: dark ? "var(--gold-300)" : "var(--brand)",
            }}
          >
            <Icon name={it.icon} size={22} />
          </span>
          <div style={{ lineHeight: 1.4 }}>
            <div
              style={{
                fontSize: "var(--text-base)",
                fontWeight: 600,
                color: dark ? "var(--ivory)" : "var(--text-strong)",
              }}
            >
              {it.text}
            </div>
            <div
              style={{
                fontSize: "var(--text-sm)",
                color: dark ? "rgba(255,255,255,0.6)" : "var(--text-muted)",
              }}
            >
              {it.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
