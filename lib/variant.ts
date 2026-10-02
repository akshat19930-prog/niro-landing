/**
 * Reader for the landing-page variant assigned by components/VariantInit.tsx.
 *
 * A: the control page at /. B2: the repositioned page at /start, which sells
 * Niro as the NRI's own 1:1 assistant rather than a family group chat. The
 * hypothesis is that buyers stall when the pitch implies asking their parents
 * for sign-off, so B2 removes that step from the story entirely.
 *
 * The assignment itself is first-touch and lives in a 90-day cookie. This
 * module only reads it, and is the single place the rest of the app should
 * ask: beacons, PostHog, the Pixel and the lead record all tag through here,
 * so an arm cannot drift between the places we later compare.
 */
export type LpVariant = "A" | "B2";

declare global {
  interface Window {
    __niroLp?: string;
  }
}

/**
 * This visitor's arm. Reads the value the inline script resolved, falling back
 * to the cookie if this runs before that script somehow, and finally to the
 * path. "A" during SSR, which is correct: the static export of / is arm A, and
 * /start overrides on the client the moment the script runs.
 */
export function getLpVariant(): LpVariant {
  if (typeof window === "undefined") return "A";
  const fromScript = window.__niroLp;
  if (fromScript === "A" || fromScript === "B2") return fromScript;
  try {
    const m = document.cookie.match(/(?:^|;\s*)niro_lp=(A|B2)/);
    if (m) return m[1] as LpVariant;
  } catch {
    /* cookies unavailable (rare); fall through to the path */
  }
  try {
    return /^\/start(\/|$)/.test(window.location.pathname) ? "B2" : "A";
  } catch {
    return "A";
  }
}
