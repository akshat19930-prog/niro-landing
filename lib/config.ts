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

/** Second Meta Pixel, for the ad account the Oct 2026 campaign runs from. Both
 *  are initialised and every event goes to both: fbq("track") fans out to every
 *  initialised pixel, so the old account keeps its history while the new one
 *  gets the same signal from day one. */
export const META_PIXEL_ID_2 =
  process.env.NEXT_PUBLIC_META_PIXEL_ID_2 || "1995521257777789";

/** Every pixel to load, in init order. Empty entries are dropped so unsetting
 *  one env var cleanly disables that pixel. */
export const META_PIXEL_IDS: string[] = [META_PIXEL_ID, META_PIXEL_ID_2].filter(Boolean);

/** PostHog (heatmaps, scrollmaps, session replay, autocapture). Project API key
 *  (starts "phc_"); public/client-side by design. When unset, PostHog doesn't
 *  load. Host is US by default - use "https://eu.i.posthog.com" for an EU project. */
export const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_uoQigF2AUD9BNMFfHE2EsYxtdPccYEpC77cNj5rfc7XQ";
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

/** WhatsApp sales line (wa.me format: country code + number, no + or spaces).
 *  Every prospect-facing link goes here: the Ask Niro CTAs, the FAQ, the
 *  pricing asks, the /lite payment-link request, the post-signup handoff, and
 *  the careers applications. */
export const SALES_WHATSAPP =
  process.env.NEXT_PUBLIC_SALES_WHATSAPP || "919180581481";

/** WhatsApp support line, for members rather than prospects. Powers the footer
 *  "Contact us" link only. */
export const SUPPORT_WHATSAPP =
  process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "918867738283";

/**
 * WhatsApp line for the Niro Assistant, who scopes and runs free first tasks.
 *
 * Used in exactly two places, both of them a free-task handoff: the last step
 * of the join modal, and the task cards on /freetask. Every other WhatsApp
 * link on the site goes to SALES_WHATSAPP.
 *
 * The split exists because these two conversations are different jobs. Sales
 * sells a membership; the assistant delivers a task and sets its scope. It
 * also decides which number sees the most first contact from strangers, and
 * that is the one to put an Official Business Account tick on first: an
 * inbound message never triggers WhatsApp's unknown-sender scam screen, so
 * the tick is worth most where leads arrive under their own steam.
 */
export const ASSISTANT_WHATSAPP =
  process.env.NEXT_PUBLIC_ASSISTANT_WHATSAPP || "918867635252";

/** Waitlist position shown on the confirmation (a realistic early-stage number;
 *  the confirmation renders this instantly rather than waiting on the backend). */
export const FALLBACK_WAITLIST_POSITION = 325;
