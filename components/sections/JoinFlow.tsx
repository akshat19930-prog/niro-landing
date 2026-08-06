"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Badge } from "@/components/ds/Badge";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { TaskPicker, type TaskDef } from "@/components/ds/TaskPicker";
import { useJoin } from "@/components/JoinProvider";
import { TASK_DEFS } from "@/lib/content";
import {
  getStoredUtm,
  track,
  newEventId,
  type Utm,
} from "@/lib/analytics";
import {
  WAITLIST_ENDPOINT,
  SITE_ORIGIN,
  FALLBACK_WAITLIST_POSITION,
} from "@/lib/config";

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  color: "var(--text-strong)",
  fontWeight: 500,
} as const;

/** Fisher–Yates shuffle — task-basket order is randomized per visitor. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function slugFromEmail(email: string): string {
  return (
    (email || "friend").split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() ||
    "friend"
  );
}

type SignupResult = { position: number; referralCode: string };

/** POST the signup to the waitlist backend (if configured) and return the
 *  waitlist position + referral code. Falls back to a local, testable result
 *  so the smoke-test funnel completes even with no backend wired. */
async function submitSignup(payload: {
  email: string;
  utm: Utm;
  eventId: string;
  primaryTaskId?: string | null;
  alsoInterestedIds?: string[];
}): Promise<SignupResult> {
  const fallback: SignupResult = {
    position: FALLBACK_WAITLIST_POSITION,
    referralCode: slugFromEmail(payload.email),
  };
  if (!WAITLIST_ENDPOINT) return fallback;
  try {
    const res = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

export function JoinFlow() {
  const { step, setStep } = useJoin();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const [tasks, setTasks] = useState<TaskDef[]>(TASK_DEFS);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [alsoInterested, setAlsoInterested] = useState<string[]>([]);

  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState(false);
  // Stable per-mount id so the browser pixel and server CAPI event de-dupe.
  const [eventId] = useState(() => newEventId());

  // Randomize task order on the client only (avoids hydration mismatch).
  useEffect(() => {
    setTasks(shuffle(TASK_DEFS));
  }, []);

  const referralUrl = useMemo(
    () => (result ? `${SITE_ORIGIN}/join?ref=${encodeURIComponent(result.referralCode)}` : ""),
    [result]
  );

  const waLink = useMemo(() => {
    const text = `I found Niro — they handle my parents' errands, bills, and emergencies in India, over WhatsApp. Thought you'd want this too: ${referralUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [referralUrl]);

  const selectedTaskLabel =
    tasks.find((t) => t.id === selectedTask)?.label ?? "";

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || email.indexOf("@") === -1) {
      setError("Please enter a valid email.");
      return;
    }
    setError(undefined);
    setSubmitting(true);

    const utm = getStoredUtm();
    // Fire the browser pixel Lead event; backend forwards the CAPI twin (same eventId).
    track("Lead", { content_name: "waitlist_email" }, eventId);

    const res = await submitSignup({ email, utm, eventId });
    setResult(res);
    setSubmitting(false);
    setStep("tasks");
  }

  function pickTask(id: string) {
    setSelectedTask(id);
    setAlsoInterested((prev) => prev.filter((x) => x !== id));
  }

  function toggleInterest(id: string) {
    setAlsoInterested((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.concat(id)
    );
  }

  async function continueToConfirm() {
    if (!selectedTask) return;
    // Attach the task selections to the signup (best-effort) + pixel event.
    const utm = getStoredUtm();
    track(
      "SubmitApplication",
      { primary_task_id: selectedTask, also_interested_ids: alsoInterested },
      eventId
    );
    void submitSignup({
      email,
      utm,
      eventId,
      primaryTaskId: selectedTask,
      alsoInterestedIds: alsoInterested,
    });
    setStep("done");
  }

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — user can still select the field manually */
    }
  }

  const interestOptions = tasks.filter((t) => t.id !== selectedTask);

  return (
    <section id="join" data-screen-label="Join the waitlist" style={{ padding: "88px var(--gutter)" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Step 1 — email */}
        {step === "form" && (
          <>
            <Eyebrow>Step 1 of 2</Eyebrow>
            <h2 style={{ ...h2Style, margin: "16px 0 10px" }}>Join the waitlist</h2>
            <p
              style={{
                fontSize: "var(--text-md)",
                color: "var(--text-body)",
                lineHeight: 1.6,
                margin: "0 0 32px",
              }}
            >
              One membership, one associate, everything covered. No card today — just your
              email to hold your family&apos;s place.
            </p>
            <form onSubmit={submitEmail} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Input
                id="email-input"
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" size="lg" full disabled={submitting}>
                {submitting ? "Joining…" : "Join the waitlist"}
              </Button>
            </form>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 18,
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
              }}
            >
              <Icon name="lock" size={14} />
              No payment, ever, to join the list.
            </div>
          </>
        )}

        {/* Step 2 — first task picker */}
        {step === "tasks" && (
          <>
            <Eyebrow>Step 2 of 2</Eyebrow>
            <h2 style={{ ...h2Style, margin: "16px 0 10px" }}>Pick your free first task</h2>
            <p
              style={{
                fontSize: "var(--text-md)",
                color: "var(--text-body)",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              We&apos;ll do this one on us, before you pay anything.
            </p>
            <TaskPicker tasks={tasks} value={selectedTask} onChange={pickTask} />

            {selectedTask && (
              <div style={{ marginTop: 28 }}>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--text-strong)",
                    marginBottom: 12,
                  }}
                >
                  Also interested in (optional)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {interestOptions.map((opt) => {
                    const on = alsoInterested.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleInterest(opt.id)}
                        aria-pressed={on}
                        className="chip"
                        style={
                          on
                            ? {
                                background: "var(--brand-soft)",
                                color: "var(--brand)",
                                border: "1px solid transparent",
                              }
                            : {
                                background: "var(--bg-inset)",
                                color: "var(--text-body)",
                                border: "1px solid var(--border)",
                              }
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <Button size="lg" full disabled={!selectedTask} onClick={continueToConfirm}>
                Continue
              </Button>
            </div>
          </>
        )}

        {/* Step 3 — confirmation */}
        {step === "done" && (
          <Card>
            <span
              style={{
                display: "inline-flex",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--brand-soft)",
                color: "var(--brand)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Icon name="check-circle" size={28} />
            </span>
            <h2 style={{ ...h2Style, margin: "0 0 10px" }}>
              You&apos;re #{(result?.position ?? FALLBACK_WAITLIST_POSITION).toLocaleString()} on
              the list
            </h2>
            <p
              style={{
                fontSize: "var(--text-md)",
                color: "var(--text-body)",
                lineHeight: 1.6,
                margin: "0 0 28px",
              }}
            >
              We&apos;ll start with:{" "}
              <strong style={{ color: "var(--text-strong)" }}>{selectedTaskLabel}</strong>. Move
              up the list — every friend who joins with your link moves your family up.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "stretch" }}>
              <div style={{ flex: 1 }}>
                <Input value={referralUrl} readOnly aria-label="Referral link" />
              </div>
              <Button variant="secondary" onClick={copyReferral}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
            <Button href={waLink} target="_blank" rel="noopener noreferrer" full>
              <Icon name="message-circle" size={18} />
              Share on WhatsApp
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
}
