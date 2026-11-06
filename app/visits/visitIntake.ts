import { VISIT_CITIES } from "./cities79";

/**
 * The /visits intake, in the same shape as /pf's auditForm: options and
 * validators here, the component in VisitForm.tsx.
 *
 * Step 1 takes name and WhatsApp number and writes the lead. Step 2 asks what
 * the visit is for, which city and when. Step 3 is the gate: visits are a paid
 * benefit, so the page does not promise one until the family is a member.
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

export type VisitSlot = "morning" | "afternoon" | "evening" | "any";

export const SLOT_OPTIONS: { value: VisitSlot; label: string }[] = [
  { value: "morning", label: "Morning, 9 to 12" },
  { value: "afternoon", label: "Afternoon, 12 to 4" },
  { value: "evening", label: "Evening, 4 to 7" },
  { value: "any", label: "Any time that day" },
];

export type Step2 = {
  purpose: VisitPurpose | "";
  city: string;
  date: string;
  slot: VisitSlot | "";
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
  if (!s.date) e.date = "Please pick a date.";
  if (!s.slot) e.slot = "Please pick a time window.";
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
    visit_date: s.date,
    visit_slot: SLOT_OPTIONS.find((o) => o.value === s.slot)?.label || "",
  };
}

/** "Wed 11 Nov" rather than "2026-11-11": the ISO value stays in the
 *  visit_date column, this is only what a person reads. */
export function prettyDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  });
}

export function summaryLine(f: ReturnType<typeof step2Fields>): string {
  return [f.visit_purpose, f.visit_city, prettyDate(f.visit_date), f.visit_slot]
    .filter(Boolean)
    .join(", ");
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
    `When: ${prettyDate(f.visit_date)}, ${f.visit_slot}\n\n` +
    `Please tell me how to start the membership.`
  );
}
