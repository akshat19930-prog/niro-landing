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
  assignGulfPriceArm,
  getStoredGulfPriceArm,
  getStoredUtm,
  getStoredAttribution,
  track,
  newEventId,
  type PricingArm,
} from "@/lib/analytics";
import { startSession, registerAnalytics, logEvent, getGeo } from "@/lib/track";
import { readPageArm } from "@/lib/abtest";
import { matchCity, validatePhone, type CityMatch } from "@/lib/cities";
import {
  WAITLIST_ENDPOINT,
  SITE_ORIGIN,
  FALLBACK_WAITLIST_POSITION,
} from "@/lib/config";

/** Waitlist flow: email → qualifiers (needs + lead quality) → confirmation. */
export type Step = "form" | "qualify" | "done";
export type SignupResult = { position: number; referralCode: string };
/** Post-signup qualifier answers — all optional, tap-captured. */
export type Qualifiers = {
  tasks: string[];
  whoFor: string | null;
  urgency: string | null;
  plan: string | null;
};

function slugFromName(name: string): string {
  return (
    (name || "friend").split(/\s+/)[0].replace(/[^a-z0-9]/gi, "").toLowerCase() ||
    "friend"
  );
}

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
  pageArm: string;
  pitch: string;
  ref: string;
  planId?: string | null;
  tasks?: string[];
  whoFor?: string | null;
  urgency?: string | null;
  phone?: string | null;
  /** Phone-first fields. The Apps Script ignores unknown keys, so these are
   *  safe to send before backend/waitlist.gs is redeployed with the columns. */
  name?: string | null;
  city?: string | null;
  cityServed?: string | null;
  /** Split-test market ("gulf" for /gulf); omitted on the main India page. */
  market?: string;
  /** The path this signup came from (e.g. "/gulf"), for attribution. */
  page?: string;
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
      body: JSON.stringify({
        ...payload,
        geo: getGeo(),
        utm: getStoredUtm(),
        // Record which /gulf price this lead saw ($149 vs $99); blank elsewhere.
        ...(payload.market === "gulf" ? { priceArm: getStoredGulfPriceArm() } : {}),
      }),
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
  /** Split-test market for this page ("gulf" on /gulf), else undefined. Rides
   *  along on CTA-position events and the signup payload. */
  market?: string;
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
  /** Record the qualifier answers (any/all optional), fire the completion
   *  beacons, and finish. */
  submitQualifiers: (answers: Qualifiers) => void;
  /** Attach an optional WhatsApp number after the confirmation. */
  submitPhone: (phone: string) => void;

  /* ---- Phone-first flow (main page only; /gulf and /us still lead with
     email). The product runs on WhatsApp, so the phone IS the account, and
     we are now selling on calls rather than measuring interest. Expect the
     reported conversion rate to fall: that is the trade, not a regression.
     Tag the switch date before comparing CPL across it. ---- */
  /** Captured lead: phone is required, name and city too, email optional. */
  lead: LeadDetails | null;
  /** Whether the parents' city is one we serve. Null until they tell us. */
  cityMatch: CityMatch | null;
  /** Capture phone + name + city, fire the funnel events, start the
   *  (non-blocking) signup, and advance. Returns an error to show, or null. */
  submitLead: (raw: LeadDetails) => string | null;
  /** Record the chosen first task and finish. */
  submitFirstTask: (task: string) => void;
};

/** What we ask for up front now. Email is optional - we need it for receipts
 *  once someone pays, not to start a conversation. */
export type LeadDetails = {
  phone: string;
  name: string;
  city: string;
  email?: string;
};

const Ctx = createContext<JoinCtx | null>(null);

/** Shares join-flow state (modal open + step + email) across the page, captures
 *  UTM attribution, and assigns the pricing-experiment arm once on first load. */
