"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";
import { FREE_TASKS, OTHER_ID, SORT_OUT_USAGE, INDIA_CITIES, INTENT_OPTIONS } from "@/lib/content";
import { dialCode, logEvent } from "@/lib/track";
import { SALES_WHATSAPP, ASSISTANT_WHATSAPP, TRIAL_FIRST, TRIALS_OPEN } from "@/lib/config";
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
 *  3. THE FREE TASK IS ASKED FOR HERE, and the last step exists to do it.
 *     This reverses the original decision, which kept the picker off the page
 *     so sales could run the first task on WhatsApp and we would not owe a
 *     free task to every lead at 8-10 a day. The reversal is not a change of
 *     mind about capacity, it is a change in the facts: about 80% of leads
 *     never replied to our opening message, so the tasks were not being run
 *     anyway. The cause is WhatsApp itself. An unknown Indian number messaging
 *     first lands behind a scam warning, aimed at someone who has just handed
 *     over their parents' details. Only two things remove that screen: being
 *     in their contacts, or an Official Business Account. Having the LEAD
 *     open the thread sidesteps it entirely, and opens the 24-hour service
 *     window so the reply can be a real message rather than a template.
 *     So this step's job is not qualification. It is to give someone a reason
 *     to press send.
 *  4. WE WRITE THE LEAD BEFORE THE HANDOFF, at every step. If the WhatsApp
 *     click were the only capture we would lose everyone who never messages,
 *     and "picked a task but never sent it" is the most useful follow-up list
 *     we have.
 *  5. FREE TASKS GO TO THE ASSISTANT, everything else to sales. Two different
 *     jobs: one scopes and delivers a task, the other sells a membership.
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
const DIAL_CODES: { code: string; short: string; example: string }[] = [
  { code: "+1",   short: "US/CA", example: "415 555 0134" },
  { code: "+971", short: "AE",    example: "50 123 4567" },
  { code: "+966", short: "SA",    example: "50 123 4567" },
  { code: "+974", short: "QA",    example: "3312 3456" },
  { code: "+965", short: "KW",    example: "5012 3456" },
  { code: "+968", short: "OM",    example: "9212 3456" },
  { code: "+973", short: "BH",    example: "3612 3456" },
  { code: "+44",  short: "UK",    example: "7400 123456" },
  { code: "+353", short: "IE",    example: "85 123 4567" },
  { code: "+49",  short: "DE",    example: "151 2345678" },
  { code: "+31",  short: "NL",    example: "6 1234 5678" },
  { code: "+41",  short: "CH",    example: "78 123 45 67" },
  { code: "+61",  short: "AU",    example: "412 345 678" },
  { code: "+64",  short: "NZ",    example: "21 123 4567" },
  { code: "+65",  short: "SG",    example: "8123 4567" },
  { code: "+852", short: "HK",    example: "5123 4567" },
  { code: "+91",  short: "IN",    example: "98765 43210" },
];


const labelStyle = {
  display: "block",
  fontSize: "var(--text-sm)",
  fontWeight: 600,
  color: "var(--text-strong)",
  marginBottom: 6,
} as const;

/** "919180581481" -> "+91 91805 81481", so the number a lead copies off the
 *  confirmation reads the way they would write it, and config stays the one
 *  place it is defined. Falls back to a plain +digits string off-pattern. */
