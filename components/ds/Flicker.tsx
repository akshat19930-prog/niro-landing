"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared "gradually flickering" list used by the ask feed and the parents'
 * voices.
 *
 * The first version pushed a new item onto the bottom and dropped the oldest
 * off the top. That reads as jerky for a reason: every tick re-flows the whole
 * stack, so all three rows jump at once, and React has no way to ease a
 * position change between renders.
 *
 * This version keeps a FIXED number of slots and swaps the contents of one
 * slot at a time, crossfading in place. Nothing moves, so there is nothing to
 * jerk - and because only one row changes per tick, each individual item sits
 * still for `everyMs * slots` before it is replaced. Slower and calmer at the
 * same interval.
 *
 * Rows are given an equal minimum height by the caller's CSS so a one-line
 * item swapping for a two-line one cannot shift the rows beneath it.
 */
export function useFlicker(total: number, slots: number, everyMs: number) {
  const [visible, setVisible] = useState<number[]>(() =>
    Array.from({ length: slots }, (_, i) => i % total)
  );
  const nextItem = useRef(slots);
  const nextSlot = useRef(0);

  useEffect(() => {
    if (total <= slots) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = setInterval(() => {
      setVisible((prev) => {
        const out = [...prev];
        out[nextSlot.current % slots] = nextItem.current % total;
        nextItem.current += 1;
        nextSlot.current += 1;
        return out;
      });
    }, everyMs);
    return () => clearInterval(id);
  }, [total, slots, everyMs]);

  return visible;
}
