import { META_PIXEL_IDS } from "./config";
import { getLpVariant } from "./variant";

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
  // Meta / Google ad click identifiers - pitch-cell attribution depends on these.
  "fbclid",
  "gclid",
] as const;

const UTM_STORAGE_KEY = "niro_utm";

/**
 * In-memory copy of the UTM map for this page load. Instagram's in-app browser
 * on iOS can wipe sessionStorage mid-visit without reloading the page (seen
 * Sept 2026: the session id changed 7s into a visit that landed from a Meta
 * ad, and the lead reached the sheet with no UTM, so it read as organic). The
 * page and its URL survive that wipe, so this copy and the URL are the
 * fallbacks when sessionStorage comes back empty.
 */
let memUtm: Utm = {};

function hasUtm(u: Utm): boolean {
  return Object.keys(u).length > 0;
}

function readSessionUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function readUrlUtm(): Utm {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) fromUrl[key] = val;
  }
  return fromUrl;
}

function writeSessionUtm(u: Utm): void {
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(u));
  } catch {
    /* storage may be unavailable (private mode) - non-fatal */
  }
}

/**
 * Read attribution params from the current URL and persist them (first-touch
 * wins - the ad-matched landing param set that brought the visitor in). Call
 * once on mount. Returns the merged, persisted UTM map.
 */
export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};

  const session = readSessionUtm();
  const stored = hasUtm(session) ? session : memUtm;

  // First-touch: keep already-stored values; only fill gaps from this URL.
  const merged: Utm = { ...readUrlUtm(), ...stored };
  if (hasUtm(merged)) {
    memUtm = merged;
    writeSessionUtm(merged);
  }
  return merged;
}

export function getStoredUtm(): Utm {
  if (typeof window === "undefined") return {};
  const session = readSessionUtm();
  if (hasUtm(session)) return session;

  // sessionStorage came back empty mid-visit (see memUtm). Recover from memory,
  // else from the URL, and write it back so later reads find it again.
  const recovered = hasUtm(memUtm) ? memUtm : readUrlUtm();
  if (hasUtm(recovered)) {
    memUtm = recovered;
    writeSessionUtm(recovered);
  }
  return recovered;
}

/* =====================================================================
   Pitch cell (?v=1..4, the ad-matched hero variant) + referrer (?ref=code).
   Captured first-touch alongside UTM so every signup can be sliced by pitch
   cell (the core smoke-test read) and referrals can be attributed (K-factor).
   ===================================================================== */
export type Attribution = { pitch: string; ref: string };
const ATTR_STORAGE_KEY = "niro_attr";

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return { pitch: "4", ref: "" };
  let stored: Partial<Attribution> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTR_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const vParam = params.get("v");
  const pitch =
    vParam && ["1", "2", "3", "4"].includes(vParam) ? vParam : stored.pitch || "4";
  const ref = params.get("ref") || stored.ref || "";
  const merged: Attribution = { pitch, ref };
  try {
    sessionStorage.setItem(ATTR_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable - non-fatal */
  }
  return merged;
}

export function getStoredAttribution(): Attribution {
  if (typeof window === "undefined") return { pitch: "4", ref: "" };
  try {
    const a = JSON.parse(sessionStorage.getItem(ATTR_STORAGE_KEY) || "{}");
    return { pitch: a.pitch || "4", ref: a.ref || "" };
  } catch {
    return { pitch: "4", ref: "" };
  }
}

/* =====================================================================
   Pricing experiment - 2-arm test, 50/50 split.
     A (50%): both SKUs shown side by side (Lite + Prime)
     B (50%): a single $99 "Niro membership" SKU
   The arm is assigned once and persisted in localStorage so a returning
   visitor always sees the same offer (a requirement for a clean pricing
   read). `?arm=a` / `?arm=b` overrides for QA. The arm rides along on every
   pixel event and the signup payload so results can be split by cell.
   ===================================================================== */
export type PricingArm = "A" | "B";

const ARM_STORAGE_KEY = "niro_pricing_arm";
/** Share of traffic routed to arm A (both SKUs). Remainder goes to B. */
const ARM_A_SHARE = 0.5;

function normalizeArm(v: string | null | undefined): PricingArm | null {
  if (!v) return null;
  const s = v.trim().toUpperCase();
  return s === "A" || s === "B" ? s : null;
}

/**
 * Return this visitor's pricing arm, assigning + persisting one on first call.
 * Precedence: explicit `?arm=` override → already-stored arm → fresh 60/40 draw.
 * Client-only (uses localStorage + Math.random); returns "A" during SSR.
 */
