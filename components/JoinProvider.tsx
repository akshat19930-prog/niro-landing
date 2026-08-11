"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  captureUtm,
  captureAttribution,
  assignArm,
  getStoredUtm,
  getStoredAttribution,
  track,
  newEventId,
  type PricingArm,
} from "@/lib/analytics";
import { startSession, registerAnalytics, logEvent } from "@/lib/track";
import {
  WAITLIST_ENDPOINT,
  SITE_ORIGIN,
  FALLBACK_WAITLIST_POSITION,
} from "@/lib/config";

/** Waitlist flow: email → membership → confirmation. (No task step.) */
export type Step = "form" | "plan" | "done";
export type SignupResult = { position: number; referralCode: string };

function slugFromEmail(email: string): string {
  return (
    (email || "friend").split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() ||
    "friend"
  );
}

/** Requires local@domain.tld with a real TLD - rejects "kk@gm", "a@b", trailing
 *  dots, and spaces. Not RFC-exhaustive, but catches the fat-finger junk that a
 *  bare "contains @" check lets through. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Obvious placeholders people type while testing the flow. Kept out of the
 *  waitlist so QA sweeps don't look like real signups. */
const PLACEHOLDER_EMAILS = new Set([
  "john.doe@gmail.com",
  "johndoe@gmail.com",
  "jane.doe@gmail.com",
  "test@test.com",
  "test@gmail.com",
]);
const PLACEHOLDER_DOMAINS = new Set(["example.com", "test.com", "mailinator.com"]);

function isPlaceholderEmail(email: string): boolean {
  const domain = email.split("@")[1] || "";
  return PLACEHOLDER_EMAILS.has(email) || PLACEHOLDER_DOMAINS.has(domain);
}

/** Validate + normalize a raw email. Returns the clean address, or an error
 *  message to show the user. */
export function validateEmail(raw: string): { email?: string; error?: string } {
  const clean = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(clean)) return { error: "Please enter a valid email address." };
  if (isPlaceholderEmail(clean))
    return { error: "That looks like a placeholder - please use your real email." };
  return { email: clean };
}

async function submitSignup(payload: {
  email: string;
  eventId: string;
  arm: PricingArm;
  pitch: string;
  ref: string;
  planId?: string | null;
}): Promise<SignupResult> {
  const fallback: SignupResult = {
    position: FALLBACK_WAITLIST_POSITION,
    referralCode: slugFromEmail(payload.email),
  };
  if (!WAITLIST_ENDPOINT) return fallback;
  try {
    const res = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, utm: getStoredUtm() }),
      keepalive: true,
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as Partial<SignupResult>;
    return {
      position: typeof data.position === "number" ? data.position : fallback.position,
      referralCode: data.referralCode || fallback.referralCode,
    };
  } catch {
    return fallback;
  }
}

type JoinCtx = {
  step: Step;
  setStep: (s: Step) => void;
  /** Whether the join modal is open. */
  open: boolean;
  setOpen: (o: boolean) => void;
  /** Pricing-experiment cell for this visitor (see assignArm). */
  arm: PricingArm;
  /** The captured (normalized) email, shared by the hero form and the modal. */
  email: string;
  setEmail: (e: string) => void;
  /** Confirmation info once the email is submitted. */
  result: SignupResult | null;
  referralUrl: string;
  /** Fires join_initiated and opens the modal at the email step. */
  openForm: () => void;
  /** Validate + capture the email, fire the funnel/pixel events, kick off the
   *  (non-blocking) signup, and advance to the plan step. Returns an error
   *  string to display, or null on success. Used by BOTH the hero inline form
   *  and the modal's email step, so there is one submission and one eventId. */
  submitEmail: (raw: string) => string | null;
  /** Record the chosen plan (or null) and finish. */
  submitPlan: (plan: string | null) => void;
};

const Ctx = createContext<JoinCtx | null>(null);

/** Shares join-flow state (modal open + step + email) across the page, captures
 *  UTM attribution, and assigns the pricing-experiment arm once on first load. */
export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("form");
  const [open, setOpen] = useState(false);
  // "A" until the client effect assigns the real arm; the modal (where the arm
  // matters) opens only on user interaction, well after this runs.
  const [arm, setArm] = useState<PricingArm>("A");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<SignupResult | null>(null);
  const [eventId] = useState(() => newEventId());

  useEffect(() => {
    captureUtm();
    const attr = captureAttribution();
    const assigned = assignArm();
    setArm(assigned);
    registerAnalytics(assigned, attr.pitch);
    startSession();
  }, []);

  // Lock body scroll while the modal is open so the page behind doesn't move.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const referralUrl = useMemo(
    () => (result ? `${SITE_ORIGIN}/?ref=${encodeURIComponent(result.referralCode)}` : ""),
    [result]
  );

  function openForm() {
    logEvent("join_initiated");
    // Reopen at the confirmation if they already joined; otherwise start fresh.
    if (step !== "done") setStep("form");
    setOpen(true);
  }

  function submitEmail(raw: string): string | null {
    const { email: clean, error } = validateEmail(raw);
    if (!clean) return error || "Please enter a valid email address.";
    const { pitch, ref } = getStoredAttribution();
    setEmail(clean);
    logEvent("email_entered");
    track("Lead", { content_name: "waitlist_email", arm, pitch }, eventId);
    // Show the confirmation number instantly and advance - do NOT block the UI
    // on the Apps Script round-trip (302 redirect + cold start can take seconds).
    // The email is still captured; keepalive lets the POST finish in the
    // background even as the user moves through the flow.
    setResult({
      position: FALLBACK_WAITLIST_POSITION,
      referralCode: slugFromEmail(clean),
    });
    void submitSignup({ email: clean, eventId, arm, pitch, ref });
    setStep("plan");
    return null;
  }

  function submitPlan(plan: string | null) {
    const { pitch, ref } = getStoredAttribution();
    if (plan) {
      logEvent("reserve_clicked", { plan: plan });
      track("AddPaymentInfo", { plan_id: plan, arm }, eventId);
    }
    void submitSignup({ email, eventId, arm, pitch, ref, planId: plan });
    setStep("done");
  }

  return (
    <Ctx.Provider
      value={{
        step,
        setStep,
        open,
        setOpen,
        arm,
        email,
        setEmail,
        result,
        referralUrl,
        openForm,
        submitEmail,
        submitPlan,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useJoin(): JoinCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useJoin must be used within JoinProvider");
  return ctx;
}

/** Non-throwing variant for components (e.g. the nav CTA) that may render on a
 *  standalone page without a JoinProvider. Returns null when absent. */
export function useJoinOptional(): JoinCtx | null {
  return useContext(Ctx);
}
