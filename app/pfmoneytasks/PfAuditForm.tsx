"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ds/Input";
import { Icon } from "@/components/ds/Icon";
import { submitSignup, WHATSAPP_CONSENT_VERSION } from "@/components/JoinProvider";
import {
  captureUtm,
  captureAttribution,
  getStoredAttribution,
  newEventId,
  track,
  trackCustom,
} from "@/lib/analytics";
import { startSession, logEvent, dialCode } from "@/lib/track";
import { readPageArm } from "@/lib/abtest";
import { getLpVariant } from "@/lib/variant";
import { validateContact, looksLikeWhatsAppId } from "@/lib/cities";
import { ASSISTANT_WHATSAPP } from "@/lib/config";

/**
 * The free PF audit request on /pfmoneytasks.
 *
 * The lead is written to the sheet BEFORE WhatsApp opens, never after (the
 * site-wide rule): the button is a real wa.me link, and its click handler
 * validates, banks the row with keepalive, and only then lets the link go.
 * A visitor who never presses send in WhatsApp is still a lead we can call.
 *
 * Three questions (account, claim stage, rough balance), each with a
 * "not sure", then name and WhatsApp number. Nothing sensitive is asked here:
 * no UAN, no password, no OTP, no documents. Other India needs are found
 * later, in the WhatsApp thread, not on this form.
 *
 * Analytics: pf_audit_handoff fires only for a valid request that opens
 * WhatsApp. It is a handoff, not a completed audit. No phone number and no
 * account answer goes to analytics; they live in the lead row only.
 */

/** Country codes, Gulf first because that is where the campaign runs. North
 *  America stays in the list: the ads exclude it, but a visitor from there
 *  must still be able to give a number we can message. Each code carries the
 *  example shown as the placeholder, so the hint always matches the code. */
const DIALS: { code: string; short: string; example: string }[] = [
  { code: "+971", short: "UAE", example: "50 123 4567" },
  { code: "+966", short: "SA", example: "50 123 4567" },
  { code: "+974", short: "QA", example: "3312 3456" },
  { code: "+965", short: "KW", example: "5012 3456" },
  { code: "+968", short: "OM", example: "9212 3456" },
  { code: "+973", short: "BH", example: "3612 3456" },
  { code: "+44", short: "UK", example: "7400 123456" },
  { code: "+65", short: "SG", example: "8123 4567" },
  { code: "+61", short: "AU", example: "412 345 678" },
  { code: "+64", short: "NZ", example: "21 123 4567" },
  { code: "+852", short: "HK", example: "5123 4567" },
  { code: "+49", short: "DE", example: "151 2345678" },
  { code: "+353", short: "IE", example: "85 123 4567" },
  { code: "+31", short: "NL", example: "6 1234 5678" },
  { code: "+41", short: "CH", example: "78 123 45 67" },
  { code: "+1", short: "US/CA", example: "415 555 0134" },
  { code: "+91", short: "IN", example: "98765 43210" },
];
const DEFAULT_DIAL = "+971";

const ACCOUNT = ["EPF", "PPF", "Both", "Not sure"];
const STAGE = ["Haven't tried yet", "Tried, it's stuck or rejected", "Not sure"];
const AMOUNT = ["Under ₹2 lakh", "₹2 lakh or more", "Not sure"];

