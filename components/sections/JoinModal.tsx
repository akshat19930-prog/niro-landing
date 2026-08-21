"use client";

import { useEffect, useState } from "react";
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
import { dialCode } from "@/lib/track";

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
    submitEmail,
    submitQualifiers,
    submitPhone,
  } = useJoin();

  const [error, setError] = useState<string | undefined>();

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

  // On the confirmation step, pre-fill the WhatsApp field with the visitor's
  // country dialling code (from their time zone) so they only type the local
  // number — lowers the friction on the highest-intent signal.
  useEffect(() => {
    if (step !== "done" || phoneAdded) return;
    setPhone((cur) => (cur ? cur : dialCode() ? dialCode() + " " : ""));
  }, [step, phoneAdded]);

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
            <h2 style={{ ...h2Style, margin: "0 0 6px" }}>
              You&apos;re #{(result?.position ?? FALLBACK_WAITLIST_POSITION).toLocaleString()} on the list
            </h2>

            {/* PRIMARY: WhatsApp number — benefit-framed, the highest-intent
                signal + the handoff into the product's own channel. */}
            {phoneAdded ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 14,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <Icon name="check-circle" size={16} /> Got it &mdash; a named associate will WhatsApp you shortly.
              </div>
            ) : (
              <>
                <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 14px" }}>
                  Want your first task started this week? Add your WhatsApp number and a
                  named associate will message you to get going &mdash; on us.
                </p>
                <Input
                  id="phone-input"
                  type="tel"
                  inputMode="tel"
                  placeholder="WhatsApp number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  aria-label="WhatsApp number"
                />
                <div style={{ marginTop: 10 }}>
                  <Button full onClick={onPhoneAdd} disabled={phone.replace(/[^\d]/g, "").length < 8}>
                    Notify me on WhatsApp
                  </Button>
                </div>
                <div style={{ marginTop: 8, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  Only about your Niro &mdash; no spam, opt out anytime.
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
