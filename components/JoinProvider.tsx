"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { captureUtm, captureAttribution, assignArm, type PricingArm } from "@/lib/analytics";

/** Waitlist flow: email → membership → confirmation. (No task step.) */
export type Step = "form" | "plan" | "done";

type JoinCtx = {
  step: Step;
  setStep: (s: Step) => void;
  /** Whether the join modal is open. */
  open: boolean;
  setOpen: (o: boolean) => void;
  /** Pricing-experiment cell for this visitor (see assignArm). */
  arm: PricingArm;
};

const Ctx = createContext<JoinCtx | null>(null);

/** Shares join-flow state (modal open + step) across the page, captures UTM
 *  attribution, and assigns the pricing-experiment arm once on first load. */
export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("form");
  const [open, setOpen] = useState(false);
  // "A" until the client effect assigns the real arm; the modal (where the arm
  // matters) opens only on user interaction, well after this runs.
  const [arm, setArm] = useState<PricingArm>("A");

  useEffect(() => {
    captureUtm();
    captureAttribution();
    setArm(assignArm());
  }, []);

  // Lock body scroll while the modal is open so the page behind doesn't move.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Ctx.Provider value={{ step, setStep, open, setOpen, arm }}>
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
