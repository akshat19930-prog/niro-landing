/**
 * Runtime configuration, all via NEXT_PUBLIC_* env vars so the static export
 * can be rebuilt per environment without code changes. Every value is
 * optional — the page fully works in "smoke-test / no backend" mode, which is
 * how it ships until the waitlist API and Meta assets are wired.
 */

/** Meta Pixel ID. When unset, no pixel loads and events are no-ops. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/**
 * Waitlist API endpoint. Receives the signup payload (email + UTM + tasks +
 * eventId) as JSON POST. It should (a) persist the signup, (b) return
 * `{ position, referralCode }`, and (c) forward the Meta CAPI "Lead" event
 * server-side using the same `eventId` for dedup with the browser pixel.
 * When unset, the flow simulates a response locally so the funnel is testable.
 */
export const WAITLIST_ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT ?? "";

/** Public site origin used to build referral links. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://niro.family";

/** Fallback waitlist position shown when no backend returns one. */
export const FALLBACK_WAITLIST_POSITION = 1847;
