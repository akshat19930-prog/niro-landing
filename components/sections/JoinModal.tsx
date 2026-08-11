"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { PLANS, MEMBERSHIP_SINGLE, type Plan } from "@/lib/content";
import { FALLBACK_WAITLIST_POSITION } from "@/lib/config";

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

/** Selectable membership card. */
function PlanCard({ plan, selected, onSelect }: { plan: Plan; selected: boolean; onSelect: () => void }) {
  const dark = plan.highlight;
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      style={{
        position: "relative",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        background: dark ? "var(--forest-700)" : "var(--surface-card)",
        color: dark ? "var(--ivory)" : "var(--text-body)",
        border: `2px solid ${
          selected ? (dark ? "var(--gold-400)" : "var(--brand)") : dark ? "var(--forest-700)" : "var(--border)"
        }`,
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-5)",
        boxShadow: selected ? "var(--shadow-3)" : dark ? "var(--shadow-brand)" : "var(--shadow-2)",
        transition: "border-color var(--dur-fast) var(--ease-calm), box-shadow var(--dur-fast) var(--ease-calm)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: dark ? "var(--gold-300)" : "var(--accent-strong)",
          }}
        >
          {plan.name}
        </div>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${selected ? (dark ? "var(--gold-400)" : "var(--brand)") : "var(--border-strong)"}`,
            background: selected ? (dark ? "var(--gold-400)" : "var(--brand)") : "transparent",
            color: dark ? "var(--forest-950)" : "var(--ivory)",
          }}
        >
          {selected && <Icon name="check" size={12} strokeWidth={3} />}
        </span>
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 600,
            color: dark ? "#fff" : "var(--text-strong)",
            lineHeight: 1,
          }}
        >
          {plan.price}
        </span>
        <span style={{ fontSize: "var(--text-sm)", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
          {plan.per}
        </span>
      </div>
      <div style={{ marginTop: 4, fontSize: "var(--text-sm)", color: dark ? "var(--gold-300)" : "var(--brand)", fontWeight: 500 }}>
        {plan.sub}
      </div>
      {plan.lead && (
        <div style={{ marginTop: 14, fontSize: "var(--text-xs)", fontWeight: 600, color: dark ? "rgba(255,255,255,0.92)" : "var(--text-strong)" }}>
          {plan.lead}
        </div>
      )}
      <ul style={{ listStyle: "none", padding: 0, margin: plan.lead ? "8px 0 0" : "14px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--text-xs)" }}>
            <Icon name="check-circle" size={15} style={{ marginTop: 1, flexShrink: 0, color: dark ? "var(--gold-300)" : "var(--brand)" }} />
            <span style={{ color: dark ? "rgba(255,255,255,0.92)" : "var(--text-body)", lineHeight: 1.4 }}>{f}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

/** The join modal - a focused interstitial (no page-scroll displacement).
 *  Email capture + submission live in JoinProvider, so the hero inline form and
 *  this modal share one submission and one eventId. */
export function JoinModal() {
  const { open, setOpen, step, arm, email, setEmail, result, referralUrl, submitEmail, submitPlan } = useJoin();

  const [error, setError] = useState<string | undefined>();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("prime");
  const [copied, setCopied] = useState(false);

  const plans = arm === "B" ? [MEMBERSHIP_SINGLE] : PLANS;

  // Put the cursor in the email field the moment the modal opens at the email
  // step, so the visitor can type straight away. A tiny delay lets the overlay
  // paint first (and the body scroll-lock settle) before we take focus.
  useEffect(() => {
    if (!open || step !== "form") return;
    const t = setTimeout(() => {
      const el = document.getElementById("email-input") as HTMLInputElement | null;
      el?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [open, step]);

  const waLink = useMemo(() => {
    const text = `I found Niro - they handle my parents' errands, bills, and emergencies in India, over WhatsApp. Thought you'd want this too: ${referralUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [referralUrl]);

  if (!open) return null;

  function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = submitEmail(email);
    setError(err || undefined);
  }

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div
      className="join-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Join the waitlist"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="join-sheet">
        <button className="join-close" aria-label="Close" onClick={() => setOpen(false)}>
          <Icon name="x" size={20} />
        </button>

        {step === "form" && (
          <>
            <Eyebrow>Step 1 of 2</Eyebrow>
            <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>Join the waitlist</h2>
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 24px" }}>
              First task free - no card to join. Just your email to hold your family&apos;s
              place.
            </p>
            <form onSubmit={onEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input
                id="email-input"
                label="Email"
                type="email"
                placeholder="you@email.com"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" size="lg" full>
                Join the waitlist
              </Button>
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              <Icon name="lock" size={14} />
              No payment, ever, to join the list.
            </div>
          </>
        )}

        {step === "plan" && (
          <>
            <Eyebrow>Step 2 of 2</Eyebrow>
            <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>
              {arm === "B" ? "Your Niro membership" : "Choose your membership"}
            </h2>
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 22px" }}>
              {arm === "B"
                ? "No charge today - this just reserves your spot."
                : "No charge today - this just reserves your spot and tells us which fits your family."}
            </p>
            <div
              role="radiogroup"
              style={{
                display: "grid",
                gap: 14,
                gridTemplateColumns: plans.length === 1 ? "1fr" : "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                alignItems: "start",
              }}
            >
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} selected={selectedPlan === plan.id} onSelect={() => setSelectedPlan(plan.id)} />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Button size="lg" full disabled={!selectedPlan} onClick={() => submitPlan(selectedPlan)}>
                Reserve my spot
              </Button>
            </div>
            <button
              onClick={() => submitPlan(null)}
              style={{
                display: "block",
                margin: "14px auto 0",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              I&apos;ll decide later
            </button>
          </>
        )}

        {step === "done" && (
          <Card>
            <span
              style={{
                display: "inline-flex",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--brand-soft)",
                color: "var(--brand)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Icon name="check-circle" size={28} />
            </span>
            <h2 style={{ ...h2Style, margin: "0 0 10px" }}>
              You&apos;re #{(result?.position ?? FALLBACK_WAITLIST_POSITION).toLocaleString()} on the list
            </h2>
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 24px" }}>
              Share with your friends to move up the waitlist - every join with your link
              moves your family up.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "stretch" }}>
              <div style={{ flex: 1 }}>
                <Input value={referralUrl} readOnly aria-label="Referral link" />
              </div>
              <Button variant="secondary" onClick={copyReferral}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
            <Button href={waLink} target="_blank" rel="noopener noreferrer" full>
              <Icon name="message-circle" size={18} />
              Share on WhatsApp
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
