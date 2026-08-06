import type { CSSProperties } from "react";

/** Niro wordmark — display serif with a burnished-gold point. */
export function Wordmark({
  size = 26,
  dark = false,
  style,
}: {
  size?: number;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: dark ? "var(--ivory)" : "var(--text-strong)",
        display: "inline-flex",
        alignItems: "baseline",
        lineHeight: 1,
        ...style,
      }}
    >
      Niro
      <span style={{ color: "var(--accent)", marginLeft: 1 }}>.</span>
    </span>
  );
}
