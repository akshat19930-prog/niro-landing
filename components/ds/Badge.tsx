import type { CSSProperties, ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "accent" | "success" | "solid";

const tones: Record<BadgeTone, CSSProperties> = {
  neutral: {
    background: "var(--bg-inset)",
    color: "var(--text-body)",
    border: "1px solid var(--border)",
  },
  brand: {
    background: "var(--brand-soft)",
    color: "var(--brand)",
    border: "1px solid transparent",
  },
  accent: {
    background: "var(--accent-soft)",
    color: "var(--accent-strong)",
    border: "1px solid transparent",
  },
  success: {
    background: "rgba(42,107,79,0.12)",
    color: "var(--success)",
    border: "1px solid transparent",
  },
  solid: {
    background: "var(--brand)",
    color: "var(--text-on-brand)",
    border: "1px solid transparent",
  },
};

/** Small rounded label. */
export function Badge({
  children,
  tone = "neutral",
  icon,
  style,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "0.02em",
        borderRadius: "var(--radius-pill)",
        lineHeight: 1.4,
        ...tones[tone],
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}
