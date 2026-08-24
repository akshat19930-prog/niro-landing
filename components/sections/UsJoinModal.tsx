"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { dialCode } from "@/lib/track";
import {
  US_QUALIFY_TASKS,
  US_QUALIFY_WHO,
  US_QUALIFY_URGENCY,
  US_PLAN_CHOICES,
} from "@/lib/content";

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

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

/**
 * /us join modal - email -> qualifiers -> confirmation.
 *
 * Unlike the main site (which now runs a single SKU and asks no plan question),
 * this page deliberately DOES ask which membership fits: reading dual-side
 * willingness to pay is the whole point of the North America dual test, and
 * inferring it from signups alone would not separate "wants India" from "wants
 * both". The task list is three India-side and three US-side options for the
 * same reason - the split in the answers is the measurement.
 */
export function UsJoinModal() {
  const { open, setOpen, step, email, setEmail, submitEmail, submitQualifiers, submitPhone } =
    useJoin();

  const [error, setError] = useState<string | undefined>();

  const [tasks, setTasks] = useState<string[]>([]);
  const [whoFor, setWhoFor] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [phoneAdded, setPhoneAdded] = useState(false);

  useEffect(() => {
    if (!open || step !== "form") return;
    const t = setTimeout(() => {
      const el = document.getElementById("us-email-input") as HTMLInputElement | null;
      el?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [open, step]);

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
              First task free - no card to join. Just your email to hold your family&apos;s place.
            </p>
            <form onSubmit={onEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input
                id="us-email-input"
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
              A few taps so your family manager is ready for you. Optional - skip anytime.
            </p>

            <Question label="What would you hand off first?">
              {US_QUALIFY_TASKS.map((t) => (
                <Chip key={t} label={t} multi selected={tasks.includes(t)} onClick={() => toggleTask(t)} />
              ))}
            </Question>

            <Question label="Who&rsquo;s it for?">
              {US_QUALIFY_WHO.map((w) => (
                <Chip key={w} label={w} selected={whoFor === w} onClick={() => setWhoFor(w)} />
              ))}
            </Question>

            <Question label="When do you need it?">
              {US_QUALIFY_URGENCY.map((u) => (
                <Chip key={u} label={u} selected={urgency === u} onClick={() => setUrgency(u)} />
              ))}
            </Question>

            <Question label="Which membership fits your family?">
              {US_PLAN_CHOICES.map((p) => (
                <Chip
                  key={p.id}
                  label={p.label}
                  selected={plan === p.id}
                  onClick={() => setPlan(plan === p.id ? null : p.id)}
                />
              ))}
              <Chip
                label="Not sure yet"
                selected={plan === "unsure"}
                onClick={() => setPlan(plan === "unsure" ? null : "unsure")}
              />
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
            <h2 style={{ ...h2Style, margin: "0 0 8px" }}>You&apos;re on the list</h2>

            {phoneAdded ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 12,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <Icon name="check-circle" size={16} /> Got it - a named manager will WhatsApp you shortly.
              </div>
            ) : (
              <>
                <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 14px" }}>
                  Want your first task started this week? Add your WhatsApp number and a named
                  manager will message you to get going - on us.
                </p>
                <Input
                  id="us-phone-input"
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
                  Only about your Niro - no spam, opt out anytime.
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
