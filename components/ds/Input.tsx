import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

/** Niro text field - warm, generous, calm focus ring (focus handled in CSS). */
export function Input({
  label,
  hint,
  error,
  icon,
  id,
  style,
  className = "",
  ...rest
}: {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  style?: CSSProperties;
} & InputHTMLAttributes<HTMLInputElement>) {
  const inputId =
    id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            color: "var(--text-body)",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 14,
              display: "flex",
              color: "var(--text-muted)",
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={["ds-input", error ? "has-error" : "", className]
            .filter(Boolean)
            .join(" ")}
          style={{ padding: icon ? "12px 16px 12px 42px" : undefined, ...style }}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: error ? "var(--danger)" : "var(--text-muted)",
          }}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
