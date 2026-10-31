/**
 * Hero video A/B (Nov 2026): does the WhatsApp chat clip in the home hero earn
 * its place? "video" keeps it; "none" drops the visual, which on a phone also
 * pulls the next section up.
 *
 * Same mechanics as VariantInit and the old AbInit: an inline script at parse
 * time, so the assigned version paints from the first frame with no flash and
 * no layout shift. 50/50, frozen in a 90-day cookie (a cookie, not storage,
 * because Instagram's in-app browser wipes storage mid-visit). `?hero=video`
 * or `?hero=none` pins a version for QA.
 *
 * Scope: assigned only on the home page, and only for arm A visitors, since
 * /start (B2) shows chat threads, not the clip. A visitor who already has a
 * version keeps it on every page, so every later event carries it. It is
 * stamped as `data-hero` on <html> (the CSS gate in globals.css) and
 * window.__niroHero (read by lib/track.ts and the PostHog loader).
 */
export function HeroInit() {
  const js = `(function(){try{
var q=(location.search.match(/[?&]hero=(video|none)/)||[])[1];
var m=document.cookie.match(/(?:^|;\\s*)niro_hero=(video|none)/);
var v=q||(m&&m[1]);
if(!v&&/^\\/(index\\.html)?$/.test(location.pathname)&&window.__niroLp==='A'){v=Math.random()<0.5?'video':'none'}
if(v){if(q||!m){document.cookie='niro_hero='+v+';path=/;max-age=7776000;SameSite=Lax'}
window.__niroHero=v;document.documentElement.setAttribute('data-hero',v)}
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
