"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { TASK_DEFS, SERVICE_CITIES } from "@/lib/content";
import { SUPPORT_WHATSAPP } from "@/lib/config";
import { dialCode } from "@/lib/track";
import { whatsappUrl } from "@/lib/whatsapp";
import { logEvent } from "@/lib/track";

/**
 * The join modal, phone-first.
 *
 * The flow is: phone + name + parents' city -> pick your free first task ->
 * hand off to WhatsApp with everything pre-filled.
 *
 * Three decisions worth keeping:
 *
 *  1. PHONE, NOT EMAIL. The product runs on WhatsApp, so the phone is the
 *     account identifier, and we are now selling on calls rather than
 *     measuring interest. Email drops to optional - we need it for receipts
 *     once someone pays, not to start a conversation. Roughly 70% of leads
 *     were volunteering a number anyway.
 *  2. THE CITY IS A CHECKER, NOT A GATE. Hiding the launch cities behind the
 *     form would be a dark pattern on a trust-constrained product, and the
 *     out-of-area lead is worth more waitlisted-by-city than sold something
 *     we cannot deliver. Both branches capture.
 *  3. WE WRITE THE LEAD BEFORE THE HANDOFF. If the WhatsApp click were the
 *     only capture we would lose everyone who doesn't send the message - and
 *     the handoff carries name, city and task into the prefilled text, which
 *     is what stops leads arriving on the support line unidentifiable.
 */

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

const labelStyle = {
  display: "block",
  fontSize: "var(--text-sm)",
  fontWeight: 600,
  color: "var(--text-strong)",
  marginBottom: 6,
} as const;

