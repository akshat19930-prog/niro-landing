"use client";

import { useFlicker } from "@/components/ds/Flicker";

/**
 * What parents actually send Niro, in their own words.
 *
 * Six asks cycling three at a time, same fixed-slot crossfade as the ask feed.
 * The point of the set is breadth without English or app literacy: a cab, a
 * replacement maid, a pension certificate, a CGHS refill, a broken AC, and a
 * Tatkaal booking - each one otherwise a different app, portal or queue.
 *
 * `means` is optional: the asks that arrive in English don't need a gloss, and
 * translating them would read as condescending.
 */

export type Voice = { said: string; means?: string };

export const VOICES: Voice[] = [
  {
    said: "Beta, kal subah doctor ke liye cab bhej dena - aur wapas bhi.",
    means: "Send a cab for the doctor tomorrow morning, and one back.",
  },
  {
    said: "Maid kal se nahi aa rahi. Koi bharosemand aadmi dekh lo.",
    means: "The maid has stopped coming. Please find someone reliable.",
  },
  {
    said: "Pension ka Jeevan Pramaan patra jama karwa do.",
    means: "Please get my pension life certificate submitted.",
  },
  { said: "Need to re-order my medicines from the CGHS centre." },
  { said: "AC broke down. Can you get it fixed?" },
  {
    said: "Purso Gwalior ki Shatabdi mein tatkaal booking mil sakti hai?",
    means: "Can you get a Tatkaal booking on the Shatabdi to Gwalior, day after?",
  },
];

export function VoiceStream() {
  // 3 slots, one swapping every 3.2s -> each voice holds for ~9.6s. Slower than
  // the ask feed because these carry a translation line to read as well.
  const visible = useFlicker(VOICES.length, 3, 3200);

  return (
    <div className="voices">
      {visible.map((idx, slot) => {
        const v = VOICES[idx];
        return (
          <div className="voice" key={`slot-${slot}`}>
            <div className="voice-inner voice-fade" key={idx}>
              <div className="voice-said">{v.said}</div>
              {v.means && <div className="voice-means">{v.means}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
