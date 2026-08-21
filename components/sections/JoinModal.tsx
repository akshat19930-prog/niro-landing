"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import {
  PLANS,
  QUALIFY_TASKS,
  QUALIFY_WHO,
  QUALIFY_URGENCY,
} from "@/lib/content";
import { FALLBACK_WAITLIST_POSITION } from "@/lib/config";
import { logEvent } from "@/lib/track";

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

/** A tap-to-select pill used across the qualifier questions. */
function Chip({
  label,
  selected,
  onClick,
  multi = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      style={{
        padding: "9px 14px",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        lineHeight: 1.2,
        border: `1.5px solid ${selected ? "var(--brand)" : "var(--border-strong)"}`,
        background: selected ? "var(--brand-soft)" : "transparent",
        color: selected ? "var(--brand)" : "var(--text-body)",
        transition:
          "background var(--dur-fast) var(--ease-calm), border-color var(--dur-fast) var(--ease-calm), color var(--dur-fast) var(--ease-calm)",
      }}
    >
      {label}
    </button>
  );
}

/** A labelled group of chips. */
function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--text-strong)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
    </div>
  );
}

/** The join modal - email → qualifiers (needs + lead quality) → confirmation.
 *  Email capture + submission live in JoinProvider, so the hero inline form and
 *  this modal share one submission and one eventId. */
export function JoinModal() {
  const {
    open,
    setOpen,
    step,
    email,
    setEmail,
    result,
    referralUrl,
    submitEmail,
    submitQualifiers,
    submitPhone,
  } = useJoin();

  const [error, setError] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  // Qualifier answers (all optional).
  const [tasks, setTasks] = useState<string[]>([]);
  const [whoFor, setWhoFor] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  // Optional WhatsApp number on the confirmation.
  const [phone, setPhone] = useState("");
  const [phoneAdded, setPhoneAdded] = useState(false);

  // Plan-lean chips: always show both SKUs — Niro Lite ($55) and Niro Prime
  // ($99) — so the visitor picks a tier (plus a "Not sure yet" escape).
  const planChips = PLANS;

  // Put the cursor in the email field the moment the modal opens at the email step.
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

  function toggleTask(t: string) {
    setTasks((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  function finishQualifiers(skip = false) {
    submitQualifiers(
      skip
        ? { tasks: [], whoFor: null, urgency: null, plan: null }
        : { tasks, whoFor, urgency, plan }
    );
  }

  function onPhoneAdd() {
    submitPhone(phone);
    setPhoneAdded(true);
  }

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      logEvent("referral_copied");
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

        {step === "qualify" && (
          <>
            <Eyebrow>Step 2 of 2</Eyebrow>
            <h2 style={{ ...h2Style, margin: "14px 0 8px" }}>Help us set up your Niro</h2>
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 22px" }}>
              A few taps so your associate is ready for you. Optional &mdash; skip anytime.
            </p>

            <Question label="What would you hand off first?">
              {QUALIFY_TASKS.map((t) => (
                <Chip key={t} label={t} multi selected={tasks.includes(t)} onClick={() => toggleTask(t)} />
              ))}
            </Question>

            <Question label="Who&rsquo;s it for?">
              {QUALIFY_WHO.map((w) => (
                <Chip key={w} label={w} selected={whoFor === w} onClick={() => setWhoFor(w)} />
              ))}
            </Question>

            <Question label="When do you need it?">
              {QUALIFY_URGENCY.map((u) => (
                <Chip key={u} label={u} selected={urgency === u} onClick={() => setUrgency(u)} />
              ))}
            </Question>

            <Question label="Which plan fits your family?">
              {planChips.map((p) => (
                <Chip
                  key={p.id}
                  label={`${p.name} · ${p.price}${p.per}`}
                  selected={plan === p.id}
                  onClick={() => setPlan(plan === p.id ? null : p.id)}
                />
              ))}
              <Chip label="Not sure yet" selected={plan === "unsure"} onClick={() => setPlan(plan === "unsure" ? null : "unsure")} />
            </Question>

            <div style={{ marginTop: 22 }}>
              <Button size="lg" full onClick={() => finishQualifiers(false)}>
                Done
              </Button>
            </div>
            <button
              onClick={() => finishQualifiers(true)}
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
              Skip for now
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
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 20px" }}>
              Want your first task started sooner? Add your WhatsApp number and we&apos;ll
              reach out &mdash; or share your link to move up the list.
            </p>

            {/* Optional WhatsApp number — the highest-intent signal + the handoff
                into the product's own channel. */}
            {phoneAdded ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <Icon name="check-circle" size={16} /> Got it &mdash; we&apos;ll WhatsApp you shortly.
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "stretch" }}>
                <div style={{ flex: 1 }}>
                  <Input
                    type="tel"
                    placeholder="WhatsApp number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    aria-label="WhatsApp number"
                  />
                </div>
                <Button onClick={onPhoneAdd} disabled={phone.replace(/[^\d]/g, "").length < 7}>
                  Notify me
                </Button>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "stretch" }}>
              <div style={{ flex: 1 }}>
                <Input value={referralUrl} readOnly aria-label="Referral link" />
              </div>
              <Button variant="secondary" onClick={copyReferral}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
            <Button
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              full
              onClick={() => logEvent("referral_shared")}
            >
              <Icon name="message-circle" size={18} />
              Share on WhatsApp
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
