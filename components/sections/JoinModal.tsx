"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { SORT_OUT_OPTIONS, SORT_OUT_WHO, INDIA_CITIES } from "@/lib/content";
import { dialCode, logEvent } from "@/lib/track";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * The join modal, phone-first.
 *
 * Flow: contact + both cities -> what needs sorting + who it's for -> a held
 * confirmation that hands to a co-founder on WhatsApp.
 *
 * Decisions worth keeping:
 *
 *  1. PHONE, NOT EMAIL. The product runs on WhatsApp, so the phone is the
 *     account. Email drops to optional - it is for receipts once someone pays,
 *     not for starting a conversation. ~70% of leads volunteered a number
 *     anyway. Expect reported conversion to fall; that is the trade.
 *  2. BOTH CITIES. Theirs drives geo segmentation without relying on the
 *     time-zone guess; their family's drives serviceability. The India field
 *     is a datalist, not a dropdown - it suggests without constraining, so the
 *     long tail still reaches the sheet, and the long tail is exactly what
 *     decides which city we open next.
 *  3. NO FREE-TASK PICKER HERE. Sales runs the first-task experience on
 *     WhatsApp. Putting it on the page would have committed us to fulfilling
 *     a free task for every lead at 8-10 leads a day, which is the thing that
 *     breaks in week two.
 *  4. WE WRITE THE LEAD BEFORE THE HANDOFF, at both steps. If the WhatsApp
 *     click were the only capture we would lose everyone who never messages.
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

function Chip({
  label,
  selected,
  onClick,
  multi,
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
        padding: "10px 14px",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        lineHeight: 1.3,
        textAlign: "left",
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

export function JoinModal() {
  const { open, setOpen, step, lead, submitLead, submitNeeds } = useJoin();

  const [error, setError] = useState<string | undefined>();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [ownCity, setOwnCity] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmailField] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const [tasks, setTasks] = useState<string[]>([]);
  const [whoFor, setWhoFor] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "form") return;
    setPhone((cur) => (cur ? cur : dialCode() ? dialCode() + " " : ""));
  }, [step]);

  useEffect(() => {
    if (!open) setError(undefined);
  }, [open]);

  if (!open) return null;

  function toggleTask(t: string) {
    setTasks((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  function onDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = submitLead({
      phone,
      name,
      ownCity,
      city,
      email: showEmail ? email : undefined,
    });
    setError(err || undefined);
  }

  /** The handoff carries who they are and what they want, so a lead never
   *  lands on the founder's line as an unknown number. */
  function founderMessage(): string {
    return [
      `Hi Niro, I'm ${lead?.name || ""}${lead?.ownCity ? ` in ${lead.ownCity}` : ""}.`,
      lead?.city ? `My family is in ${lead.city}.` : "",
      tasks.length ? `I'm looking to sort out: ${tasks.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
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

        {/* -------------------------------------------- 1. contact + cities */}
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
                WhatsApp number or ID
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

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle} htmlFor="join-own-city">
                Your city of residence
              </label>
              <Input
                id="join-own-city"
                autoComplete="address-level2"
                placeholder="San Francisco"
                value={ownCity}
                onChange={(e) => setOwnCity(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="join-city">
                Your family&rsquo;s city in India
              </label>
              <Input
                id="join-city"
                list="india-cities"
                autoComplete="off"
                placeholder="Start typing - Bengaluru, Noida&hellip;"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {/* A datalist rather than a select: it autocompletes the common
                  cities but still accepts anything typed, so the long tail
                  that decides our next city still reaches the sheet. */}
              <datalist id="india-cities">
                {INDIA_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {showEmail ? (
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle} htmlFor="join-email">
                  Email{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    (optional)
                  </span>
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
                style={{
                  color: "var(--danger)",
                  fontSize: "var(--text-sm)",
                  margin: "0 0 12px",
                }}
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
              We never ask for your passwords or net-banking logins.
            </p>
          </form>
        )}

        {/* ---------------------------------------------- 2. needs + who for */}
        {step === "qualify" && (
          <div>
            <Eyebrow>Almost there</Eyebrow>
            <h2 style={{ ...h2Style, margin: "10px 0 16px" }}>
              What are you looking to sort out?
            </h2>

            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                marginBottom: 10,
              }}
            >
              Select all that apply
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {SORT_OUT_OPTIONS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  multi
                  selected={tasks.includes(t)}
                  onClick={() => toggleTask(t)}
                />
              ))}
            </div>

            <div style={{ ...labelStyle, marginBottom: 10 }}>Who&rsquo;s it for?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
              {SORT_OUT_WHO.map((w) => (
                <Chip
                  key={w}
                  label={w}
                  selected={whoFor === w}
                  onClick={() => setWhoFor(w)}
                />
              ))}
            </div>

            <Button full onClick={() => submitNeeds(tasks, whoFor)}>
              Done
            </Button>
          </div>
        )}

        {/* ------------------------------------------------ 3. confirmation */}
        {step === "done" && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <Icon name="check-circle" size={34} style={{ color: "var(--brand)" }} />
            </div>
            <h2 style={{ ...h2Style, margin: "0 0 8px" }}>
              Thanks{lead?.name ? `, ${lead.name.split(" ")[0]}` : ""}.
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-body)",
                margin: "0 0 8px",
              }}
            >
              We&rsquo;re onboarding families gradually so every one of them gets
              a manager who actually knows them. We&rsquo;ll reach out shortly on
              WhatsApp to set yours up.
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-body)",
                margin: "0 0 18px",
              }}
            >
              In a hurry, or want to ask something first?
            </p>
            <a
              className="btn btn-primary btn-md btn-full"
              href={whatsappUrl(founderMessage())}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Rebuilt at click time so the ref carries current attribution
                // rather than whatever was set at mount.
                e.currentTarget.href = whatsappUrl(founderMessage());
                logEvent("whatsapp_click", { placement: "join_confirm_founder" });
              }}
            >
              Chat with a co-founder
            </a>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                margin: "12px 0 0",
                textAlign: "center",
              }}
            >
              A co-founder is on the other end for the first two months &mdash; not a support queue.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
