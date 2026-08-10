/**
 * Runtime configuration, all via NEXT_PUBLIC_* env vars so the static export
 * can be rebuilt per environment without code changes. Every value is
 * optional - the page fully works in "smoke-test / no backend" mode, which is
 * how it ships until the waitlist API and Meta assets are wired.
 */

/** Meta Pixel ID. Public value (visible in page source), so safe to commit; a
 *  repo Actions variable of the same name overrides it. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1711474783446227";

/** PostHog (heatmaps, scrollmaps, session replay, autocapture). Project API key
 *  (starts "phc_"); public/client-side by design. When unset, PostHog doesn't
 *  load. Host is US by default — use "https://eu.i.posthog.com" for an EU project. */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Waitlist API endpoint. Receives the signup payload (email + UTM + tasks +
 * eventId) as JSON POST. It should (a) persist the signup, (b) return
 * `{ position, referralCode }`, and (c) forward the Meta CAPI "Lead" event
 * server-side using the same `eventId` for dedup with the browser pixel.
 * When unset, the flow simulates a response locally so the funnel is testable.
 */
export const WAITLIST_ENDPOINT =
  process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT ||
  // Google Apps Script Web App (writes signups to a Sheet). Public endpoint, so
  // safe to commit. A repo Actions variable of the same name overrides this.
  "https://script.google.com/macros/s/AKfycbwFnBAz3ZFXKr3D13KtKqOyATFW2TVb5gIFOJfch6GJwLbABYzWoMntnvPFl8m2Qunl_A/exec";

/** Public site origin used to build referral links. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://tellniro.com";

/** Waitlist position shown on the confirmation (a realistic early-stage number;
 *  the confirmation renders this instantly rather than waiting on the backend). */
export const FALLBACK_WAITLIST_POSITION = 325;
