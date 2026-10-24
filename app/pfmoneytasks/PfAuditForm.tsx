"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  AMOUNT_OPTIONS, SIM_OPTIONS, UAN_OPTIONS, METHOD_OPTIONS,
  type Step2, type Step2Errors, type AuditMethod,
  nameError, uanError, validateStep2, toE164, step2Fields, summaryLine, whatsappMessage,
} from "./auditForm";

/**
 * The free PF audit form, in two steps (Oct 2026).
 *
 * Step 1 is a lead net: name and WhatsApp number only. On submit the lead is
 * written to the sheet (and we wait for it, up to a few seconds) BEFORE step
 * 2 appears, so someone who leaves after step 1 is still a lead sales can
 * reach. Step 2 asks four one-tap questions and POSTs again with the SAME
 * eventId, which the Apps Script treats as "enrich this row", not a new lead.
 *
 * Never collected here: email, a password or any other credential. The UAN
 * (an account number, not a login) is optional.
 *
 * The step-2 answers travel two ways: as dedicated fields (amount_bucket,
 * india_sim_active, has_uan, uan, audit_method, needs_recovery_help) that
 * backend/pf_audit.gs writes to their own columns, and as one readable line
 * in taskText, so they reach the sheet even before that backend file is live.
 *
 * "Finish" opens a WhatsApp chat with the assistant, the answers pre-filled,
 * so the lead starts the conversation; the confirmation keeps a fallback
 * link and says we will message them if they do not.
 *
 * Analytics: signup_step1_completed, signup_audit_method_selected (with the
 * method), signup_step2_completed. pf_audit_handoff keeps its old meaning:
 * the lead opened WhatsApp. No name, number or UAN goes to analytics.
 *
 * `page` and `placement` say where the form was filled in: the PF page by
 * default, or the home page's EPFO band, which opens this form in a dialog.
 * `guessDial` swaps the UAE default for the visitor's time-zone guess. The
 * PF page leaves it off (its campaign runs in the Gulf, so +971 is always
 * the starting code); the home page, mostly North American, turns it on.
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

/**
 * A single-select group with radio semantics: one tab stop (the selected
 * option, or the first), arrow keys move and select, Space/Enter select.
 */
