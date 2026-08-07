"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { captureUtm, assignArm, type PricingArm } from "@/lib/analytics";

export type Step = "form" | "tasks" | "plan" | "done";

type JoinCtx = {
  step: Step;
  setStep: (s: Step) => void;
  /** Pricing-experiment cell for this visitor (see assignArm). */
  arm: PricingArm;
};

const Ctx = createContext<JoinCtx | null>(null);

/** Shares the join-flow step across the page (join section + sticky CTA),
 *  captures UTM attribution, and assigns the pricing-experiment arm once on
 *  first load. */
export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("form");
  // "A" until the client effect assigns the real arm; the plan step (where the
  // arm matters) is only reached after user interaction, well after this runs.
  const [arm, setArm] = useState<PricingArm>("A");

  useEffect(() => {
    captureUtm();
    setArm(assignArm());
  }, []);

  return <Ctx.Provider value={{ step, setStep, arm }}>{children}</Ctx.Provider>;
}

export function useJoin(): JoinCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useJoin must be used within JoinProvider");
  return ctx;
}
