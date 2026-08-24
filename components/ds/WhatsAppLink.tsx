"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { logEvent } from "@/lib/track";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";
import { SUPPORT_WHATSAPP } from "@/lib/config";

/**
 * Instrumented click-to-chat link.
 *
 * Every WhatsApp entry point on the site goes through this, so an inbound chat
 * is always reconcilable: the href carries a source ref, and the click drops a
 * `whatsapp_click` beacon (which picks up page, geo, campaign and price arm
 * from logEvent) plus a Meta `Contact` event.
 *
 * `Contact`, deliberately, not `Lead` - the Lead count Meta reports is already
 * inflated ~2.9x against real signups, and folding a second event into it would
 * make that worse rather than better.
 */
export function WhatsAppLink({
  placement,
  children,
  message,
  className,
  style,
  showIcon = true,
}: {
  /** Where on the page this link sits - the whole point of the beacon. */
  placement: string;
  children: React.ReactNode;
  message?: string;
  className?: string;
  style?: React.CSSProperties;
  showIcon?: boolean;
}) {
  // The href depends on sessionStorage - UTM, pitch cell, price arm - none of
  // which exists during the static export, and none of which is necessarily
  // written yet on the first client render either: session init and the price
  // assignment run in their own effects. So build it three times over.
  //   1. after mount, so copy-link and middle-click get a usable URL;
  //   2. on pointerdown/focus, which precede the click, to pick up anything
  //      assigned since;
  //   3. synchronously in onClick, which is the only one that cannot lose a
  //      race with React's render scheduling.
  // Without (3) a Gulf visitor in the $99 arm sent a link tagged $149.
  const [href, setHref] = useState("https://wa.me/" + SUPPORT_WHATSAPP);
  const refresh = () => setHref(whatsappUrl(message));
  useEffect(refresh, [message]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onPointerDown={refresh}
      onFocus={refresh}
      onClick={(e) => {
        e.currentTarget.href = whatsappUrl(message);
        logEvent("whatsapp_click", { placement });
        track("Contact", { placement });
      }}
    >
      {showIcon && (
        <Icon name="message-circle" size={16} style={{ flexShrink: 0 }} aria-hidden />
      )}
      {children}
    </a>
  );
}

/**
 * The quiet version, for under a pricing CTA: a text link, not a button.
 *
 * It has to stay visibly subordinate to the join CTA sitting above it - the
 * page has one conversion goal, and this is an escape hatch for the visitor
 * who would otherwise leave with an unanswered question, not a second offer.
 */
export function AskOnWhatsApp({
  placement,
  tone = "default",
  label = "Rather ask first? WhatsApp us",
}: {
  placement: string;
  tone?: "default" | "inverse";
  label?: string;
}) {
  return (
    <div style={{ marginTop: 12, textAlign: "center" }}>
      <WhatsAppLink
        placement={placement}
        message="Hi Niro, I have a question before joining."
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          color: tone === "inverse" ? "rgba(255,255,255,0.82)" : "var(--text-muted)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
          textDecorationThickness: 1,
        }}
      >
        {label}
      </WhatsAppLink>
    </div>
  );
}

/** The opening line for a pre-signup question. Kept in one place so all three
 *  /us placements arrive in the inbox reading the same way. */
const ASK_MESSAGE =
  "Hi, I came across Niro and wanted to understand whether it could help with something specific.";

/**
 * Two-line secondary CTA: a muted prompt, then the link.
 *
 * The prompt line is what does the work - it names the hesitation ("something
 * specific", "not sure if Niro can handle something") so the link reads as an
 * answer to a question the visitor is already holding, rather than as a second
 * offer competing with Get Early Access. Hence the size and colour step down
 * from the button above it, and no button treatment of its own.
 */
export function AskNiroCta({
  placement,
  prompt,
  label,
  tone = "default",
  align = "left",
  marginTop = 18,
}: {
  placement: string;
  prompt: string;
  label: string;
  tone?: "default" | "inverse";
  align?: "left" | "center";
  marginTop?: number;
}) {
  const inverse = tone === "inverse";
  return (
    <div style={{ marginTop, textAlign: align }}>
      <div
        style={{
          fontSize: "var(--text-sm)",
          lineHeight: 1.4,
          color: inverse ? "rgba(255,255,255,0.62)" : "var(--text-muted)",
          marginBottom: 3,
        }}
      >
        {prompt}
      </div>
      <WhatsAppLink
        placement={placement}
        message={ASK_MESSAGE}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          // A 44px touch target without the link looking like a button: the
          // padding is vertical only, and there is no background. Measured, not
          // guessed - at 6px it came out 34px on a 390px viewport.
          padding: "11px 0",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: inverse ? "var(--gold-300)" : "var(--brand)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
          textDecorationThickness: 1,
        }}
      >
        {/* One flex child, so the arrow sits inside the underline and next to
            the last word rather than floating a gap away from it. */}
        <span>
          {label} <span aria-hidden="true">→</span>
        </span>
      </WhatsAppLink>
    </div>
  );
}