function displayNumber(e164: string): string {
  const d = e164.replace(/\D/g, "");
  return d.length === 12 && d.startsWith("91")
    ? `+91 ${d.slice(2, 7)} ${d.slice(7)}`
    : `+${d}`;
}

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
  const { open, setOpen, step, lead, capturePhone, submitLead, submitNeeds, saveTaskDraft } =
    useJoin();

  const [error, setError] = useState<string | undefined>();
  const [dial, setDial] = useState("+1");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [ownCity, setOwnCity] = useState("");
  const [city, setCity] = useState("");

  const [whoFor, setWhoFor] = useState<string | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [taskText, setTaskText] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  /** Debounce handle for the free-text draft save. */
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Which thread we sent them to, so the confirmation can point back at the
   *  right one if WhatsApp never opened (blocked popup, or a desktop with no
   *  WhatsApp installed). */
  const [sentTo, setSentTo] = useState<"assistant" | "membership" | "sales" | null>(null);

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

  const picked = FREE_TASKS.find((t) => t.id === taskId) || null;
  // Picking a listed task is enough on its own: its follow-up detail is asked
  // for but never required, because this is the last tap before the handoff
  // and the assistant can ask the same question in the chat. "Something else"
  // does need the box filled, since an empty one tells the assistant nothing.
  const canStart = !!picked || (taskId === OTHER_ID && taskText.trim().length > 2);

  /**
   * Bank the answer the moment it is given, rather than only when they tap
   * through to WhatsApp.
   *
   * The first version of this step wrote nothing until the handoff, so anyone
   * who chose a task and then closed the modal was discarded: the one piece of
   * data this screen exists to collect, thrown away at the last moment. The
   * row already exists by now (it is written at the phone step), so this is an
   * enrich, and the Apps Script overwrites the same two cells each time.
   *
   * Selecting saves at once; typing is debounced so a sentence is one write
   * rather than forty. Neither sets taskHandoff, which stays blank until they
   * actually tap: "chose a task and never sent it" is only a useful list if
   * the two are recorded separately.
   */
  function pickTask(id: string) {
    setTaskId(id);
    // The detail is answered against a specific question, so it cannot survive
    // a change of task: "cook, Indiranagar" under the physio prompt would be
    // worse than a blank. Clearing on switch costs a retype in the rare case
    // someone goes back and forth, and prevents a wrong brief in every case.
    setTaskText("");
    if (draftTimer.current) clearTimeout(draftTimer.current);
    saveTaskDraft("", id);
  }

  function onTaskText(v: string) {
    setTaskText(v);
    if (draftTimer.current) clearTimeout(draftTimer.current);
    const id = taskId;
    draftTimer.current = setTimeout(() => saveTaskDraft(v.trim(), id), 900);
  }

  /** The message the lead sends us, in their voice, with no encoded payload.
   *  Attribution reconciles on the phone number against the row written
   *  before this link is ever tapped. */
  function waHref(): string {
    const detail = taskText.trim();
    const body = picked
      ? `Hi Niro, I'd like to start my free task: ${picked.waText}.` +
        // The answer to the follow-up question rides along in the same
        // message. The point of asking it on the page is that the assistant
        // opens the chat already knowing it, so leaving it out of the text
        // would collect the detail and then throw it away.
        (detail ? `\n\nDetails: ${detail}` : "")
      : `Hi Niro, here's what's been pending: ${detail}`;
    return `https://wa.me/${ASSISTANT_WHATSAPP}?text=${encodeURIComponent(body)}`;
  }

  /** The number, on its own. Banked before we ask for anything else. */
  function onPhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = capturePhone(isId ? phone.trim() : `${dial} ${phone}`.trim());
    setError(err || undefined);
  }

  const intentOptions = TRIALS_OPEN ? INTENT_OPTIONS : INTENT_OPTIONS.filter((o) => o.route !== "trial");
  const chosen = INTENT_OPTIONS.find((o) => o.id === intent) || null;

  function onDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!TRIAL_FIRST && !chosen) {
      setError("Pick one, so we send you to the right person.");
      return;
    }
    const err = submitLead({
      phone: isId ? phone.trim() : `${dial} ${phone}`.trim(),
      name,
      ownCity,
      city,
      ...(chosen ? { intent: chosen.id } : {}),
    });
    setError(err || undefined);
  }

  /** The conversation routes end in a link, not a button: the lead opens
   *  WhatsApp themselves with the message already written. The row is banked
   *  on the click, before the handoff, like every other handoff on the form.
   *  If the details fail validation the link does nothing and the error shows. */
  function onSalesHandoff(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!chosen || chosen.route !== "sales") return;
    const err = submitLead({
      phone: isId ? phone.trim() : `${dial} ${phone}`.trim(),
      name,
      ownCity,
      city,
      intent: chosen.id,
    });
    if (err) {
      e.preventDefault();
      setError(err);
      return;
    }
    setSentTo("sales");
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
        // flex-start, NOT center. A centred flex item that is taller than its
        // scrolling container overflows in BOTH directions, and the part that
        // goes off the top cannot be scrolled back to: on the last step the
        // heading and the close button were simply unreachable on a short
        // phone. `margin: auto` on the card below still centres it whenever
        // there is room, and collapses to zero when there is not.
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "20px var(--gutter)",
        overflowY: "auto",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 460,
          margin: "auto",
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
              We reply on WhatsApp. We <strong>never</strong> call you
              unprompted.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle} htmlFor="join-phone">
                Your WhatsApp number
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
                      {d.code} {d.short}
                    </option>
                  ))}
                </select>
                <Input
                  id="join-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder={
                    DIAL_CODES.find((d) => d.code === dial)?.example || "98765 43210"
                  }
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
                  Looks like a WhatsApp ID, so we&rsquo;ll use it exactly as
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
            {/* The opt-in. Notice plus an affirmative action (this button), not
                a checkbox: Meta accepts it, and a tick box on the one screen we
                stripped to a single field costs more than it buys. It sits
                under the button because the button IS the affirmative action,
                and the wording has to name us and the channel to count. */}
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                lineHeight: 1.45,
                margin: "10px 0 0",
                textAlign: "center",
              }}
            >
              By continuing you&rsquo;re asking Niro to message you on WhatsApp.
            </p>

            {/* The escape hatch, placed BELOW the opt-in notice on purpose.
                That notice has to stay attached to the button it refers to:
                put a second action between them and "by continuing" stops
                naming one thing, which is what makes the consent record worth
                having. Styled as a link, not a button, so it cannot outweigh
                the field above it.

                It names the hesitation rather than just offering a second
                door. Someone stalling on a phone field is usually not lost,
                they have a question they want answered before they commit. */}
            <div className="join-alt-chat">
              <span>Rather ask a question first?</span>
              <WhatsAppLink
                placement="join_step1"
                message="Hi Niro, I had a question before I sign up."
                showIcon={false}
              >
                Chat with Niro on WhatsApp &rarr;
              </WhatsAppLink>
            </div>
          </form>
        )}

        {step === "form" && (
          <form onSubmit={onDetailsSubmit}>
            <Eyebrow>Get started</Eyebrow>
            <h2 style={{ ...h2Style, margin: "10px 0 6px" }}>
              {TRIAL_FIRST ? "Your first task is on us." : "Almost there."}
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-body)",
                margin: "0 0 18px",
              }}
            >
              {TRIAL_FIRST
                ? "A few details so your assistant knows who they are helping, and where."
                : "A few details so the right person picks this up, and knows where."}
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

            {/* The positioning test's own question. Arm B2 claims buyers stall
                when the pitch implies getting their parents on board, so where
                a lead sits between "my own tasks" and "my family talk to Niro
                themselves" is the thing worth knowing about them. It sits here
                rather than on the last step because that step now has one job,
                getting a task sent, and nothing else belongs in front of it. */}
            {TRIAL_FIRST ? (
              <div style={{ marginBottom: 14 }}>
                <div style={{ ...labelStyle, marginBottom: 8 }}>
                  How do you see yourself using Niro?
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SORT_OUT_USAGE.map((u) => (
                    <Chip
                      key={u}
                      label={u}
                      selected={whoFor === u}
                      onClick={() => setWhoFor(u)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* The routing question. Same control as the task picker so the
                 two steps read as one form. The three conversation routes come
                 first and the trial last, on purpose: the trial is throttled,
                 and the top option is where the unsure land. */
              <div style={{ marginBottom: 14 }}>
                <div style={{ ...labelStyle, marginBottom: 8 }}>
                  What would help most right now?
                </div>
                <div className="join-opts" role="radiogroup" aria-label="What would help most right now?">
                  {intentOptions.map((o) => (
                    <button
                      type="button"
                      key={o.id}
                      role="radio"
                      aria-checked={intent === o.id}
                      className={`join-opt${intent === o.id ? " on" : ""}`}
                      onClick={() => { setIntent(o.id); setError(undefined); }}
                    >
                      <span className="join-radio" aria-hidden="true" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
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

            {chosen && chosen.route === "sales" ? (
              <a
                className="btn btn-primary btn-md btn-full"
                href={`https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(chosen.wa)}`}
                target="_blank"
                rel="noopener"
                style={{ gap: 8 }}
                onClick={onSalesHandoff}
              >
                Continue on WhatsApp
                <Icon name="message-circle" size={17} />
              </a>
            ) : (
              <Button full type="submit">
                Continue
              </Button>
            )}
            {chosen && chosen.route === "sales" && (
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  margin: "9px 0 0",
                }}
              >
                Opens WhatsApp with your message already written in.
              </p>
            )}
          </form>
        )}

        {/* --------------------------------------------- 2. the first task */}
        {step === "qualify" && (
          <div>
            <Eyebrow>Last step</Eyebrow>
            <h2 style={{ ...h2Style, margin: "10px 0 6px" }}>
              Your first task free - what should we do first?
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-body)",
                margin: "0 0 14px",
              }}
            >
              For you or your family in India.
            </p>

            {/* All of them on screen, nothing collapsed. The first version
                opened with a blank text box and hid the list behind a tap,
                which put the HARDEST option (compose a sentence about your
                parents' problems, on a phone, at the end of a form) in front
                of the easiest one. Recognition beats recall here, so the list
                leads and free text is the last option rather than the default.

                This list is the second cut. The first one offered insurance,
                phone safety and support cases, which between them were picked
                zero times in ten days, while "Something else" outdrew every
                named task on the list. These seven are what people typed into
                that box instead. */}
            <div className="join-opts" role="radiogroup" aria-label="Your first task">
              {FREE_TASKS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  role="radio"
                  aria-checked={taskId === t.id}
                  className={`join-opt${taskId === t.id ? " on" : ""}`}
                  onClick={() => pickTask(t.id)}
                >
                  <span className="join-radio" aria-hidden="true" />
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                role="radio"
                aria-checked={taskId === OTHER_ID}
                className={`join-opt${taskId === OTHER_ID ? " on" : ""}`}
                onClick={() => pickTask(OTHER_ID)}
              >
                <span className="join-radio" aria-hidden="true" />
                Something else
              </button>
            </div>

            {/* One question, asked only once a task is picked, and specific to
                that task. A generic "anything else?" box here returned blanks
                and "asap"; a named question returns the thing that otherwise
                costs a WhatsApp round trip, and a round trip across these time
                zones costs a day. Where a locality is needed it asks for an
                AREA or a pin code: most members cannot recall their parents'
                six digits but can name the neighbourhood without looking. */}
            {picked && (
              <div className="join-detail">
                <label htmlFor="join-task-detail">{picked.prompt}</label>
                <input
                  id="join-task-detail"
                  className="ds-input"
                  type="text"
                  autoFocus
                  autoComplete="off"
                  value={taskText}
                  onChange={(e) => onTaskText(e.target.value)}
                />
                <p>Optional. We can sort this out on WhatsApp instead.</p>
              </div>
            )}

            {taskId === OTHER_ID && (
              <>
                <textarea
                  className="ds-input join-task"
                  aria-label="What should we do first?"
                  rows={3}
                  autoFocus
                  value={taskText}
                  onChange={(e) => onTaskText(e.target.value)}
                  placeholder="Mum&rsquo;s EPF claim has been stuck since March and nobody will tell us why&hellip;"
                />
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    lineHeight: 1.45,
                    margin: "7px 0 0",
                  }}
                >
                  No need to get it right. Even &ldquo;something&rsquo;s wrong
                  with Dad&rsquo;s pension&rdquo; gives us enough to start.
                </p>
              </>
            )}

            <a
              className="btn btn-primary btn-md btn-full"
              href={canStart ? waHref() : undefined}
              aria-disabled={!canStart}
              target="_blank"
              rel="noopener"
              style={{
                marginTop: 16,
                gap: 8,
                ...(canStart
                  ? {}
                  : { opacity: 0.34, pointerEvents: "none" as const }),
              }}
              onClick={() => {
                if (!canStart) return;
                setSentTo("assistant");
                // Written before the handoff, never after. A lead who picks a
                // task and then never presses send in WhatsApp is the warmest
                // follow-up list we have, and it only exists if we bank the
                // answer here.
                submitNeeds(taskText.trim(), taskId, whoFor, true);
              }}
            >
              Start my free task
              <Icon name="message-circle" size={17} />
            </a>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                textAlign: "center",
                margin: "9px 0 0",
              }}
            >
              Opens WhatsApp with your Niro Assistant
              {picked ? ", task already written in" : ""}.
            </p>

            {/* Quiet, not competing: one primary action per screen. It is here
                at all because two leads committed to pay before their trial
                task had even finished, so the demand to skip the trial is
                real. Sales, not the assistant: this is a payment conversation. */}
            <div className="join-alt">
              <p>Already know you want Niro?</p>
              <a
                href={`https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(
                  "Hi Niro, I'd like to start a membership."
                )}`}
                target="_blank"
                rel="noopener"
                onClick={() => {
                  setSentTo("membership");
                  submitNeeds(taskText.trim(), taskId, whoFor, false, true);
                }}
              >
                Skip the trial, start a membership &rarr;
              </a>
            </div>
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
              {sentTo
                ? "WhatsApp should have opened with your message ready. Send it and we pick it up from there."
                : "We’ll message you on WhatsApp shortly."}
            </p>

            {/* Two different jobs, depending on who opened the thread.
                If the LEAD messaged us, the scam-warning problem is already
                solved: WhatsApp only shows it on an unexpected inbound message
                from an unknown number, and they started this one. So the only
                thing worth offering is a way back to the thread, for a popup
                blocker or a desktop with no WhatsApp installed.
                If they never tapped, our outbound message is still to come and
                it WILL land behind that warning, so saving the number first is
                the thing that matters. */}
            {sentTo ? (
              <a
                className="btn btn-primary btn-md btn-full"
                href={
                  sentTo === "membership"
                    ? `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(
                        "Hi Niro, I'd like to start a membership."
                      )}`
                    : waHref()
                }
                target="_blank"
                rel="noopener"
                style={{ gap: 8 }}
                onClick={() => logEvent("whatsapp_reopen", { to: sentTo })}
              >
                Didn&rsquo;t open? Tap here
                <Icon name="message-circle" size={17} />
              </a>
            ) : (
              <>
                <a
                  className="btn btn-primary btn-md btn-full"
                  href="/niro.vcf"
                  download="Niro.vcf"
                  onClick={() =>
                    logEvent("save_number_click", { placement: "join_confirm" })
                  }
                >
                  Save our number
                </a>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    margin: "12px 0 0",
                    textAlign: "center",
                  }}
                >
                  So you know it&rsquo;s us when we message.
                </p>
              {/* The number in full, for anyone whose download is blocked (the
                  Instagram and Facebook in-app browsers often are) or who would
                  rather type it. Not a tel: link: tapping that opens the dialer,
                  and the job here is to copy it into contacts. `user-select:all`
                  makes one tap select the whole number instead of a word of it. */}
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                  color: "var(--text-strong)",
                  textAlign: "center",
                  margin: "4px 0 0",
                  userSelect: "all",
                  WebkitUserSelect: "all",
                  whiteSpace: "nowrap",
                }}
              >
                {displayNumber(SALES_WHATSAPP)}
              </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
