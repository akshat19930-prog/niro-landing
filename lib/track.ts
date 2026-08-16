/**
 * Lightweight funnel + session beacons for the smoke-test report.
 *
 * Every event is POSTed (sendBeacon, no preflight) to the same Apps Script
 * endpoint as signups; the script routes `type:"event"` rows to an `events`
 * tab. From those the report builds traffic-by-arm, the funnel (exposure →
 * join_initiated → email_entered → reserve_clicked), bounce rate and average
 * session duration — by date and by pricing arm.
 *
 * No third-party analytics: bounce / duration are approximations computed from
 * these beacons (a session is "engaged" if it lasts >=10s, scrolls/clicks, or
 * starts the waitlist). Swap in GA4 later if you want industry-standard numbers.
 */
import { WAITLIST_ENDPOINT } from "./config";
import { getStoredArm, getStoredAttribution } from "./analytics";
import { readPageArm } from "./abtest";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void;
      register: (props: Record<string, unknown>) => void;
    };
  }
}

// Funnel events also sent to PostHog (for funnels/heatmap segmentation); the
// session lifecycle events (exposure/session_end) are left to PostHog's own
// pageview/pageleave capture.
const PH_FORWARD: Record<string, true> = {
  ab_exposure: true,
  join_initiated: true,
  email_entered: true,
  reserve_clicked: true,
};

/** Register the pricing arm + pitch as PostHog super-properties, so heatmaps
 *  and funnels can be filtered by cell. Safe no-op if PostHog isn't loaded. */
export function registerAnalytics(arm: string, pitch: string): void {
  try {
    window.posthog?.register({ arm: arm, pitch: pitch });
  } catch {
    /* PostHog not loaded / not configured */
  }
}

const SID_KEY = "niro_sid";
const START_KEY = "niro_sstart";
const ENG_KEY = "niro_eng";
const EXPOSED_KEY = "niro_exposed";

function store(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getSessionId(): string {
  const s = store();
  if (!s) return "s0";
  let id = s.getItem(SID_KEY);
  if (!id) {
    id = "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    s.setItem(SID_KEY, id);
  }
  return id;
}

export function logEvent(event: string, extra?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !WAITLIST_ENDPOINT) return;
  const { pitch } = getStoredAttribution();
  const body = JSON.stringify({
    type: "event",
    event,
    arm: getStoredArm(),
    page_arm: readPageArm(),
    pitch,
    sid: getSessionId(),
    ts: Date.now(),
    ...(extra || {}),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        WAITLIST_ENDPOINT,
        new Blob([body], { type: "text/plain;charset=UTF-8" })
      );
    } else {
      void fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* non-fatal */
  }

  // Mirror funnel events to PostHog for funnels + heatmap segmentation.
  if (PH_FORWARD[event]) {
    try {
      window.posthog?.capture(event, {
        arm: getStoredArm(),
        page_arm: readPageArm(),
        pitch,
      });
    } catch {
      /* PostHog not loaded */
    }
  }
}

let started = false;
/** Call once on mount (after the arm is assigned). Logs one exposure per
 *  session, tracks engagement, and emits session_end with duration on unload. */
export function startSession(): void {
  if (typeof window === "undefined" || started) return;
  started = true;
  const s = store();

  if (s && !s.getItem(EXPOSED_KEY)) {
    s.setItem(EXPOSED_KEY, "1");
    s.setItem(START_KEY, String(Date.now()));
    logEvent("exposure");
  }

  const markEngaged = () => {
    try {
      if (s) s.setItem(ENG_KEY, "1");
    } catch {
      /* ignore */
    }
  };
  window.addEventListener("scroll", markEngaged, { once: true, passive: true });
  window.addEventListener("click", markEngaged, { once: true });
  window.addEventListener("keydown", markEngaged, { once: true });

  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    const start = Number((s && s.getItem(START_KEY)) || Date.now());
    const durationMs = Math.max(0, Date.now() - start);
    const engaged = (s && s.getItem(ENG_KEY) === "1") || durationMs >= 10000;
    logEvent("session_end", { durationMs: durationMs, engaged: engaged ? 1 : 0 });
  };
  window.addEventListener("pagehide", end);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") end();
  });
}
