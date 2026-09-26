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
import { looksLikeWhatsAppId } from "@/lib/cities";

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

/**
 * ISD codes, ordered by where our leads actually are rather than
 * alphabetically: North America and the Gulf first, then the rest of the
 * English-speaking diaspora, then India for members who are already home.
 * A select rather than a free-text prefix - a mistyped country code is a lead
 * we can never message back.
 */
const DIAL_CODES: { code: string; label: string }[] = [
  { code: "+1", label: "US / Canada +1" },
  { code: "+971", label: "UAE +971" },
  { code: "+966", label: "Saudi Arabia +966" },
  { code: "+974", label: "Qatar +974" },
  { code: "+965", label: "Kuwait +965" },
  { code: "+968", label: "Oman +968" },
  { code: "+973", label: "Bahrain +973" },
  { code: "+44", label: "UK +44" },
  { code: "+353", label: "Ireland +353" },
  { code: "+49", label: "Germany +49" },
  { code: "+31", label: "Netherlands +31" },
  { code: "+41", label: "Switzerland +41" },
  { code: "+61", label: "Australia +61" },
  { code: "+64", label: "New Zealand +64" },
  { code: "+65", label: "Singapore +65" },
  { code: "+852", label: "Hong Kong +852" },
  { code: "+91", label: "India +91" },
];

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
  const { open, setOpen, step, lead, capturePhone, submitLead, submitNeeds } = useJoin();

  const [error, setError] = useState<string | undefined>();
  const [dial, setDial] = useState("+1");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [ownCity, setOwnCity] = useState("");
  const [city, setCity] = useState("");

  const [tasks, setTasks] = useState<string[]>([]);
  const [whoFor, setWhoFor] = useState<string | null>(null);

  // Preselect the country from the visitor's time zone where we can read it;
  // otherwise leave the default. Never overwrites a choice they have made.
  useEffect(() => {
    if (step !== "form") return;
    const guess = dialCode();
    // +91 is deliberately excluded from the auto-guess. Our ads run to North
    // America and the Gulf, so an India time zone is far likelier to be a VPN
    // or a stopover than a member - and +1 is the right default to land on.
    if (guess && guess !== "+91" && DIAL_CODES.some((d) => d.code === guess)) setDial(guess);
  }, [step]);

  useEffect(() => {
    if (!open) setError(undefined);
  }, [open]);

  if (!open) return null;

  // Switching on the input itself, so nobody has to find a toggle.
  const isId = looksLikeWhatsAppId(phone);

  function toggleTask(t: string) {
    setTasks((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  /** The number, on its own. Banked before we ask for anything else. */
  function onPhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = capturePhone(isId ? phone.trim() : `${dial} ${phone}`.trim());
    setError(err || undefined);
  }

  function onDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = submitLead({
      phone: isId ? phone.trim() : `${dial} ${phone}`.trim(),
      name,
      ownCity,
      city,
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
        {step === "phone" && (
          <form onSubmit={onPhoneSubmit}>
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
              Start with your WhatsApp number. We <strong>never</strong> call
              you without you asking us to.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle} htmlFor="join-phone">
                WhatsApp number or ID
              </label>
              <div className="phone-row">
                <select
                  id="join-dial"
                  aria-label="Country code"
                  className="ds-input dial-select"
                  value={dial}
                  disabled={isId}
                  onChange={(e) => setDial(e.target.value)}
                >
                  {DIAL_CODES.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <Input
                  id="join-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="415 555 0134"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {isId && (
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    margin: "7px 0 0",
                  }}
                >
                  Looks like a WhatsApp ID &mdash; we&rsquo;ll use it exactly as
                  you typed it, no country code.
                </p>
              )}
            </div>

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
          </form>
        )}

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
              A few details so your assistant knows who they are helping, and
              where.
            </p>

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
                margin: "0 0 18px",
              }}
            >
              We&rsquo;ll reach out shortly to answer your questions and get you
              started.
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
          </div>
        )}
      </Card>
    </div>
  );
}
