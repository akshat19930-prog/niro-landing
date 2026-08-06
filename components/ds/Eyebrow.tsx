import type { CSSProperties, ReactNode } from "react";

/** All-caps tracked eyebrow label with a short gold rule — sits above titles. */
export function Eyebrow({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-wide)",
        textTransform: "uppercase",
        color: "var(--accent-strong)",
        ...style,
      }}
    >
      <span
        style={{ width: 18, height: 1, background: "var(--accent)" }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
