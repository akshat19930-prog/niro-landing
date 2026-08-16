"use client";

import { useEffect } from "react";
import { readPageArm } from "@/lib/abtest";
import { logEvent } from "@/lib/track";

/** Registers the page A/B arm as a PostHog super-property and logs one
 *  `ab_exposure` beacon per session, so every downstream metric (bounce,
 *  CTA-click, join, email) can be split by `page_arm`. */
export function AbExposure() {
  useEffect(() => {
    const arm = readPageArm();
    try {
      window.posthog?.register({ page_arm: arm });
    } catch {
      /* PostHog not loaded yet */
    }
    logEvent("ab_exposure", { page_arm: arm });
  }, []);
  return null;
}
