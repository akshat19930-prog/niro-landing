import { META_PIXEL_ID } from "@/lib/config";

/**
 * Meta Pixel loader. Rendered as a plain inline <script> in the document — NOT
 * next/script "afterInteractive" — so `fbq('init')` + `PageView` execute at
 * HTML-parse time, BEFORE React hydration.
 *
 * Why this matters: `landing_page_view` is only counted when this PageView
 * fires. Gating it behind ~400KB of hydrating JS (afterInteractive) meant the
 * pixel didn't fire until ~3-5s into the page on a mid-tier mobile, so every
 * visitor who bounced first was a paid click with no landing_page_view — the
 * click→LPV gap that inflates CPL. Firing at parse time closes that window.
 *
 * The Lead event is still fired from the join flow with an eventID for CAPI
 * de-duplication. The Conversion API itself is server-side and belongs on the
 * waitlist backend that receives the signup POST — see lib/config.ts.
 */
export function MetaPixel() {
  if (!META_PIXEL_ID) return null;

  const pixel = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

  return (
    <>
      {/* Inline + synchronous: runs as the parser reaches it, ahead of the
          deferred Next.js chunks, so PageView fires without waiting on hydration. */}
      <script dangerouslySetInnerHTML={{ __html: pixel }} />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
