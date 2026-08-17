/**
 * A/B assignment, fired at HTML-parse time (inline <script>, rendered first in
 * <body>) so the chosen page variant paints from the first frame — no A→B
 * flash. Reads the `niro_pg` cookie or rolls a fresh 50/50, persists it for a
 * year, and stamps `data-pg` on <html> for the CSS variant gate (globals.css).
 */
export function AbInit() {
  const js =
    "(function(){try{" +
    // `?pg=control|reposition` forces a variant (QA/audit) and pins it via cookie.
    "var q=(location.search.match(/[?&]pg=(control|reposition)/)||[])[1];" +
    "var m=document.cookie.match(/(?:^|;\\s*)niro_pg=(control|reposition)/);" +
    "var a=q||(m?m[1]:(Math.random()<0.5?'control':'reposition'));" +
    "if(q||!m){document.cookie='niro_pg='+a+';path=/;max-age=31536000;samesite=lax';}" +
    "document.documentElement.setAttribute('data-pg',a);}" +
    "catch(e){document.documentElement.setAttribute('data-pg','control');}})();";
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