export function assignArm(): PricingArm {
  if (typeof window === "undefined") return "A";

  // QA override - pin the arm (also persist it so navigation stays consistent).
  const override = normalizeArm(new URLSearchParams(window.location.search).get("arm"));
  if (override) {
    try {
      localStorage.setItem(ARM_STORAGE_KEY, override);
    } catch {
      /* storage unavailable - non-fatal, arm still returned for this view */
    }
    return override;
  }

  let stored: PricingArm | null = null;
  try {
    stored = normalizeArm(localStorage.getItem(ARM_STORAGE_KEY));
  } catch {
    stored = null;
  }
  if (stored) return stored;

  const arm: PricingArm = Math.random() < ARM_A_SHARE ? "A" : "B";
  try {
    localStorage.setItem(ARM_STORAGE_KEY, arm);
  } catch {
    /* storage unavailable - visitor still gets an arm for this session */
  }
  return arm;
}

export function getStoredArm(): PricingArm {
  if (typeof window === "undefined") return "A";
  try {
    return normalizeArm(localStorage.getItem(ARM_STORAGE_KEY)) ?? "A";
  } catch {
    return "A";
  }
}

/* =====================================================================
   /gulf (dual-side) PRICE test - independent 2-arm test, 50/50 split.
     "149" (50%): Niro Prime at $149/month  (control)
     "99"  (50%): Niro Prime at $99/month
   Separate from the main PricingArm above so it never collides with the
   main-site cell. Persisted in localStorage so a returning visitor always
   sees the same price (clean read). `?price=149` / `?price=99` overrides for
   QA. Rides on every /gulf beacon + the signup payload so the report can
   split conversion by price. Assigned once, early, in JoinProvider (gulf).
   ===================================================================== */
export type GulfPriceArm = "149" | "99";

const GULF_PRICE_KEY = "niro_gulf_price_arm";

function normalizeGulfPrice(v: string | null | undefined): GulfPriceArm | null {
  if (!v) return null;
  const s = v.trim();
  return s === "149" || s === "99" ? s : null;
}

/** Assign + persist this visitor's /gulf price arm on first call (50/50).
 *  Precedence: `?price=` override → stored arm → fresh draw. "149" during SSR. */
export function assignGulfPriceArm(): GulfPriceArm {
  if (typeof window === "undefined") return "149";

  const override = normalizeGulfPrice(new URLSearchParams(window.location.search).get("price"));
  if (override) {
    try {
      localStorage.setItem(GULF_PRICE_KEY, override);
    } catch {
      /* non-fatal */
    }
    return override;
  }

  let stored: GulfPriceArm | null = null;
  try {
    stored = normalizeGulfPrice(localStorage.getItem(GULF_PRICE_KEY));
  } catch {
    stored = null;
  }
  if (stored) return stored;

  const arm: GulfPriceArm = Math.random() < 0.5 ? "149" : "99";
  try {
    localStorage.setItem(GULF_PRICE_KEY, arm);
  } catch {
    /* non-fatal */
  }
  return arm;
}

export function getStoredGulfPriceArm(): GulfPriceArm {
  if (typeof window === "undefined") return "149";
  try {
    return normalizeGulfPrice(localStorage.getItem(GULF_PRICE_KEY)) ?? "149";
  } catch {
    return "149";
  }
}

/** Fire a Meta Pixel event if the pixel is loaded. Safe no-op otherwise. */
export function track(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  if (typeof window === "undefined" || !window.fbq || !META_PIXEL_IDS.length) return;
  // Every Pixel event carries the landing-page arm, so the positioning test
  // can be read in Ads Manager itself rather than only in our own sheet. One
  // fbq("track") fans out to both initialised pixels, so both accounts get it.
  const withArm = { lp_variant: getLpVariant(), ...(params ?? {}) };
  if (eventId) window.fbq("track", event, withArm, { eventID: eventId });
  else window.fbq("track", event, withArm);
}

/** Fire a CUSTOM Meta Pixel event. Used for StartedConversation, which covers
 *  both ways into a conversation - opening the join form, and going straight to
 *  WhatsApp - so one ad set can optimise for the pair. The standard events
 *  (InitiateCheckout, Contact, Lead) still fire alongside it. */
export function trackCustom(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.fbq || !META_PIXEL_IDS.length) return;
  window.fbq("trackCustom", event, params ?? {});
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