/** Fisher-Yates, seeded per visitor at mount. The first-task cards are order-
 *  randomized per the brief, so position bias doesn't masquerade as preference. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function JoinModal() {
  const { open, setOpen, step, setStep, lead, cityMatch, submitLead, submitFirstTask } =
    useJoin();

  const [error, setError] = useState<string | undefined>();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmailField] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const [picked, setPicked] = useState<string | null>(null);
  const [ownTask, setOwnTask] = useState("");

  // Randomized once per mount, not per render.
  const tasks = useMemo(() => shuffle(TASK_DEFS), []);

  // Prefill the dial code from the visitor's time zone so the number they type
  // is complete enough to message.
  useEffect(() => {
    if (step !== "form") return;
    setPhone((cur) => (cur ? cur : dialCode() ? dialCode() + " " : ""));
  }, [step]);

  useEffect(() => {
    if (!open) setError(undefined);
  }, [open]);

  if (!open) return null;

  const served = cityMatch?.served === true;
  const chosenTask = picked === "__own" ? ownTask.trim() : picked;

  function onDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = submitLead({ phone, name, city, email: showEmail ? email : undefined });
    setError(err || undefined);
  }

  function onTaskSubmit() {
    if (!chosenTask) return;
    submitFirstTask(chosenTask);
  }

  /** The handoff. Everything the founder needs is in the message, so the lead
   *  never lands on the support line as an unknown number. */
  function waMessage(): string {
    const parts = [
      `Hi Niro, I'm ${lead?.name || ""}.`,
      lead?.city ? `My family is in ${lead.city}.` : "",
      chosenTask ? `I'd like my free first task: ${chosenTask}` : "",
    ].filter(Boolean);
    return parts.join(" ");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Join Niro"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(12,31,24,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px var(--gutter)",
        overflowY: "auto",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 460,
          background: "var(--surface-card)",
          padding: "var(--space-5)",
          position: "relative",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 6,
            lineHeight: 0,
          }}
        >
          <Icon name="x" size={20} />
        </button>

        {/* ---------------------------------------------- 1. details */}
        {step === "form" && (
          <form onSubmit={onDetailsSubmit}>
            <Eyebrow>Get started</Eyebrow>
            <h2 style={{ ...h2Style, margin: "10px 0 6px" }}>
              Your first task is on us.
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-body)",
                margin: "0 0 18px",
              }}
            >
              Tell us where to reach you and where your family is. No card, and
              nothing to install.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle} htmlFor="join-phone">
                WhatsApp number
              </label>
              <Input
                id="join-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+1 415 555 0134"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle} htmlFor="join-name">
                Your name
              </label>
              <Input
                id="join-name"
                autoComplete="given-name"
                placeholder="Arjun"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="join-city">
                Which city is your family in?
              </label>
              <Input
                id="join-city"
                autoComplete="off"
                placeholder="Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {showEmail ? (
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle} htmlFor="join-email">
                  Email <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                </label>
                <Input
                  id="join-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmailField(e.target.value)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowEmail(true)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  marginBottom: 14,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-muted)",
                  textDecoration: "underline",
                }}
              >
                Add an email as well
              </button>
            )}

            {error && (
              <p
                role="alert"
                style={{ color: "var(--danger)", fontSize: "var(--text-sm)", margin: "0 0 12px" }}
              >
                {error}
              </p>
            )}

            <Button full type="submit">
              Continue
            </Button>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                margin: "12px 0 0",
                textAlign: "center",
              }}
            >
              We never ask for passwords or OTPs. Ever.
            </p>
          </form>
        )}

        {/* ------------------------------------------- 2. first task */}
        {step === "qualify" && (
          <div>
            <Eyebrow>{served ? "You're in a city we serve" : "Pick your first task"}</Eyebrow>
            <h2 style={{ ...h2Style, margin: "10px 0 6px" }}>
              What should we take off your plate first?
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-body)",
                margin: "0 0 16px",
              }}
            >
              {served
                ? `We're live in ${cityMatch?.city}. Choose one and we'll start on it - free.`
                : "Tell us what you need most. We'll use it to decide which city we open next."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {tasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`task-card${picked === t.label ? " task-card-on" : ""}`}
                  onClick={() => setPicked(t.label)}
                >
                  <Icon name={t.icon} size={22} style={{ flexShrink: 0, color: "var(--brand)" }} />
                  <span>
                    <span style={{ display: "block", fontWeight: 600, color: "var(--text-strong)", fontSize: "var(--text-sm)" }}>
                      {t.label}
                    </span>
                    <span style={{ display: "block", fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {t.note}
                    </span>
                  </span>
                </button>
              ))}
              <button
                type="button"
                className={`task-card${picked === "__own" ? " task-card-on" : ""}`}
                onClick={() => setPicked("__own")}
              >
                <Icon name="message-circle" size={22} style={{ flexShrink: 0, color: "var(--brand)" }} />
                <span style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: "var(--text-sm)" }}>
                  Something else
                </span>
              </button>
            </div>

            {picked === "__own" && (
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle} htmlFor="join-own-task">
                  What do you need done?
                </label>
                <Input
                  id="join-own-task"
                  placeholder="Sort out Dad's electricity bill"
                  value={ownTask}
                  onChange={(e) => setOwnTask(e.target.value)}
                />
              </div>
            )}

            <Button full onClick={onTaskSubmit} disabled={!chosenTask}>
              Continue
            </Button>
          </div>
        )}

        {/* ------------------------------------------ 3. confirmation */}
        {step === "done" && (
          <div>
            {served ? (
              <>
                <div style={{ marginBottom: 12 }}>
                  <Icon name="check-circle" size={34} style={{ color: "var(--brand)" }} />
                </div>
                <h2 style={{ ...h2Style, margin: "0 0 8px" }}>
                  You&rsquo;re in, {lead?.name?.split(" ")[0]}.
                </h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-body)", margin: "0 0 18px" }}>
                  Send us one message and we&rsquo;ll pick up your first task
                  today. We&rsquo;ll set up your family group and introduce your
                  manager by name and photo.
                </p>
                <a
                  className="btn btn-primary btn-md btn-full"
                  href={whatsappUrl(waMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Rebuild at click time so the ref carries the latest
                    // attribution rather than whatever was current at mount.
                    e.currentTarget.href = whatsappUrl(waMessage());
                    logEvent("whatsapp_click", { placement: "join_confirm" });
                  }}
                >
                  Start on WhatsApp
                </a>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: "12px 0 0", textAlign: "center" }}>
                  Or save {SUPPORT_WHATSAPP.replace(/^(\d{2})(\d+)$/, "+$1 $2")} and message us any time.
                </p>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <Icon name="map-pin" size={32} style={{ color: "var(--accent-strong)" }} />
                </div>
                <h2 style={{ ...h2Style, margin: "0 0 8px" }}>
                  We&rsquo;re not in {lead?.city} yet.
                </h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-body)", margin: "0 0 14px" }}>
                  We&rsquo;d rather tell you now than promise something we
                  can&rsquo;t do well. You&rsquo;re on the list, and we open new
                  cities where our members&rsquo; families already are &mdash; so
                  your answer genuinely moves {lead?.city} up it.
                </p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-body)", margin: "0 0 18px" }}>
                  Today we&rsquo;re live in{" "}
                  <strong>
                    {SERVICE_CITIES.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}
                  </strong>
                  . We&rsquo;ll message you the week we reach yours.
                </p>
                <Button full variant="secondary" onClick={() => setOpen(false)}>
                  Got it
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
