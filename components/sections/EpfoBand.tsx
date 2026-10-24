"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { logEvent } from "@/lib/track";
import { PfAuditForm } from "@/app/pfmoneytasks/PfAuditForm";
import "@/app/pfmoneytasks/pf.css";

/**
 * The home page's EPFO band, just above pricing (Oct 2026).
 *
 * Small on purpose: the home page sells family care, and this is a door for
 * the visitor who also has PF money stuck in India, not a second pitch. It
 * sits above pricing, and sells the relief (no office visits, no portals),
 * leaving the PF Recovery Credit to the pricing note and /pfmoneytasks.
 *
 * Two actions, one primary. The button opens the free PF audit form from
 * /pfmoneytasks in a dialog, so the lead is written to the sheet (intent
 * pf_audit, page "/") and handed to the assistant line without leaving the
 * page. "Know more" goes to /pfmoneytasks for the full story.
 *
 * Analytics: pf_cta_click with placement home_epfo_open (dialog opened) or
 * home_epfo_more (went to the PF page); the form itself logs
 * pf_audit_handoff with placement home_epfo.
 */
export function EpfoBand() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <section id="epf" data-screen-label="EPFO (B)" className="epfo">
      <div className="epfo-card">
        <span className="epfo-ico" aria-hidden="true">
          <Icon name="wallet" size={22} />
        </span>
        <div className="epfo-copy">
          <Eyebrow>EPF &amp; PF money</Eyebrow>
          <h2 className="epfo-h">Left PF money behind when you moved abroad?</h2>
          <p className="epfo-p">
            ₹9,330 crore sits in inoperative EPF accounts. Some of it may be
            yours. Niro gets it out for you: no office visits, and no logging
            in to frustrating portals again and again.
          </p>
          <div className="epfo-actions">
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={() => {
                logEvent("pf_cta_click", { placement: "home_epfo_open", href: "#epf" });
                setOpen(true);
              }}
            >
              Get my EPF sorted with Niro
            </button>
            <a
              className="epfo-more"
              href="/pfmoneytasks/"
              onClick={() => logEvent("pf_cta_click", { placement: "home_epfo_more", href: "/pfmoneytasks/" })}
            >
              Know more &rarr;
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Free PF audit"
          className="epfo-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <Card style={{ width: "100%", maxWidth: 480, margin: "auto", position: "relative" }}>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              className="epfo-close"
              onClick={() => setOpen(false)}
            >
              <Icon name="x" size={18} />
            </button>
            <Eyebrow>Free PF audit</Eyebrow>
            <h2 className="pf-form-h">Let&rsquo;s start with a free audit</h2>
            <p className="pf-form-sub">
              Three quick questions, then continue on WhatsApp. Your audit
              report, with the exact steps to get your money out, arrives
              within 24 to 48 hours.
            </p>
            <PfAuditForm page="/" placement="home_epfo" />
          </Card>
        </div>
      )}
    </section>
  );
}
