"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { PLANS, MEMBERSHIP_SINGLE, type Plan } from "@/lib/content";
import {
  getStoredUtm,
  getStoredAttribution,
  track,
  newEventId,
  type Utm,
  type PricingArm,
} from "@/lib/analytics";
import { logEvent } from "@/lib/track";
import { WAITLIST_ENDPOINT, SITE_ORIGIN, FALLBACK_WAITLIST_POSITION } from "@/lib/config";

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

function slugFromEmail(email: string): string {
  return (
    (email || "friend").split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() || "friend"
  );
}

/** Requires local@domain.tld with a real TLD - rejects "kk@gm", "a@b", trailing
 *  dots, and spaces. Not RFC-exhaustive, but catches the fat-finger junk that a
 *  bare "contains @" check lets through. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Obvious placeholders people type while testing the flow. Kept out of the
 *  waitlist so QA sweeps don't look like real signups. Match on the whole
 *  address or the domain. */
const PLACEHOLDER_EMAILS = new Set([
  "john.doe@gmail.com",
  "johndoe@gmail.com",
  "jane.doe@gmail.com",
  "test@test.com",
  "test@gmail.com",
]);
const PLACEHOLDER_DOMAINS = new Set(["example.com", "test.com", "mailinator.com"]);

function isPlaceholderEmail(email: string): boolean {
  const domain = email.split("@")[1] || "";
  return PLACEHOLDER_EMAILS.has(email) || PLACEHOLDER_DOMAINS.has(domain);
}

type SignupResult = { position: number; referralCode: string };

async function submitSignup(payload: {
  email: string;
  utm: Utm;
  eventId: string;
  arm: PricingArm;
  /** Ad-matched pitch cell (?v) and referrer (?ref), for pitch + K-factor reads. */
  pitch: string;
  ref: string;
  planId?: string | null;
}): Promise<SignupResult> {
  const fallback: SignupResult = {
    position: FALLBACK_WAITLIST_POSITION,
    referralCode: slugFromEmail(payload.email),
  };
  if (!WAITLIST_ENDPOINT) return fallback;
  try {
    const res = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as Partial<SignupResult>;
    return {
      position: typeof data.position === "number" ? data.position : fallback.position,
      referralCode: data.referralCode || fallback.referralCode,
    };
  } catch {
    return fallback;
  }
}

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

/** The join modal - a focused interstitial (no page-scroll displacement). */
export function JoinModal() {
  const { open, setOpen, step, setStep, arm } = useJoin();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("prime");
  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [eventId] = useState(() => newEventId());

  const plans = arm === "B" ? [MEMBERSHIP_SINGLE] : PLANS;

  const referralUrl = useMemo(
    () => (result ? `${SITE_ORIGIN}/?ref=${encodeURIComponent(result.referralCode)}` : ""),
    [result]
  );
  const waLink = useMemo(() => {
    const text = `I found Niro - they handle my parents' errands, bills, and emergencies in India, over WhatsApp. Thought you'd want this too: ${referralUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [referralUrl]);

  if (!open) return null;

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (isPlaceholderEmail(clean)) {
      setError("That looks like a placeholder - please use your real email.");
      return;
    }
    setError(undefined);
    setEmail(clean); // store the normalized address (trimmed + lowercased)
    const utm = getStoredUtm();
    const { pitch, ref } = getStoredAttribution();
    logEvent("email_entered");
    track("Lead", { content_name: "waitlist_email", arm, pitch }, eventId);
    // Show the confirmation number instantly and advance - do NOT block the UI
    // on the Apps Script round-trip (302 redirect + cold start can take seconds).
    // The email is still captured; keepalive lets the POST finish in the
    // background even as the user moves through the flow.
    setResult({ position: FALLBACK_WAITLIST_POSITION, referralCode: slugFromEmail(clean) });
    void submitSignup({ email: clean, utm, eventId, arm, pitch, ref });
    setStep("plan");
  }

  function finishWithPlan(plan: string | null) {
    const utm = getStoredUtm();
    const { pitch, ref } = getStoredAttribution();
    if (plan) {
      logEvent("reserve_clicked", { plan: plan });
      track("AddPaymentInfo", { plan_id: plan, arm }, eventId);
    }
    void submitSignup({ email, utm, eventId, arm, pitch, ref, planId: plan });
    setStep("done");
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
            <form onSubmit={submitEmail} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input
                id="email-input"
                label="Email"
                type="email"
                placeholder="you@company.com"
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
              <Button size="lg" full disabled={!selectedPlan} onClick={() => finishWithPlan(selectedPlan)}>
                Reserve my spot
              </Button>
            </div>
            <button
              onClick={() => finishWithPlan(null)}
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
