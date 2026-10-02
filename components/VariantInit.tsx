/**
 * Landing-page variant capture for the positioning A/B (arm A vs arm B2).
 *
 * Rendered as a plain inline <script> in the document, BEFORE MetaPixel, for
 * the same reason MetaPixel itself is inline: it has to have resolved before
 * `fbq('track','PageView')` runs at HTML-parse time, or the first and most
 * important pixel event of the visit carries no arm.
 *
 * FIRST TOUCH, and deliberately so. The arm is derived from the path on the
 * first page the visitor ever lands on (/start is B2, everything else is A)
 * and then frozen in a 90-day cookie. Someone who lands on /start from an ad
 * and later opens the home page stays B2: they were sold the B2 pitch, so
 * their conversation belongs to B2 however they browse afterwards.
 *
 * A cookie rather than sessionStorage, which is not a style preference. Sept
 * 2026: Instagram's in-app browser on iOS wipes sessionStorage mid-visit
 * without reloading, and three ad leads reached the sheet reading as organic
 * (see lib/analytics.ts). Most of this test's traffic arrives through exactly
 * that browser, and an arm that evaporates halfway through a visit would not
 * just lose data, it would silently move conversions into the wrong arm.
 */
export function VariantInit() {
  const js = `(function(){try{
var m=document.cookie.match(/(?:^|;\\s*)niro_lp=(A|B2)/);
var v=m?m[1]:(/^\\/start(\\/|$)/.test(location.pathname)?'B2':'A');
if(!m){document.cookie='niro_lp='+v+';path=/;max-age=7776000;SameSite=Lax'}
window.__niroLp=v;document.documentElement.setAttribute('data-lp',v);
}catch(e){window.__niroLp='A'}})();`;

  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
