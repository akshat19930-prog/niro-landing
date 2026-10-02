"use client";

import { useFlicker } from "@/components/ds/Flicker";

/**
 * A live feed of the asks families actually send Niro.
 *
 * Three slots, one of which crossfades to a new ask every few seconds - so an
 * individual ask sits still long enough to read, and nothing ever jumps.
 *
 * Deliberately mixes FAMILY asks ("Mum") with the member's OWN India admin
 * ("You"). The research found two distinct jobs inside one product, and a
 * visitor who came for their stuck EPF claim needs to see themselves here too.
 *
 * Renders all three filled on first paint, and freezes under
 * prefers-reduced-motion.
 */

export type Ask = { from: "You" | "Mum" | "Dad"; text: string };

export const ASKS: Ask[] = [
  { from: "Mum", text: "Beta, kal doctor ke liye cab bhej dena" },
  { from: "You", text: "Can you chase my EPFO claim? It's been eight months" },
  { from: "Dad", text: "The AC has been leaking for a week now" },
  { from: "You", text: "Mum's blood tests are due - set up a quarterly rhythm?" },
  { from: "Mum", text: "Maid absconded. Need someone reliable by Monday" },
  { from: "You", text: "My NRO account has gone dormant. Sort it without a branch visit?" },
  { from: "Dad", text: "Electricity bill says ₹19,600. It's never above ₹2,000" },
  { from: "You", text: "Need my degree apostilled and couriered to Toronto" },
  { from: "Mum", text: "Jeevan Pramaan ka pension certificate jama karwa do" },
  { from: "You", text: "Tenant's lease is up next month - handle the renewal?" },
  { from: "Dad", text: "Passport renewal. Can someone come with me to the appointment?" },
  { from: "You", text: "File my India ITR this year - I keep missing the deadline" },
];

/**
 * The arm B2 feed (/start). Every ask is from the member, because that is the
 * arm's entire argument: nothing here needed a parent to be set up, persuaded
 * or even present. Most are the member relaying something a parent mentioned
 * in passing on a call, which is the voice the B2 ad creatives lead with.
 *
 * Kept the same length as ASKS so the stream reads as busy on both arms, and
 * page speed is not a difference the test has to control for.
 */
export const ASKS_B2: Ask[] = [
  { from: "You", text: "Amma mentioned the AC broke down. Can you get it fixed?" },
  { from: "You", text: "Can you chase my EPFO claim? It’s been eight months" },
  { from: "You", text: "Papa mentioned the electricity bill says ₹19,600. Sort it?" },
  { from: "You", text: "Mum’s blood tests are due - set up a quarterly rhythm?" },
  { from: "You", text: "Amma’s maid absconded. Find someone reliable by Monday?" },
  { from: "You", text: "My NRO account has gone dormant. Sort it without a branch visit?" },
  { from: "You", text: "File my India ITR this year - I keep missing the deadline" },
  { from: "You", text: "Need my degree apostilled and couriered to Toronto" },
  { from: "You", text: "Papa mentioned his pension certificate is due. Get it submitted?" },
  { from: "You", text: "Tenant’s lease is up next month - handle the renewal?" },
  { from: "You", text: "Papa has a passport appointment. Send someone with him?" },
  { from: "You", text: "Amma mentioned her knee is bad again. Start weekly physio?" },
];

export function AskStream({ asks = ASKS }: { asks?: Ask[] } = {}) {
  // 3 slots, one swapping every 2.6s -> each ask holds for ~7.8s.
  const visible = useFlicker(asks.length, 3, 2600);

  return (
    <div className="ask-stream" aria-live="off">
      {visible.map((idx, slot) => {
        const a = asks[idx];
        return (
          <div className="ask-row" key={`slot-${slot}`}>
            <span className={`ask-who ask-who-${a.from === "You" ? "you" : "family"}`}>
              {a.from}
            </span>
            {/* Keying the bubble on the ask index remounts it, so the fade runs
                on every swap while the row itself never moves. */}
            <span className="ask-text ask-fade" key={idx}>
              {a.text}
              <span className="ask-tick" aria-hidden="true">
                ✓✓
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
