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
  PURPOSE_OPTIONS, SLOT_OPTIONS, matchCity,
  type Step2, type Step2Errors, type VisitPurpose, type VisitSlot,
  nameError, validateStep2, toE164, step2Fields, summaryLine, whatsappMessage,
} from "./visitIntake";

/**
 * The Niro Visit intake, built on /pf's two-step construct.
 *
 * Step 1 is name and WhatsApp number and nothing else: the row is POSTed
 * before step 2 appears, so someone who drops out mid-form is still a lead
 * sales can reach. Step 2 asks the three things ops needs to quote a slot.
 *
 * Step 3 is the gate, not a confirmation. Visits are a paid benefit and the
 * trial does not include them, so the page never promises a visit it cannot
 * deliver: it names the price and hands off to WhatsApp with the visit
 * already written out.
 */

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

/** Same radio semantics as /pf: one tab stop, arrows move and select. */
function RadioGroup<T extends string>({
  id, label, helper, options, value, onChange, error, variant = "chips",
}: {
  id: string;
  label: string;
  helper?: React.ReactNode;
  options: { value: T; label: string; sub?: string }[];
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
                <span className="pf-method-t">{o.label}</span>
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

/** Tomorrow, as the earliest date the picker offers: today is never a real
 *  slot, and three working days is the usual notice. */
function minDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function VisitForm({
  page = "/visits/",
  placement = "visit_form",
  guessDial = true,
}: { page?: string; placement?: string; guessDial?: boolean } = {}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [name, setName] = useState("");
  const [dial, setDial] = useState(DEFAULT_DIAL);
  const [phone, setPhone] = useState("");
  const [nameErr, setNameErr] = useState<string | undefined>();
  const [phoneErr, setPhoneErr] = useState<string | undefined>();
  const [lead, setLead] = useState<{ name: string; phone: string } | null>(null);

  const [s2, setS2] = useState<Step2>({ purpose: "", city: "", date: "", slot: "" });
  const [errs, setErrs] = useState<Step2Errors>({});

  const [eventId] = useState(() => newEventId());
  const step2Heading = useRef<HTMLHeadingElement>(null);
  const gateHeading = useRef<HTMLHeadingElement>(null);

  // Reached from ads, not through the home page, so this page captures its
  // own attribution: the row has to carry the UTM.
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
    if (step === 3) gateHeading.current?.focus();
  }, [step]);

  const isId = looksLikeWhatsAppId(phone);
  const example = DIALS.find((d) => d.code === dial)?.example || "50 123 4567";
  const cityHit = matchCity(s2.city);

  function checkPhone(): { e164?: string; error?: string } {
    const own = /^(\+|00)/.test(phone.trim());
    const full = isId || own ? phone.trim() : `${dial} ${phone.trim()}`;
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
      intent: "niro_visit",
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
    // Sent, not awaited: the Apps Script round trip is 1.3 to 1.7s and the
    // POST is keepalive, so it lands even if the page is closed. Step 2
    // re-sends name and number in case this one never arrived.
    void submitSignup({ ...base(l), taskText: "Niro Visit: started (step 1 of 2)", signup_step: 1 });
    logEvent("signup_step1_completed", { placement, form: "niro_visit" });
    track("Lead", { content_name: "niro_visit" }, eventId);
    setStep(2);
  }

  function pick<K extends keyof Step2>(k: K, v: Step2[K]) {
    setS2((prev) => ({ ...prev, [k]: v }));
    setErrs((prev) => ({ ...prev, [k]: undefined }));
  }

  const complete = Object.keys(validateStep2(s2)).length === 0;
  const fields = complete ? step2Fields(s2) : null;
  const line = fields ? summaryLine(fields) : "";
  const message = whatsappMessage(lead?.name || "", fields);
  const waHref = `https://wa.me/${ASSISTANT_WHATSAPP}?text=${encodeURIComponent(message)}`;

  /** Step 2 saves the visit details and moves to the gate. The visit itself
   *  is never confirmed here: it is confirmed by ops, after the membership. */
  function submitStep2(e: React.FormEvent) {
    e.preventDefault();
    const found = validateStep2(s2);
    setErrs(found);
    if (Object.keys(found).length || !fields || !lead) {
      const first = (["purpose", "city", "date", "slot"] as const).find((k) => found[k]);
      document.getElementById(`vz-${first}-label`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (first === "city") document.getElementById("vz-city")?.focus();
      return;
    }
    void submitSignup({
      ...base(lead),
      taskText: `Niro Visit: ${line}`,
      signup_step: 2,
      ...fields,
    });
    logEvent("signup_step2_completed", { placement, form: "niro_visit", purpose: fields.visit_purpose, city: fields.visit_city });
    setStep(3);
  }

  if (step === 3) {
    return (
      <div className="pf-form vz-gate-wrap">
        <div className="vz-gate">
          <p className="vz-recap">{line}</p>
          <h3 className="vz-gate-h" ref={gateHeading} tabIndex={-1}>
            Your visit is ready. Become a member and we schedule it.
          </h3>
          <p className="vz-gate-p">
            Niro Visits are for members. The free 30-day trial does not include
            them, because a visit puts a person in a cab.
          </p>

          <div className="vz-plan vz-plan-lead">
            <div className="vz-price">$49 <small>a month</small></div>
            <div className="vz-bill">
              Billed $147 every 3 months. Cancel any time and the next quarter
              is not charged.
            </div>
            <div className="vz-perk">Your first visit free, worth $25.</div>
          </div>
          <div className="vz-plan">
            <div className="vz-price">$65 <small>a month</small></div>
            <div className="vz-bill">Month to month, no lock-in. Visits at $25 each.</div>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-lg btn-full"
            onClick={() => {
              logEvent("visit_gate_handoff", { placement, plan: "quarter" });
              trackCustom("StartedConversation", { route: "whatsapp", placement: "visit_gate" });
            }}
          >
            Become a member and schedule this visit
            <Icon name="message-circle" size={17} />
          </a>
          <p className="vz-gate-fine">
            This opens WhatsApp with your visit already written out. Not ready?
            Say so in the same message and we will start your free 30-day trial
            instead, and do everything on this task that can be done remotely.
          </p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <form className="pf-form" onSubmit={submitStep2} noValidate>
        <div className="pf-steps" aria-hidden="true">Step 2 of 2</div>
        <h3 className="pf-step-h" ref={step2Heading} tabIndex={-1}>About the visit</h3>

        <RadioGroup
          id="vz-purpose"
          label="What is the visit for?"
          options={PURPOSE_OPTIONS}
          value={s2.purpose}
          onChange={(v: VisitPurpose) => pick("purpose", v)}
          error={errs.purpose}
          variant="cards"
        />

        <div className="pf-field">
          <label htmlFor="vz-city" id="vz-city-label">Which city do you need it in?</label>
          <Input
            id="vz-city"
            autoComplete="off"
            placeholder="Start typing, e.g. Jaipur"
            value={s2.city}
            aria-invalid={errs.city ? true : undefined}
            aria-describedby={errs.city ? "vz-city-err" : cityHit ? "vz-city-ok" : undefined}
            onChange={(e) => pick("city", e.target.value)}
          />
          {cityHit && (
            <p className="vz-ok" id="vz-city-ok" role="status">
              Yes, we visit in {cityHit.name}, {cityHit.state}.
            </p>
          )}
          {errs.city && <p className="pf-error" id="vz-city-err" role="alert">{errs.city}</p>}
          {!cityHit && !errs.city && (
            <p className="pf-help">We visit in 79 cities. Type the city and we will tell you straight away.</p>
          )}
        </div>

        <div className="pf-field">
          <label htmlFor="vz-date" id="vz-date-label">Which day?</label>
          <Input
            id="vz-date"
            type="date"
            min={minDate()}
            value={s2.date}
            aria-invalid={errs.date ? true : undefined}
            aria-describedby={errs.date ? "vz-date-err" : undefined}
            onChange={(e) => pick("date", e.target.value)}
          />
          {errs.date && <p className="pf-error" id="vz-date-err" role="alert">{errs.date}</p>}
          <p className="pf-help">Most visits need three working days&rsquo; notice.</p>
        </div>

        <RadioGroup
          id="vz-slot"
          label="What time of day?"
          options={SLOT_OPTIONS}
          value={s2.slot}
          onChange={(v: VisitSlot) => pick("slot", v)}
          error={errs.slot}
        />

        <button type="submit" className="btn btn-primary btn-lg btn-full">
          See my visit
        </button>
      </form>
    );
  }

  return (
    <form className="pf-form" onSubmit={submitStep1} noValidate>
      <div className="pf-steps" aria-hidden="true">Step 1 of 2</div>
      <h3 className="pf-step-h">Let&rsquo;s start</h3>
      <div className="pf-field">
        <label htmlFor="vz-name">Full name</label>
        <Input
          id="vz-name"
          autoComplete="name"
          placeholder="Arjun Sharma"
          value={name}
          required
          aria-required="true"
          aria-invalid={nameErr ? true : undefined}
          aria-describedby={nameErr ? "vz-name-err" : undefined}
          onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(undefined); }}
          onBlur={() => setNameErr(name ? nameError(name) : undefined)}
        />
        {nameErr && <p className="pf-error" id="vz-name-err" role="alert">{nameErr}</p>}
      </div>
      <div className="pf-field">
        <label htmlFor="vz-phone">Mobile (WhatsApp)</label>
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
            id="vz-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={example}
            value={phone}
            required
            aria-required="true"
            aria-invalid={phoneErr ? true : undefined}
            aria-describedby={phoneErr ? "vz-phone-err" : undefined}
            onChange={(e) => { setPhone(e.target.value); if (phoneErr) setPhoneErr(undefined); }}
            onBlur={() => setPhoneErr(phone ? checkPhone().error : undefined)}
          />
        </div>
        {phoneErr && <p className="pf-error" id="vz-phone-err" role="alert">{phoneErr}</p>}
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full">
        Schedule a Niro Visit
      </button>
      <p className="pf-fine">
        We use this to send the assistant&rsquo;s details and the report. We
        never call you unprompted.
      </p>
    </form>
  );
}
