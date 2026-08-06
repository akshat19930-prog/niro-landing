import type { CSSProperties } from "react";

/**
 * Niro line-icon set. Lucide-derived geometry: 24×24, currentColor stroke,
 * round caps/joins, no fill. One consistent stroke weight across the brand.
 * Paths ported verbatim from the design-system bundle.
 */
export type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "chevron-right"
  | "check"
  | "check-circle"
  | "shield"
  | "shield-check"
  | "home"
  | "gift"
  | "file-text"
  | "wallet"
  | "heart-pulse"
  | "phone"
  | "message-circle"
  | "mic"
  | "play"
  | "star"
  | "lock"
  | "user-check"
  | "camera"
  | "clock"
  | "menu"
  | "x"
  | "map-pin"
  | "sunrise";

const PATHS: Record<IconName, React.ReactNode> = {
  "arrow-right": (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  "arrow-up-right": (
    <>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </>
  ),
  "chevron-right": <polyline points="9 6 15 12 9 18" />,
  check: <polyline points="20 6 9 17 4 12" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8.5 12 11 14.5 15.5 9.5" />
    </>
  ),
  shield: <path d="M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z" />,
  "shield-check": (
    <>
      <path d="M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z" />
      <polyline points="9 11.5 11 13.5 15 9.5" />
    </>
  ),
  home: (
    <>
      <polyline points="3 10.5 12 3 21 10.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" />
      <line x1="12" y1="8" x2="12" y2="21" />
      <path d="M12 8S10.6 4 8.2 4a2 2 0 1 0 0 4H12z" />
      <path d="M12 8s1.4-4 3.8-4a2 2 0 1 1 0 4H12z" />
    </>
  ),
  "file-text": (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </>
  ),
  wallet: (
    <>
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </>
  ),
  "heart-pulse": (
    <>
      <path d="M12 20.5S5 16.5 2.8 12C.8 8.3 2.4 4.8 5.7 4.8c2 0 3.4 1.4 4.3 2.9.9-1.5 2.3-2.9 4.3-2.9 3.3 0 4.9 3.5 2.9 7.2" />
      <polyline points="21.5 12 16.5 12 14.5 8.5 11.5 16 9.5 12 7 12" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
  ),
  "message-circle": <path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5z" />,
  mic: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </>
  ),
  play: <polygon points="7 4 20 12 7 20" />,
  star: (
    <path d="M12 2.5l2.9 6.1 6.6.6-5 4.4 1.5 6.5L12 17.2 6 20.6l1.5-6.5-5-4.4 6.6-.6z" />
  ),
  lock: (
    <>
      <rect x="4.5" y="11" width="15" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  "user-check": (
    <>
      <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </>
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </>
  ),
  menu: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  ),
  x: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  sunrise: (
    <>
      <path d="M12 2v6" />
      <path d="m4.9 10.9 1.4 1.4" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="m17.7 12.3 1.4-1.4" />
      <path d="M22 22H2" />
      <path d="M16 18a4 4 0 0 0-8 0" />
      <path d="m8 6 4-4 4 4" />
    </>
  ),
};

export function Icon({
  name,
  size = 22,
  strokeWidth = 1.75,
  style,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
