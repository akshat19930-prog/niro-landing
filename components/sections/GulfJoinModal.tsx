"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import {
  GULF_QUALIFY_TASKS,
  GULF_QUALIFY_WHO,
  GULF_QUALIFY_URGENCY,
} from "@/lib/content";

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

/** Tap-to-select pill (mirrors the main JoinModal chip). */
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
 * Gulf join modal — email → dual-sided qualifiers → confirmation.
 *
 * Reuses the main site's qualifier flow (adapted for the Gulf/dual context:
 * household here + parents in India, no plan question since /gulf is a single
 * $149 SKU). The confirmation is a plain thank-you: per the build brief, /gulf
 * is a dead end for this split test — no referral link, no waitlist-position
 * number, no share loop. We keep the optional WhatsApp number, the qualifier
 * flow's highest-intent signal.
 */
export function GulfJoinModal() {
  const { open, setOpen, step, email, setEmail, submitEmail, submitQualifiers, submitPhone } =
    useJoin();

  const [error, setError] = useState<string | undefined>();

  const [tasks, setTasks] = useState<string[]>([]);
  const [whoFor, setWhoFor] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [phoneAdded, setPhoneAdded] = useState(false);

  useEffect(() => {
    if (!open || step !== "form") return;
    const t = setTimeout(() => {
      const el = document.getElementById("gulf-email-input") as HTMLInputElement | null;
      el?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [open, step]);

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
        : { tasks, whoFor, urgency, plan: null }
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
      aria-label="Get early access"
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
            <h2 style={{ ...h2Style, margin: "14px 0 10px" }}>Get early access</h2>
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 24px" }}>
              First task free — no card to join. Just your email to hold your family&apos;s place.
            </p>
            <form onSubmit={onEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input
                id="gulf-email-input"
                label="Email"
                type="email"
                placeholder="you@email.com"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" size="lg" full>
                Get Early Access
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
              A few taps so your contact is ready for you. Optional - skip anytime.
            </p>

            <Question label="What should we handle first?">
              {GULF_QUALIFY_TASKS.map((t) => (
                <Chip key={t} label={t} multi selected={tasks.includes(t)} onClick={() => toggleTask(t)} />
              ))}
            </Question>

            <Question label="Who&rsquo;s it for?">
              {GULF_QUALIFY_WHO.map((w) => (
                <Chip key={w} label={w} selected={whoFor === w} onClick={() => setWhoFor(w)} />
              ))}
            </Question>

            <Question label="When do you need it?">
              {GULF_QUALIFY_URGENCY.map((u) => (
                <Chip key={u} label={u} selected={urgency === u} onClick={() => setUrgency(u)} />
              ))}
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
            <h2 style={{ ...h2Style, margin: "0 0 10px" }}>You&apos;re on the list</h2>
            <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", lineHeight: 1.6, margin: "0 0 20px" }}>
              We&apos;ll be in touch as we open up early access in your city. Want your first task
              started sooner? Add your WhatsApp number and we&apos;ll reach out.
            </p>

            {phoneAdded ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <Icon name="check-circle" size={16} /> Got it - we&apos;ll WhatsApp you shortly.
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
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
          </Card>
        )}
      </div>
    </div>
  );
}
