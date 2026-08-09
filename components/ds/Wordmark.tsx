import type { CSSProperties } from "react";

/**
 * Niro wordmark - lowercase "niro" in the display serif, forest green, with a
 * burnished-gold teardrop in place of the dot on the "i" (matches the brand
 * logo). Reproduced as text + inline SVG so it stays crisp at any size and
 * recolours for the dark footer (ivory on dark, gold teardrop throughout).
 */
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
      aria-label="niro"
      role="img"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        color: dark ? "var(--ivory)" : "var(--forest-800)",
        display: "inline-flex",
        alignItems: "baseline",
        lineHeight: 1,
        ...style,
      }}
    >
      <span aria-hidden="true">n</span>
      {/* dotless i with the gold teardrop mark sitting where the dot would be */}
      <span
        aria-hidden="true"
        style={{ position: "relative", display: "inline-block" }}
      >
        {"ı"}
        <svg
          viewBox="0 0 24 24"
          width="0.5em"
          height="0.5em"
          style={{
            position: "absolute",
            left: "50%",
            top: "-0.34em",
            transform: "translateX(-50%)",
            display: "block",
          }}
        >
          {/* teardrop: round lobe up-right, tail curling to the lower-left */}
          <path
            d="M12 2 C 12 2 5.5 9.5 5.5 15 A 6.5 6.5 0 0 0 18.5 15 C 18.5 9.5 12 2 12 2 Z"
            transform="rotate(214 12 13.5)"
            fill="var(--accent)"
          />
        </svg>
      </span>
      <span aria-hidden="true">ro</span>
    </span>
  );
}
