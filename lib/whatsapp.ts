/**
 * Click-to-chat links to the support line.
 *
 * The support number is shared with Voya's, and until now every page linked to
 * it with one identical prefill ("Hi Niro, I have a question."), so an inbound
 * chat carried nothing about where it came from - not the page, not the
 * campaign, not the creative. Three leads arrived that way and could not be
 * assigned to a cell.
 *
 * So every link now appends a short readable ref built from what we already
 * store first-touch. It reads as a reference code rather than tracking spam,
 * and it is the only thing that makes a WhatsApp inbound reconcilable against
 * the `whatsapp_click` beacon.
 */
import { SUPPORT_WHATSAPP } from "./config";
import { getStoredAttribution, getStoredGulfPriceArm, getStoredUtm } from "./analytics";

/** Which landing page the visitor is on, as a short market code. */
function marketCode(path: string): string {
  if (path.startsWith("/gulf")) return "gulf";
  if (path.startsWith("/us")) return "us";
  return "na";
}

/**
 * A compact source tag: market, ad creative, pitch cell, price arm. Only the
 * parts that exist are included, so an organic visitor gets `Ref: na` rather
 * than a string of empties.
 */
export function whatsappRef(): string {
  if (typeof window === "undefined") return "";
  const path = window.location.pathname || "/";
  const market = marketCode(path);
  const utm = getStoredUtm() || {};
  const parts: string[] = [market];

  // The creative is the most useful single field - it identifies the ad, and
  // the campaign is derivable from it. Fall back to the campaign if the ad was
  // built without utm_content.
  const creative = utm.utm_content || "";
  const campaign = utm.utm_campaign || "";
  if (creative) parts.push(creative);
  else if (campaign) parts.push(campaign);

  // The pitch cell (?v=1..4) only varies on the main page.
  if (market === "na") {
    const { pitch } = getStoredAttribution();
    if (pitch) parts.push("v" + pitch);
  }

  // The live price A/B, so a Gulf inbound can be read against the arm they saw.
  if (market === "gulf") parts.push("$" + getStoredGulfPriceArm());

  return parts.join(" · ");
}

/** The full wa.me URL, with the opening message and its ref. */
export function whatsappUrl(message = "Hi Niro, I have a question."): string {
  const ref = whatsappRef();
  const text = ref ? `${message}\n\nRef: ${ref}` : message;
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
