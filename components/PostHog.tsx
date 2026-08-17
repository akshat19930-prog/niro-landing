"use client";

import Script from "next/script";
import { POSTHOG_KEY, POSTHOG_HOST } from "@/lib/config";

/**
 * PostHog loader — heatmaps, scrollmaps, session replay, and autocapture.
 * Renders nothing unless NEXT_PUBLIC_POSTHOG_KEY is set. Inputs are masked in
 * replay so the email field is never recorded; anonymous events don't create
 * person profiles (cost + privacy). The pricing arm + pitch are registered as
 * super-properties from JoinProvider so heatmaps/funnels can be split by cell.
 */
export function PostHog() {
  if (!POSTHOG_KEY) return null;

  return (
    <Script id="posthog" strategy="afterInteractive">
      {`
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('${POSTHOG_KEY}',{
          api_host:'${POSTHOG_HOST}',
          capture_pageview:true,
          capture_pageleave:true,
          autocapture:true,
          enable_heatmaps:true,
          person_profiles:'identified_only',
          session_recording:{ maskAllInputs:true },
          loaded:function(ph){try{var m=document.cookie.match(/(?:^|;\\s*)niro_pg=(control|reposition)/);ph.register({page_arm:m?m[1]:'control'});}catch(e){}}
        });
      `}
    </Script>
  );
}
