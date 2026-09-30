/**
 * Click-to-chat links to the sales and support lines.
 *
 * Sales and support are two different numbers: everything prospect-facing goes
 * to the sales line, and the footer "Contact us" link to support. Until Sept
 * 2026 there was one number, and every page linked to it with one identical
 * prefill ("Hi Niro, I have a question."), so an inbound
 * chat carried nothing about where it came from - not the page, not the
 * campaign, not the creative. Three leads arrived that way and could not be
 * assigned to a cell.
 *
 * The ref that fixes this used to be appended to the prefilled message. It is
 * not any more. A visitor is shown WhatsApp's "Do you trust this person?"
 * warning about scammers before the thread opens, and was then asked to send
 * "Ref: na · nri_parents_health_v2 · v4" under their own name. Some deleted
 * the line, destroying the attribution it existed for; the rest read it as
 * exactly the kind of thing the warning had just described.
 *
 * The ref now rides on the `whatsapp_click` beacon instead. An inbound chat is
 * reconciled against that beacon on timestamp, which is comfortable at current
 * volume (roughly seven clicks a day).
 */
import { SALES_WHATSAPP } from "./config";
import { getStoredAttribution, getStoredGulfPriceArm, getStoredUtm } from "./analytics";

/** Which landing page the visitor is on, as a short market code. */
function marketCode(path: string): string {
  if (path.startsWith("/gulf")) return "gulf";
  if (path.startsWith("/us")) return "us";
  return "na";
}

/**
 * A compact source tag: market, ad creative, pitch cell, price arm. Only the
 * parts that exist are included, so an organic visitor gets `na` rather than a
 * string of empties. Rides on the `whatsapp_click` beacon; never on the
 * prefilled message.
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

/** The full wa.me URL. Nothing but the opening message goes in the prefill:
 *  whatever we put here, the visitor sends under their own name. Defaults to
 *  the sales line; the footer passes the support number instead. */
export function whatsappUrl(
  message = "Hi Niro, I have a question.",
  phone: string = SALES_WHATSAPP
): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
