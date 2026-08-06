"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { captureUtm } from "@/lib/analytics";

export type Step = "form" | "tasks" | "done";

type JoinCtx = {
  step: Step;
  setStep: (s: Step) => void;
};

const Ctx = createContext<JoinCtx | null>(null);

/** Shares the join-flow step across the page (join section + sticky CTA) and
 *  captures UTM attribution once on first load. */
export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("form");

  useEffect(() => {
    captureUtm();
  }, []);

  return <Ctx.Provider value={{ step, setStep }}>{children}</Ctx.Provider>;
}

export function useJoin(): JoinCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useJoin must be used within JoinProvider");
  return ctx;
}
