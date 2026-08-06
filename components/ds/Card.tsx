import type { CSSProperties, ReactNode } from "react";

type Tone = "default" | "inset" | "brand" | "outline";

const tones: Record<Tone, CSSProperties> = {
  default: { background: "var(--surface-card)", border: "1px solid var(--border)" },
  inset: { background: "var(--bg-inset)", border: "1px solid var(--border)" },
  brand: {
    background: "var(--surface-brand)",
    border: "1px solid transparent",
    color: "var(--text-on-brand)",
  },
  outline: { background: "transparent", border: "1px solid var(--border-strong)" },
};

/** Niro surface card — soft warm shadow, generous radius. Optional hover-lift. */
export function Card({
  children,
  padded = true,
  hover = false,
  tone = "default",
  className = "",
  style,
}: {
  children: ReactNode;
  padded?: boolean;
  hover?: boolean;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={["card", hover ? "card-hover" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        boxShadow: tone === "outline" ? "none" : undefined,
        padding: padded ? "var(--space-5)" : 0,
        ...tones[tone],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
