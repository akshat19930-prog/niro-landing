"use client";

import { useEffect, useState } from "react";
import { logEvent } from "@/lib/track";

/**
 * The floating "Schedule a Niro Visit" bar on phones (/visits), the same
 * construct as /pf's PfStickyCta: the top nav carries the CTA on desktop,
 * this carries it on a phone.
 *
 * It shows only when it helps: not while the hero's own button is on screen,
 * and not while the form is on screen, where it would cover the questions and
 * the submit button.
 */
export function VisitStickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".pf-hero-btn");
    const form = document.getElementById("book");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === form) setFormVisible(e.isIntersecting);
      });
    });
    if (hero) io.observe(hero);
    else setHeroVisible(false);
    if (form) io.observe(form);
    return () => io.disconnect();
  }, []);

  const show = !heroVisible && !formVisible;
  return (
    <div className={"sticky-cta pf-sticky" + (show ? " on" : "")} aria-hidden={!show}>
      <a
        href="#book"
        className="btn btn-primary btn-md btn-full"
        tabIndex={show ? 0 : -1}
        onClick={() => logEvent("pf_cta_click", { placement: "sticky", href: "#book" })}
      >
        Schedule a Niro Visit
      </a>
    </div>
  );
}