function Choice({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="pf-choice">
      <legend>{legend}</legend>
      <div className="pf-chips" role="radiogroup" aria-label={legend}>
        {options.map((o) => (
          <button
            type="button"
            key={o}
            role="radio"
            aria-checked={value === o}
            className={"pf-chip" + (value === o ? " on" : "")}
            onClick={() => onChange(value === o ? "" : o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** `page` and `placement` say where the form was filled in: the PF page by
 *  default, or the home page's EPFO band, which opens this form in a dialog.
 *  `guessDial` swaps the UAE default for the visitor's time-zone guess. The
 *  PF page leaves it off (its campaign runs in the Gulf, so +971 is always
 *  the starting code); the home page, mostly North American, turns it on. */
export function PfAuditForm({
  page = "/pfmoneytasks/",
  placement = "audit_form",
  guessDial = false,
}: { page?: string; placement?: string; guessDial?: boolean } = {}) {
  const [name, setName] = useState("");
  const [dial, setDial] = useState(DEFAULT_DIAL);
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [stage, setStage] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [eventId] = useState(() => newEventId());

  // This page is reached from ads and links, not through the home page, so
  // it does its own attribution capture: the row has to carry the UTM. With
  // guessDial the country code follows the time-zone guess (dialCode), and
  // stays on the UAE default when the guess is not one of the listed codes.
  useEffect(() => {
    captureUtm();
    captureAttribution();
    startSession();
    if (!guessDial) return;
    const guess = dialCode();
    if (guess && DIALS.some((d) => d.code === guess)) setDial(guess);
  }, [guessDial]);

  const isId = looksLikeWhatsAppId(phone);
  const example = DIALS.find((d) => d.code === dial)?.example || "50 123 4567";
  const summary = [
    account && `Account: ${account}`,
    stage && `Stage: ${stage}`,
    amount && `Balance: ${amount}`,
  ]
    .filter(Boolean)
    .join(". ");
  const message =
    "Hi Niro, I'd like a free PF audit." + (summary ? `\n${summary}.` : "");
  // The assistant line: the audit is task work the assistant scopes.
  const href = `https://wa.me/${ASSISTANT_WHATSAPP}?text=${encodeURIComponent(message)}`;

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (name.trim().length < 2) {
      e.preventDefault();
      setError("Please tell us your name.");
      return;
    }
    const full = isId ? phone.trim() : `${dial} ${phone.trim()}`;
    const { value, error: phoneErr } = validateContact(phone.trim() ? full : "");
    if (!value) {
      e.preventDefault();
      setError(phoneErr || "Please enter your WhatsApp number.");
      return;
    }
    setError("");
    const { pitch, ref } = getStoredAttribution();
    void submitSignup({
      lpVariant: getLpVariant(),
      email: "",
      eventId,
      arm: "A",
      pageArm: readPageArm(),
      pitch,
      ref,
      phone: value,
      name: name.trim(),
      intent: "pf_audit",
      taskText: "Free PF audit" + (summary ? `: ${summary}` : ""),
      taskHandoff: "assistant",
      page,
      consent: WHATSAPP_CONSENT_VERSION,
      consentAt: new Date().toISOString(),
    });
    // A handoff to WhatsApp, not a completed audit. Nothing personal.
    logEvent("pf_audit_handoff", { placement });
    track("Lead", { content_name: "pf_audit" }, eventId);
    trackCustom("StartedConversation", { route: "whatsapp", placement: "pf_audit" });
    setSent(true);
  }

  return (
    <div className="pf-form">
      <Choice legend="Which account?" options={ACCOUNT} value={account} onChange={setAccount} />
      <Choice legend="Where is your claim?" options={STAGE} value={stage} onChange={setStage} />
      <Choice legend="Roughly how much is in it?" options={AMOUNT} value={amount} onChange={setAmount} />

      <div className="pf-field">
        <label htmlFor="pf-name">Your name</label>
        <Input
          id="pf-name"
          autoComplete="given-name"
          placeholder="Arjun"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="pf-field">
        <label htmlFor="pf-phone">Your WhatsApp number</label>
        <div className="phone-row">
          <select
            aria-label="Country code"
            className="ds-input dial-select"
            value={dial}
            disabled={isId}
            onChange={(e) => setDial(e.target.value)}
          >
            {DIALS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} {d.short}
              </option>
            ))}
          </select>
          <Input
            id="pf-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={example}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="pf-error">
          {error}
        </p>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-lg btn-full"
        onClick={onClick}
      >
        Start my free audit on WhatsApp
        <Icon name="message-circle" size={17} />
      </a>
      <p className="pf-fine">
        Continue on WhatsApp with your answers ready to send. We&rsquo;ll
        confirm the records needed and when to expect your audit. We never call
        you unprompted.
      </p>
      {sent && (
        <p className="pf-sent" role="status">
          If WhatsApp didn&rsquo;t open,{" "}
          <a href={href} target="_blank" rel="noopener noreferrer">
            tap here to continue
          </a>
          .
        </p>
      )}
    </div>
  );
}
