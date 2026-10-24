"use client";

import { useEffect, useState } from "react";
import { logEvent } from "@/lib/track";

/**
 * The floating "Get my free EPF audit" bar on phones (/pf).
 *
 * Phones only (the .sticky-cta rule hides it above 640px), and only when it
 * helps:
 *   - not while the hero's own button is on screen, so the first screen does
 *     not show the same button twice;
 *   - not while the audit form is on screen, where it would cover the
 *     questions and the Finish button;
 *   - never again once the form is finished (PfAuditForm fires
 *     "pf-audit-done"), since there is nothing left to ask.
 *
 * Starts hidden and appears on scroll; nothing else on the page waits on it.
 * The tap is logged as pf_cta_click with placement "sticky".
 */
export function PfStickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".pf-hero-btn");
    const form = document.getElementById("audit");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === form) setFormVisible(e.isIntersecting);
      });
    });
    if (hero) io.observe(hero);
    else setHeroVisible(false);
    if (form) io.observe(form);
    const onDone = () => setDone(true);
    window.addEventListener("pf-audit-done", onDone);
    return () => {
      io.disconnect();
      window.removeEventListener("pf-audit-done", onDone);
    };
  }, []);

  const show = !heroVisible && !formVisible && !done;
  return (
    <div className={"sticky-cta pf-sticky" + (show ? " on" : "")} aria-hidden={!show}>
      <a
        href="#audit"
        className="btn btn-primary btn-md btn-full"
        tabIndex={show ? 0 : -1}
        onClick={() => logEvent("pf_cta_click", { placement: "sticky", href: "#audit" })}
      >
        Get my free EPF audit
      </a>
    </div>
  );
}
