import type { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet" | "accent";
type Size = "sm" | "md" | "lg";

/**
 * Niro Button - primary (forest), secondary (outline), quiet (text), accent
 * (gold). Renders as <button> or, when `href` is given, as an <a> so CTAs can
 * smooth-scroll to #join with zero JS. Human labels only, never "Submit".
 */
type CommonProps = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type AsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

type AsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: AsButton | AsLink) {
  const {
    variant = "primary",
    size = "md",
    full = false,
    children,
    className = "",
    style,
  } = props;

  const cls = [
    "btn",
    `btn-${size}`,
    `btn-${variant}`,
    full ? "btn-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href !== undefined) {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={cls}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={cls}
      style={style}
    >
      {children}
    </button>
  );
}
