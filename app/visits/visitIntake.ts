import { VISIT_CITIES } from "./cities79";

/**
 * The /visits intake, in the same shape as /pf's auditForm: options and
 * validators here, the component in VisitForm.tsx.
 *
 * Step 1 takes name and WhatsApp number and writes the lead. Step 2 asks what
 * the visit is for, which city, and whether this is one thing coming up or an
 * ongoing need. Step 3 is the gate: visits are a paid benefit, so the page
 * does not promise one until the family is a member.
 *
 * Deliberately no date and no time window. Asking for them turned the page
 * into a one-off errand request; a membership sells the standing arrangement,
 * and the actual date is settled in the WhatsApp thread.
 */

export type VisitPurpose =
  | "hospital" | "passport" | "govt" | "bank" | "property" | "home" | "other";

export const PURPOSE_OPTIONS: { value: VisitPurpose; label: string; sub: string }[] = [
  { value: "hospital", label: "Hospital or doctor", sub: "Sit with a parent through a consult, admission or discharge, or carry reports in for a second opinion." },
  { value: "passport", label: "Passport, visa or police verification", sub: "Passport Seva, visa centre, biometrics, or the officer coming to the house." },
  { value: "govt", label: "Government office", sub: "Aadhaar, life certificate, pension, EPFO, sub-registrar." },
  { value: "bank", label: "Bank or insurance branch", sub: "In-person KYC, locker, a signature that needs a witness." },
  { value: "property", label: "Property", sub: "Inspection, tenant handover, meter readings, a locked-up flat checked." },
  { value: "home", label: "Home, repair or staff", sub: "Supervise an install or repair, meet a cook, driver or attendant." },
  { value: "other", label: "Something else", sub: "Tell us in one line and we will say whether a visit is the right answer." },
];

export type VisitTiming = "upcoming" | "ongoing";

export const TIMING_OPTIONS: { value: VisitTiming; label: string; sub: string }[] = [
  {
    value: "upcoming",
    label: "Something specific coming up",
    sub: "One thing already in the diary, or about to be. We settle the day and the time window with you on WhatsApp.",
  },
  {
    value: "ongoing",
    label: "On an ongoing basis",
    sub: "Someone there whenever it comes up through the year: appointments, offices, the flat. No single date.",
  },
];

export type Step2 = {
  purpose: VisitPurpose | "";
  city: string;
  timing: VisitTiming | "";
};
export type Step2Errors = Partial<Record<keyof Step2, string>>;

/** The serviceable city a typed string resolves to, or null.
 *  Matched on the same alias patterns the City summary tab uses, so the
 *  answer here is the answer ops would give. */
export function matchCity(raw: string): { name: string; state: string } | null {
  const t = raw.trim().toLowerCase();
  if (t.length < 2) return null;
  for (const [name, state, alias] of VISIT_CITIES) {
    const hit = alias
      .split("|")
      .some((a) => a === t || (t.length >= 3 && a.startsWith(t)))
      || name.toLowerCase().startsWith(t);
    if (hit) return { name, state };
  }
  return null;
}

export function nameError(raw: string): string | undefined {
  const v = raw.trim();
  if (v.length < 2) return "Please enter your name.";
}

export function validateStep2(s: Step2): Step2Errors {
  const e: Step2Errors = {};
  if (!s.purpose) e.purpose = "Please pick what the visit is for.";
  if (!matchCity(s.city)) {
    e.city = s.city.trim()
      ? "We do not visit this city yet. Try the nearest large city."
      : "Please tell us the city.";
  }
  if (!s.timing) e.timing = "Please tell us when you need this.";
  return e;
}

/** A phone number the backend can store: digits only, no plus. */
export function toE164(full: string, isId: boolean): string {
  return isId ? full : full.replace(/[^\d]/g, "");
}

/** The fields the sheet gets, one column each, so a visit request is
 *  readable without parsing the free-text line. */
export function step2Fields(s: Step2) {
  const city = matchCity(s.city);
  return {
    visit_purpose: PURPOSE_OPTIONS.find((p) => p.value === s.purpose)?.label || "",
    visit_city: city ? city.name : s.city.trim(),
    visit_state: city ? city.state : "",
    visit_timing: TIMING_OPTIONS.find((o) => o.value === s.timing)?.label || "",
  };
}

export function summaryLine(f: ReturnType<typeof step2Fields>): string {
  return [f.visit_purpose, f.visit_city, f.visit_timing].filter(Boolean).join(", ");
}

/** What the member sends us on WhatsApp from the gate. Written as the
 *  member's own message, because that is whose thread it opens in. */
export function whatsappMessage(name: string, f: ReturnType<typeof step2Fields> | null): string {
  const who = name.trim() ? `Hi, this is ${name.trim()}. ` : "Hi. ";
  if (!f) return `${who}I would like to book a Niro Visit.`;
  return (
    `${who}I would like to book a Niro Visit.\n\n` +
    `What for: ${f.visit_purpose}\n` +
    `City: ${f.visit_city}${f.visit_state ? `, ${f.visit_state}` : ""}\n` +
    `When: ${f.visit_timing}\n\n` +
    `Please tell me how to start the membership.`
  );
}