export function JoinProvider({
  children,
  market,
}: {
  children: React.ReactNode;
  /** Set to "gulf" on /gulf so every beacon + the signup payload carry the
   *  market, keeping the Meta split test cleanly separable. */
  market?: string;
}) {
  const [step, setStep] = useState<Step>("form");
  const [open, setOpen] = useState(false);
  // "A" until the client effect assigns the real arm; the modal (where the arm
  // matters) opens only on user interaction, well after this runs.
  const [arm, setArm] = useState<PricingArm>("A");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<SignupResult | null>(null);
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [cityMatch, setCityMatch] = useState<CityMatch | null>(null);
  const [eventId] = useState(() => newEventId());

  useEffect(() => {
    captureUtm();
    const attr = captureAttribution();
    const assigned = assignArm();
    setArm(assigned);
    // Lock the /gulf price arm before the first beacon so every event this
    // session carries a consistent $149-vs-$99 tag.
    if (market === "gulf") assignGulfPriceArm();
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
    const pageArm = readPageArm();
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    logEvent("email_entered", market ? { market } : undefined);
    track(
      "Lead",
      { content_name: "waitlist_email", arm, page_arm: pageArm, pitch, ...(market ? { market } : {}) },
      eventId
    );
    // Show the confirmation number instantly and advance - do NOT block the UI
    // on the Apps Script round-trip (302 redirect + cold start can take seconds).
    // The email is still captured; keepalive lets the POST finish in the
    // background even as the user moves through the flow.
    setResult({
      position: FALLBACK_WAITLIST_POSITION,
      referralCode: slugFromEmail(clean),
    });
    void submitSignup({ email: clean, eventId, arm, pageArm, pitch, ref, market, page });
    setStep("qualify");
    return null;
  }

  function submitQualifiers(answers: Qualifiers) {
    const { pitch, ref } = getStoredAttribution();
    const pageArm = readPageArm();
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    // Beacon the answers (needs + lead-quality signals) and the completion.
    logEvent("qualified", {
      tasks: answers.tasks.join("|"),
      whoFor: answers.whoFor || "",
      urgency: answers.urgency || "",
      plan: answers.plan || "",
      ...(market ? { market } : {}),
    });
    if (answers.plan) {
      // Keep the willingness-to-pay signal on the existing reserve metric.
      logEvent("reserve_clicked", { plan: answers.plan, ...(market ? { market } : {}) });
      track("AddPaymentInfo", { plan_id: answers.plan, arm, page_arm: pageArm, ...(market ? { market } : {}) }, eventId);
    }
    logEvent("signup_completed", market ? { market } : undefined);
    void submitSignup({
      email,
      eventId,
      arm,
      pageArm,
      pitch,
      ref,
      planId: answers.plan,
      tasks: answers.tasks,
      whoFor: answers.whoFor,
      urgency: answers.urgency,
      market,
      page,
    });
    setStep("done");
  }

  /**
   * Phone-first capture. Order matters: we write the lead BEFORE anything
   * hands off to WhatsApp, because if the handoff were the only capture we
   * would lose every visitor who doesn't send the message.
   */
  function submitLead(raw: LeadDetails): string | null {
    const { phone, error } = validatePhone(raw.phone);
    if (!phone) return error || "Please enter a valid phone number.";
    const name = raw.name.trim();
    if (name.length < 2) return "Please tell us your name.";
    const cityRaw = raw.city.trim();
    if (cityRaw.length < 2) return "Which city are your parents in?";

    // Email stays optional, but a typo'd one is worse than none.
    let email = "";
    if (raw.email && raw.email.trim()) {
      const v = validateEmail(raw.email);
      if (!v.email) return v.error || "Please check that email address.";
      email = v.email;
    }

    const match = matchCity(cityRaw);
    const { pitch, ref } = getStoredAttribution();
    const pageArm = readPageArm();
    const page = typeof window !== "undefined" ? window.location.pathname : "";

    setLead({ phone, name, city: cityRaw, email });
    setCityMatch(match);
    setEmail(email);
    setResult({
      position: FALLBACK_WAITLIST_POSITION,
      referralCode: slugFromName(name),
    });

    logEvent("lead_captured", {
      // `served` decides which half of the funnel this lead belongs to; keeping
      // it on the beacon means we can read serviceable-lead CPL without waiting
      // on the sheet.
      placement: match.served ? `city_served:${match.city}` : "city_waitlist",
      ...(market ? { market } : {}),
    });
    track(
      "Lead",
      { content_name: "waitlist_phone", arm, page_arm: pageArm, pitch, ...(market ? { market } : {}) },
      eventId
    );
    void submitSignup({
      email,
      eventId,
      arm,
      pageArm,
      pitch,
      ref,
      phone,
      name,
      city: cityRaw,
      cityServed: match.served ? match.city : "",
      market,
      page,
    });
    setStep("qualify");
    return null;
  }

  /** The chosen first free task. Recorded before the WhatsApp handoff so the
   *  founder sees what they picked even if they never send the message. */
  function submitFirstTask(task: string) {
    const { pitch, ref } = getStoredAttribution();
    const pageArm = readPageArm();
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    logEvent("first_task_chosen", market ? { market } : undefined);
    logEvent("signup_completed", market ? { market } : undefined);
    void submitSignup({
      email,
      eventId,
      arm,
      pageArm,
      pitch,
      ref,
      phone: lead?.phone,
      name: lead?.name,
      city: lead?.city,
      cityServed: cityMatch?.served ? cityMatch.city : "",
      tasks: [task],
      market,
      page,
    });
    setStep("done");
  }

  function submitPhone(phone: string) {
    const clean = phone.replace(/[^\d+]/g, "");
    if (clean.length < 7) return;
    const { pitch, ref } = getStoredAttribution();
    const pageArm = readPageArm();
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    logEvent("phone_added", market ? { market } : undefined);
    void submitSignup({ email, eventId, arm, pageArm, pitch, ref, phone: clean, market, page });
  }

  return (
    <Ctx.Provider
      value={{
        step,
        setStep,
        open,
        setOpen,
        arm,
        market,
        email,
        setEmail,
        result,
        referralUrl,
        openForm,
        submitEmail,
        submitQualifiers,
        submitPhone,
        lead,
        cityMatch,
        submitLead,
        submitFirstTask,
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
