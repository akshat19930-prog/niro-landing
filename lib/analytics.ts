import { META_PIXEL_ID } from "./config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type Utm = Record<string, string>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  // Meta / Google ad click identifiers — pitch-cell attribution depends on these.
  "fbclid",
  "gclid",
] as const;

const UTM_STORAGE_KEY = "niro_utm";

/**
 * Read attribution params from the current URL and persist them (first-touch
 * wins — the ad-matched landing param set that brought the visitor in). Call
 * once on mount. Returns the merged, persisted UTM map.
 */
export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};

  let stored: Utm = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) fromUrl[key] = val;
  }

  // First-touch: keep already-stored values; only fill gaps from this URL.
  const merged: Utm = { ...fromUrl, ...stored };
  if (Object.keys(merged).length) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }
  return merged;
}

export function getStoredUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Fire a Meta Pixel event if the pixel is loaded. Safe no-op otherwise. */
export function track(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  if (typeof window === "undefined" || !window.fbq || !META_PIXEL_ID) return;
  if (eventId) window.fbq("track", event, params ?? {}, { eventID: eventId });
  else window.fbq("track", event, params ?? {});
}

/**
 * Generate a client event id. Shared between the browser pixel and the CAPI
 * event (sent server-side by the waitlist backend) so Meta can de-duplicate.
 */
export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `evt_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
}
