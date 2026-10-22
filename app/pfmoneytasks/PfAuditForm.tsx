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
 * The three questions mirror the PF research sheet (which account, stuck or
 * not tried, rough size), so the audit starts already knowing them. They
 * travel in the row's task text and in the WhatsApp message itself.
 */

const DIALS = ["+1", "+971", "+966", "+974", "+965", "+968", "+973", "+44", "+353", "+49", "+31", "+41", "+61", "+64", "+65", "+852", "+91"];

const ACCOUNT = ["EPF", "PPF", "Both", "Not sure"];
const STATUS = ["Tried, it's stuck", "Haven't tried yet", "Not sure"];
const AMOUNT = ["Under ₹2 lakh", "₹2 lakh or more", "Not sure"];
/* Optional, several allowed. Plants that Niro does more than PF, and hands
   sales a specific opener. Written to the row's tasks column. */
const ELSE = [
  "Parents' health and appointments",
  "Bank or tax paperwork",
  "Property or tenants",
  "Home help and repairs",
  "Travel and visas",
];
const NOTHING_ELSE = "Nothing else right now";

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
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function PfAuditForm() {
  const [name, setName] = useState("");
  const [dial, setDial] = useState("+1");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [also, setAlso] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [eventId] = useState(() => newEventId());

  // This page is reached from ads and links, not through the home page, so
  // it does its own attribution capture: the row has to carry the UTM.
  useEffect(() => {
    captureUtm();
    captureAttribution();
    startSession();
    const guess = dialCode();
    if (guess && DIALS.includes(guess)) setDial(guess);
  }, []);

  const isId = looksLikeWhatsAppId(phone);
  const summary = [
    account && `Account: ${account}`,
    status && `Status: ${status}`,
    amount && `Amount: ${amount}`,
    also.length > 0 && !also.includes(NOTHING_ELSE) && `Also pending: ${also.join(", ")}`,
  ]
    .filter(Boolean)
    .join(". ");
  const message =
    "Hi Niro, I'd like a free PF audit." + (summary ? `\n${summary}.` : "");
  // The assistant line, not sales: the audit is task work the assistant
  // scopes, the same as a first trial task. Sales joins once there is a
  // membership or Lite conversation to have.
  const href = `https://wa.me/${ASSISTANT_WHATSAPP}?text=${encodeURIComponent(message)}`;

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const full = isId ? phone.trim() : `${dial} ${phone.trim()}`;
    const { value, error: phoneErr } = validateContact(phone.trim() ? full : "");
    if (name.trim().length < 2) {
      e.preventDefault();
      setError("Please tell us your name.");
      return;
    }
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
      ...(also.length ? { tasks: also } : {}),
      taskText: "Free PF audit" + (summary ? `: ${summary}` : ""),
      taskHandoff: "assistant",
      page: "/pfmoneytasks/",
      consent: WHATSAPP_CONSENT_VERSION,
      consentAt: new Date().toISOString(),
    });
    logEvent("pf_audit_requested", {
      account: account || "",
      status: status || "",
      amount: amount || "",
      also: also.join("|"),
    });
    track("Lead", { content_name: "pf_audit" }, eventId);
    trackCustom("StartedConversation", { route: "whatsapp", placement: "pf_audit" });
    setSent(true);
  }

  return (
    <div className="pf-form">
      <Choice legend="Which account?" options={ACCOUNT} value={account} onChange={setAccount} />
      <Choice legend="Where are you with it?" options={STATUS} value={status} onChange={setStatus} />
      <Choice legend="Roughly how much is in it?" options={AMOUNT} value={amount} onChange={setAmount} />

      <fieldset className="pf-choice">
        <legend>
          Anything else pending in India? <span className="pf-opt">Optional</span>
        </legend>
        <div className="pf-chips">
          {[...ELSE, NOTHING_ELSE].map((o) => {
            const on = also.includes(o);
            return (
              <button
                type="button"
                key={o}
                aria-pressed={on}
                className={"pf-chip" + (on ? " on" : "")}
                onClick={() =>
                  setAlso((cur) => {
                    if (o === NOTHING_ELSE) return on ? [] : [NOTHING_ELSE];
                    const rest = cur.filter((x) => x !== NOTHING_ELSE);
                    return on ? rest.filter((x) => x !== o) : [...rest, o];
                  })
                }
              >
                {o}
              </button>
            );
          })}
        </div>
      </fieldset>

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
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <Input
            id="pf-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="415 555 0134"
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
        Get my free audit
        <Icon name="message-circle" size={17} />
      </a>
      <p className="pf-fine">
        Opens WhatsApp with your answers already written in. We reply on
        WhatsApp and never call you unprompted.
      </p>
      {sent && (
        <p className="pf-sent" role="status">
          Thanks. If WhatsApp didn&rsquo;t open,{" "}
          <a href={href} target="_blank" rel="noopener noreferrer">
            tap here to send your request
          </a>
          .
        </p>
      )}
    </div>
  );
}
