/**
 * The free PF audit form's rules, kept free of React so they can be read and
 * checked on their own: the options, the validation, the routing flags stored
 * on the lead, and the plain-text summary that sales and the WhatsApp prefill
 * read. PfAuditForm.tsx is only the UI around this.
 *
 * Nothing here collects a password or any other credential, and nothing here
 * goes to analytics except the audit method and the derived routing flag.
 */

export type SimActive = "yes" | "no" | "not_sure";
export type AuditMethod = "screenshots" | "readonly_credentials" | "video_call";

export const AMOUNT_OPTIONS: { value: string; label: string }[] = [
  { value: "Under ₹1L", label: "Under ₹1L" },
  { value: "₹1-5L", label: "₹1-5L" },
  { value: "₹5-15L", label: "₹5-15L" },
  { value: "₹15L+", label: "₹15L+" },
  { value: "Not sure", label: "Not sure" },
];

export const SIM_OPTIONS: { value: SimActive; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
];

export const UAN_OPTIONS: { value: "yes" | "no"; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const METHOD_OPTIONS: { value: AuditMethod; label: string; sub: string; badge?: string }[] = [
  {
    value: "screenshots",
    label: "I’ll share screenshots",
    sub: "I’ll log in myself and send the screens you ask for.",
  },
  {
    value: "readonly_credentials",
    label: "I’ll share read-only access for a short while",
    sub: "Completely safe: you can only view the record. Nothing can be withdrawn, changed, or moved without an OTP sent to your own phone.",
  },
  {
    value: "video_call",
    label: "Guide me on a 15-min video call",
    sub: "Walk me through it live. Best if I’ve lost my login or my Indian number is inactive.",
    badge: "easiest",
  },
];

export type Step2 = {
  amount: string;
  sim: SimActive | "";
  hasUan: "yes" | "no" | "";
  uan: string;
  method: AuditMethod | "";
};

export type Step2Errors = Partial<Record<keyof Step2, string>>;

/** A UAN is exactly 12 digits. Spaces are allowed while typing and dropped. */
export function normaliseUan(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function uanError(raw: string): string | undefined {
  const v = normaliseUan(raw);
  if (!v) return undefined; // optional
  return /^\d{12}$/.test(v) ? undefined : "A UAN is exactly 12 digits.";
}

export function nameError(raw: string): string | undefined {
  return raw.trim().length < 2 ? "Please tell us your full name." : undefined;
}

export function validateStep2(s: Step2): Step2Errors {
  const e: Step2Errors = {};
  if (!s.amount) e.amount = "Please pick one. Not sure is fine.";
  if (!s.sim) e.sim = "Please pick one.";
  if (!s.hasUan) e.hasUan = "Please pick one.";
  if (s.hasUan === "yes") {
    const u = uanError(s.uan);
    if (u) e.uan = u;
  }
  if (!s.method) e.method = "Please choose how we should audit your account.";
  return e;
}

/** Phone to E.164: "+" and digits only. A WhatsApp ID (not a number) is kept
 *  as typed, since it has no E.164 form. */
export function toE164(full: string, isId: boolean): string {
  if (isId) return full.trim();
  return "+" + full.replace(/[^\d]/g, "");
}

/** The routing flags stored on the lead (snake_case, as the brief names them). */
export function step2Fields(s: Step2) {
  const has_uan = s.hasUan === "yes";
  const uan = has_uan && normaliseUan(s.uan) ? normaliseUan(s.uan) : null;
  const india_sim_active = (s.sim || "not_sure") as SimActive;
  return {
    amount_bucket: s.amount,
    india_sim_active,
    has_uan,
    uan,
    audit_method: s.method as AuditMethod,
    // The rescue flow: no UAN to hand, or the OTP number is gone.
    needs_recovery_help: !has_uan || india_sim_active === "no",
  };
}

const METHOD_SHORT: Record<AuditMethod, string> = {
  screenshots: "screenshots",
  readonly_credentials: "read-only access",
  video_call: "video call",
};
const SIM_SHORT: Record<SimActive, string> = { yes: "active", no: "inactive", not_sure: "not sure" };

/** One readable line for the sheet's taskText column and the WhatsApp
 *  prefill. It carries the step-2 answers even before the backend has the
 *  dedicated columns, so nothing is lost in between. */
export function summaryLine(f: ReturnType<typeof step2Fields>): string {
  return [
    `Balance: ${f.amount_bucket}`,
    `Indian number: ${SIM_SHORT[f.india_sim_active]}`,
    `UAN: ${f.has_uan ? (f.uan || "has it") : "no"}`,
    `Audit by: ${METHOD_SHORT[f.audit_method]}`,
    ...(f.needs_recovery_help ? ["Needs recovery help"] : []),
  ].join(". ");
}
