"use client";

import { useState } from "react";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { useJoin } from "@/components/JoinProvider";
import { logEvent } from "@/lib/track";

/**
 * Inline email capture on the hero - the highest-intent path with one fewer
 * tap than opening the modal first. Submitting captures the email (same
 * validation + funnel + pixel events as the modal, one shared eventId) and then
 * opens the modal directly at the membership step, so the visitor never sees an
 * empty email field twice.
 */
export function HeroEmailForm() {
  const { email, setEmail, submitEmail, setOpen } = useJoin();
  const [error, setError] = useState<string | undefined>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // The inline form IS the join action, so mark intent here (the modal path
    // marks it when its CTA opens the modal).
    logEvent("join_initiated");
    const err = submitEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError(undefined);
    setOpen(true); // advance into the modal at the plan step, email already captured
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 440 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
          gap: 10,
          alignItems: "start",
        }}
      >
        <Input
          id="hero-email"
          type="email"
          placeholder="you@email.com"
          aria-label="Email"
          value={email}
          error={error}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          style={{ height: 52 }}
        />
        <Button type="submit" size="lg" variant="primary">
          Join the waitlist
        </Button>
      </div>
    </form>
  );
}
