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
import { getStoredArm, getStoredAttribution, getStoredGulfPriceArm } from "./analytics";
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

/** Coarse region from the browser time zone, so the report can split the funnel
 *  into North America / Gulf / rest without a geo-IP service. Cached per load. */
let _geo: string | null = null;
function coarseGeo(): string {
  if (_geo) return _geo;
  let g = "other";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Dubai|Abu_Dhabi|Qatar|Bahrain|Riyadh|Kuwait|Muscat|Aden/i.test(tz)) g = "gulf";
    else if (
      /New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana|Kentucky|Boise|Juneau|Sitka|Menominee|Honolulu|Adak|Nome|Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal|Moncton|Whitehorse|Yellowknife|Iqaluit|Goose_Bay|Swift_Current|Cambridge_Bay|Fort_Nelson|Rankin_Inlet|Resolute|Dawson|Creston/i.test(tz) ||
      /^America\//.test(tz)
    )
      g = "na";
  } catch {
    /* keep "other" */
  }
  _geo = g;
  return g;
}

/** Public accessor for the coarse region ("gulf" | "na" | "other"), so the
 *  signup payload can tag each lead's geography in the waitlist sheet. */
export function getGeo(): string {
  return coarseGeo();
}

/** Best-guess international dialling code from the browser time zone, used to
 *  pre-fill the WhatsApp-number field so the visitor only types the local part.
 *  Returns "" when it can't tell (visitor can type the full number). */
export function dialCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Dubai|Abu_Dhabi/i.test(tz)) return "+971";
    if (/Qatar/i.test(tz)) return "+974";
    if (/Bahrain/i.test(tz)) return "+973";
    if (/Riyadh/i.test(tz)) return "+966";
    if (/Kuwait/i.test(tz)) return "+965";
    if (/Muscat/i.test(tz)) return "+968";
    if (/Kolkata|Calcutta/i.test(tz)) return "+91";
    if (
      /Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal|Moncton|Whitehorse|Yellowknife|Iqaluit/i.test(tz) ||
      /^America\//.test(tz)
    )
      return "+1";
  } catch {
    /* fall through */
  }
  return "";
}

function pagePath(): string {
  try {
    return window.location.pathname || "/";
  } catch {
    return "/";
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
    // page + geo on EVERY beacon so the report can segment the funnel by market
    // (North America / Gulf / Gulf-Dual) — exposure/session_end included.
    page: pagePath(),
    geo: coarseGeo(),
    // On /gulf, tag the $149-vs-$99 price arm so the report can split the
    // dual-side funnel by price. Empty string elsewhere (kept out of the way).
    ...(pagePath().startsWith("/gulf") ? { priceArm: getStoredGulfPriceArm() } : {}),
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

/** Fire a beacon at most once per session for a given key (uses sessionStorage
 *  so a scroll milestone / fold view isn't double-counted on the same visit).
 *  Returns true the first time only. */
function fireOnce(key: string): boolean {
  const s = store();
  if (!s) return true; // no storage: allow (rare; avoids silently dropping)
  try {
    if (s.getItem(key)) return false;
    s.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

/** Scroll-depth + pricing-fold beacons, so the report can see WHERE visitors
 *  drop — e.g. how many reach the $ pricing fold before leaving — split by
 *  page/market like the rest of the funnel. Each milestone fires at most once
 *  per session. `#pricing-fold` is marked on both the main and /gulf pricing
 *  sections. */
function startScrollTracking(): void {
  const milestones: Array<[number, string]> = [
    [25, "scroll_25"],
    [50, "scroll_50"],
    [75, "scroll_75"],
    [95, "scroll_100"],
  ];
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct =
        scrollable <= 0 ? 100 : ((window.scrollY || doc.scrollTop) / scrollable) * 100;
      for (const [t, name] of milestones) {
        if (pct >= t && fireOnce("nsc_" + t)) logEvent(name);
      }
      if (pct >= 95) window.removeEventListener("scroll", onScroll);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // catch short pages / restored scroll position

  // Pricing fold: fire when the $ section first enters the viewport. This is the
  // key "did they get to the price?" signal for the funnel.
  try {
    const el = document.getElementById("pricing-fold");
    if (el && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              if (fireOnce("nsc_pricing")) logEvent("reached_pricing");
              io.disconnect();
            }
          }
        },
        { threshold: 0.35 }
      );
      io.observe(el);
    }
  } catch {
    /* IO not supported — depth milestones still cover the funnel */
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

  startScrollTracking();
}
