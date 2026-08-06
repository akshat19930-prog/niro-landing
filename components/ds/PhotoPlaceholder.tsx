import type { CSSProperties } from "react";
import { Icon } from "./Icon";

/**
 * Warm-graded photo placeholder — signals the intended candid shot without
 * stock imagery. Replace with a licensed/shot image before launch (art
 * direction: unstaged domestic warmth, honest interiors — no stock-photo gloss).
 */
export function PhotoPlaceholder({
  caption,
  height = 460,
  radius = 24,
  tone = "day",
  style,
}: {
  caption: string;
  height?: number;
  radius?: number;
  tone?: "day" | "night";
  style?: CSSProperties;
}) {
  const bg =
    tone === "night"
      ? "linear-gradient(150deg,#0E241C,#1A2A24 60%,#3B2E1C)"
      : "linear-gradient(150deg,#EAD9B8,#E7C79A 45%,#C9986A)";
  return (
    <div
      role="img"
      aria-label={caption}
      style={{
        position: "relative",
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: bg,
        boxShadow: "var(--shadow-3)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--jaali)",
          backgroundSize: "64px",
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 100% at 30% 20%, transparent 40%, rgba(0,0,0,0.28))",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 16,
          right: 18,
          display: "flex",
          alignItems: "center",
          gap: 9,
          color: "rgba(255,255,255,0.92)",
        }}
      >
        <Icon name="camera" size={17} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontStyle: "italic",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
}
