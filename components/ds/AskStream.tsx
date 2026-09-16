"use client";

import { useEffect, useState } from "react";

/**
 * A live feed of the asks families actually send Niro.
 *
 * Three bubbles are visible; every few seconds the oldest drops off the top
 * and a new one arrives at the bottom, so the block reads as an inbox filling
 * up rather than three examples someone chose. That motion is the whole point
 * of the first beat of "how it works": the ask is the only thing the member
 * has to do.
 *
 * Deliberately mixes FAMILY asks ("Mum") with the member's OWN India admin
 * ("You"). The research found two distinct jobs inside one product, and a
 * visitor who came for their stuck EPF claim needs to see themselves here too.
 *
 * Renders all three bubbles filled on first paint - no opacity:0 waiting on an
 * effect - and freezes into a static list under prefers-reduced-motion.
 */

export type Ask = { from: "You" | "Mum" | "Dad"; text: string };

export const ASKS: Ask[] = [
  { from: "Mum", text: "Beta, kal doctor ke liye cab bhej dena" },
  { from: "You", text: "Can you chase my EPFO claim? It's been eight months" },
  { from: "Dad", text: "The AC has been leaking for a week now" },
  { from: "You", text: "Mum's blood tests are due - can you set up a quarterly rhythm?" },
  { from: "Mum", text: "Maid absconded. Need someone reliable by Monday" },
  { from: "You", text: "My NRO account has gone dormant. Sort it without a branch visit?" },
  { from: "Dad", text: "Electricity bill says ₹19,600. It's never above ₹2,000" },
  { from: "You", text: "Need my degree apostilled and couriered to Toronto" },
  { from: "Mum", text: "Jeevan Pramaan ka pension certificate jama karwa do" },
  { from: "You", text: "Tenant's lease is up next month - can you handle the renewal?" },
  { from: "Dad", text: "Passport renewal. Can someone come with me to the appointment?" },
  { from: "You", text: "File my India ITR this year - I keep missing the deadline" },
];

const VISIBLE = 3;
const INTERVAL = 2600;

export function AskStream() {
  const [start, setStart] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;
    const id = setInterval(() => setStart((s) => (s + 1) % ASKS.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const shown = Array.from({ length: VISIBLE }, (_, i) => ASKS[(start + i) % ASKS.length]);

  return (
    <div className="ask-stream" aria-live="off">
      {shown.map((a, i) => (
        <div
          // Keying on the ask's index in ASKS (not the slot) makes React mount a
          // NEW node for each arrival, so the enter animation actually runs.
          key={`${(start + i) % ASKS.length}`}
          className={`ask-row${reduced ? " ask-row-static" : ""}`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className={`ask-who ask-who-${a.from === "You" ? "you" : "family"}`}>
            {a.from}
          </span>
          <span className="ask-text">
            {a.text}
            <span className="ask-tick" aria-hidden="true">
              ✓✓
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