function RadioGroup<T extends string>({
  id,
  label,
  helper,
  options,
  value,
  onChange,
  error,
  variant = "chips",
}: {
  id: string;
  label: string;
  helper?: React.ReactNode;
  options: { value: T; label: string; sub?: string; badge?: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
  variant?: "chips" | "cards";
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusIdx = Math.max(0, options.findIndex((o) => o.value === value));
  function onKey(e: React.KeyboardEvent, i: number) {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!next) return;
    e.preventDefault();
    const j = (i + next + options.length) % options.length;
    onChange(options[j].value);
    refs.current[j]?.focus();
  }
  const describedBy = [helper ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="pf-choice">
      <div className="pf-q" id={`${id}-label`}>{label}</div>
      {helper && <p className="pf-help" id={`${id}-help`}>{helper}</p>}
      <div
        className={variant === "cards" ? "pf-methods" : "pf-chips"}
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        aria-required="true"
        aria-invalid={error ? true : undefined}
      >
        {options.map((o, i) => (
          <button
            type="button"
            key={o.value}
            ref={(el) => { refs.current[i] = el; }}
            role="radio"
            aria-checked={value === o.value}
            tabIndex={i === focusIdx ? 0 : -1}
            className={(variant === "cards" ? "pf-method" : "pf-chip") + (value === o.value ? " on" : "")}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {variant === "cards" ? (
              <>
                <span className="pf-method-t">
                  {o.label}
                  {o.badge && <span className="pf-badge">{o.badge}</span>}
                </span>
                {o.sub && <span className="pf-method-sub">{o.sub}</span>}
              </>
            ) : (
              o.label
            )}
          </button>
        ))}
      </div>
      {error && <p className="pf-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function PfAuditForm({
  page = "/pfmoneytasks/",
  placement = "audit_form",
  guessDial = false,
}: { page?: string; placement?: string; guessDial?: boolean } = {}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // step 1
  const [name, setName] = useState("");
  const [dial, setDial] = useState(DEFAULT_DIAL);
  const [phone, setPhone] = useState("");
  const [nameErr, setNameErr] = useState<string | undefined>();
  const [phoneErr, setPhoneErr] = useState<string | undefined>();
  const [lead, setLead] = useState<{ name: string; phone: string } | null>(null);

  // step 2
  const [s2, setS2] = useState<Step2>({ amount: "", sim: "", hasUan: "", uan: "", method: "" });
  const [errs, setErrs] = useState<Step2Errors>({});

  const [eventId] = useState(() => newEventId());
  const step2Heading = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

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

  useEffect(() => {
    if (step === 2) step2Heading.current?.focus();
    if (step === 3) doneRef.current?.focus();
  }, [step]);

  const isId = looksLikeWhatsAppId(phone);
  const example = DIALS.find((d) => d.code === dial)?.example || "50 123 4567";

  function checkPhone(): { e164?: string; error?: string } {
    const full = isId ? phone.trim() : `${dial} ${phone.trim()}`;
    const { value, isId: id, error } = validateContact(phone.trim() ? full : "");
    if (!value) return { error: error || "Please enter your WhatsApp number." };
    return { e164: toE164(value, !!id) };
  }

  /** Everything every POST carries, so a step-2 POST can still create the
   *  row if the step-1 POST never arrived. */
  function base(l: { name: string; phone: string }) {
    const { pitch, ref } = getStoredAttribution();
    return {
      lpVariant: getLpVariant(),
      email: "",
      eventId,
      arm: "A" as const,
      pageArm: readPageArm(),
      pitch,
      ref,
      phone: l.phone,
      name: l.name,
      intent: "pf_audit",
      page,
      consent: WHATSAPP_CONSENT_VERSION,
      consentAt: new Date().toISOString(),
    };
  }

  function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    const nErr = nameError(name);
    const p = checkPhone();
    setNameErr(nErr);
    setPhoneErr(p.error);
    if (nErr || !p.e164) return;

    const l = { name: name.trim(), phone: p.e164 };
    setLead(l);
    // The save is SENT before step 2 appears, but not waited for. Waiting
    // meant a 2 to 4 second pause on every submit: the Apps Script round trip
    // alone is 1.3 to 1.7s, and a write adds the lock and a full-tab scan for
    // the eventId. The POST is keepalive, so it completes even if the page is
    // closed, and step 2 re-sends name and number in case it never landed.
    void submitSignup({ ...base(l), taskText: "Free EPF audit: started (step 1 of 2)", signup_step: 1 });
    logEvent("signup_step1_completed", { placement, form: "pf_audit" });
    track("Lead", { content_name: "pf_audit" }, eventId);
    setStep(2);
  }

  function pick<K extends keyof Step2>(k: K, v: Step2[K]) {
    setS2((prev) => ({ ...prev, [k]: v }));
    setErrs((prev) => ({ ...prev, [k]: undefined }));
    if (k === "method") logEvent("signup_audit_method_selected", { placement, method: v as AuditMethod });
  }

  // The WhatsApp message carries the step-2 answers once they are complete,
  // so the assistant can start the audit without re-asking.
  const complete = Object.keys(validateStep2(s2)).length === 0;
  const fields = complete ? step2Fields(s2) : null;
  const line = fields ? summaryLine(fields) : "";
  const message = whatsappMessage(lead?.name || "", fields);
  const waHref = `https://wa.me/${ASSISTANT_WHATSAPP}?text=${encodeURIComponent(message)}`;

  /**
   * "Finish" IS the WhatsApp link, like the original form's button. Its click
   * handler checks the answers and, if they are complete, saves them with a
   * keepalive POST and then lets the link open WhatsApp in the same tap.
   * Opening WhatsApp after awaiting the save would lose the tap's user
   * activation, and iOS Safari then blocks the new tab. The lead is still
   * written before the handoff: the POST is sent before the link navigates,
   * and keepalive carries it even if the page is backgrounded.
   */
  function finish(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!lead) { e.preventDefault(); return; }
    const found = validateStep2(s2);
    setErrs(found);
    if (Object.keys(found).length || !fields) {
      e.preventDefault();
      const first = (["amount", "sim", "hasUan", "uan", "method"] as const).find((k) => found[k]);
      document.getElementById(`pf-${first}-label`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (first === "uan") document.getElementById("pf-uan")?.focus();
      return;
    }
    void submitSignup({
      ...base(lead),
      taskText: `Free EPF audit: ${line}`,
      taskHandoff: "assistant",
      signup_step: 2,
      ...fields,
    });
    logEvent("signup_step2_completed", {
      placement,
      method: fields.audit_method,
      needs_recovery_help: fields.needs_recovery_help,
    });
    logEvent("pf_audit_handoff", { placement });
    trackCustom("StartedConversation", { route: "whatsapp", placement: "pf_audit" });
    // Tells the page's floating CTA there is nothing left to ask.
    window.dispatchEvent(new Event("pf-audit-done"));
    setStep(3);
  }

  if (step === 3) {
    return (
      <div className="pf-form pf-done">
        <span className="pf-done-ico" aria-hidden="true"><Icon name="check" size={22} /></span>
        <p className="pf-done-h" ref={doneRef} tabIndex={-1}>
          You&rsquo;re in. Send the message in WhatsApp to start your free EPF audit.
        </p>
        <p className="pf-sent">
          WhatsApp didn&rsquo;t open?{" "}
          <a href={waHref} target="_blank" rel="noopener noreferrer">
            Tap here to continue
          </a>
          . Or wait, and we&rsquo;ll message you shortly.
        </p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="pf-form">
        <div className="pf-steps" aria-hidden="true">Step 2 of 2</div>
        <h3 className="pf-step-h" ref={step2Heading} tabIndex={-1}>A few quick things</h3>

        <RadioGroup
          id="pf-amount"
          label="Roughly how much do you think is stuck in your EPF?"
          helper="Not sure is fine, that's what the audit is for."
          options={AMOUNT_OPTIONS}
          value={s2.amount}
          onChange={(v) => pick("amount", v)}
          error={errs.amount}
        />

        <RadioGroup
          id="pf-sim"
          label="Is the Indian mobile number linked to your EPF still active?"
          helper="This is the number that receives OTPs. If it's inactive, no problem: we have a workaround."
          options={SIM_OPTIONS}
          value={s2.sim}
          onChange={(v) => pick("sim", v)}
          error={errs.sim}
        />

        <div>
          <RadioGroup
            id="pf-hasUan"
            label="Do you have your UAN number handy?"
            options={UAN_OPTIONS}
            value={s2.hasUan}
            onChange={(v) => pick("hasUan", v)}
            error={errs.hasUan}
          />
          {s2.hasUan === "yes" && (
            <div className="pf-field pf-reveal">
              <label htmlFor="pf-uan" id="pf-uan-label">UAN number <span className="pf-opt">(optional)</span></label>
              <Input
                id="pf-uan"
                inputMode="numeric"
                autoComplete="off"
                placeholder="12 digits"
                maxLength={14}
                value={s2.uan}
                aria-invalid={errs.uan ? true : undefined}
                aria-describedby={errs.uan ? "pf-uan-err" : undefined}
                onChange={(e) => pick("uan", e.target.value)}
                onBlur={() => setErrs((prev) => ({ ...prev, uan: uanError(s2.uan) }))}
              />
              {errs.uan && <p className="pf-error" id="pf-uan-err" role="alert">{errs.uan}</p>}
            </div>
          )}
          {s2.hasUan === "no" && (
            <p className="pf-help pf-reveal" role="status">No problem, we&rsquo;ll find it for you.</p>
          )}
        </div>

        <RadioGroup
          id="pf-method"
          label="How would you like us to audit your account?"
          helper="Whichever is most comfortable. Either way this is read-only: we only ever look, never touch."
          options={METHOD_OPTIONS}
          value={s2.method}
          onChange={(v) => pick("method", v)}
          error={errs.method}
          variant="cards"
        />

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg btn-full"
          onClick={finish}
        >
          Finish
          <Icon name="message-circle" size={17} />
        </a>
        <p className="pf-fine">Finishing opens WhatsApp with your answers, ready to send.</p>
      </div>
    );
  }

  return (
    <form className="pf-form" onSubmit={submitStep1} noValidate>
      <div className="pf-steps" aria-hidden="true">Step 1 of 2</div>
      <h3 className="pf-step-h">Let&rsquo;s start</h3>
      <div className="pf-field">
        <label htmlFor="pf-name">Full name</label>
        <Input
          id="pf-name"
          autoComplete="name"
          placeholder="Arjun Sharma"
          value={name}
          required
          aria-required="true"
          aria-invalid={nameErr ? true : undefined}
          aria-describedby={nameErr ? "pf-name-err" : undefined}
          onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(undefined); }}
          onBlur={() => setNameErr(name ? nameError(name) : undefined)}
        />
        {nameErr && <p className="pf-error" id="pf-name-err" role="alert">{nameErr}</p>}
      </div>
      <div className="pf-field">
        <label htmlFor="pf-phone">Mobile (WhatsApp)</label>
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
            required
            aria-required="true"
            aria-invalid={phoneErr ? true : undefined}
            aria-describedby={phoneErr ? "pf-phone-err" : undefined}
            onChange={(e) => { setPhone(e.target.value); if (phoneErr) setPhoneErr(undefined); }}
            onBlur={() => setPhoneErr(phone ? checkPhone().error : undefined)}
          />
        </div>
        {phoneErr && <p className="pf-error" id="pf-phone-err" role="alert">{phoneErr}</p>}
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full">
        Start my free EPF audit
      </button>
      <p className="pf-fine">
        We&rsquo;ll only use this to run your audit on WhatsApp. No passwords,
        OTPs or documents needed here. We never call you unprompted.
      </p>
    </form>
  );
}
