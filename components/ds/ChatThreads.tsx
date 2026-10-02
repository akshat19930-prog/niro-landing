"use client";

import { useEffect, useState } from "react";
import { B2_HERO_THREADS } from "@/lib/content";

/**
 * The arm B2 hero: a 1:1 WhatsApp thread with Niro, cycling one task per beat.
 *
 * A component rather than a second mp4, for three reasons. The live hero clip
 * is 292KB and profiling showed it downloading inside the first-paint window
 * on mobile, so a second one would make B2 the slower arm and page speed would
 * confound the test the brief is trying to run. This renders as text. It also
 * follows the house rule for the two existing animated components: one
 * interval and a CSS transition, no animation library. And the copy stays
 * editable in lib/content.ts rather than baked into a video nobody can patch.
 *
 * The beat matches the live hero's rhythm at 4s per task: the question fades
 * in, the reply follows a beat later, then it holds long enough to read.
 * Thread one is fully painted on first render, so nothing waits on JS to have
 * something to show, and the interval never starts under reduced motion.
 */
export function ChatThreads() {
  const [active, setActive] = useState(0);
  // Entry animation is off until after the first paint. Without this the first
  // thread starts at opacity 0 and fades in, which means the hero has no
  // contentful paint until the transition finishes: measured as 1.2s of extra
  // LCP against the control, enough to make B2 the slower arm and confound the
  // test. It also broke the house rule that nothing renders at opacity 0.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return () => cancelAnimationFrame(raf);
    const id = setInterval(
      () => setActive((i) => (i + 1) % B2_HERO_THREADS.length),
      4000
    );
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return (
    <div
      className="nchat"
      data-ready={ready ? "" : undefined}
      aria-label="Example 1:1 WhatsApp chats with Niro"
    >
      <div className="nchat-top">
        <span className="nchat-avatar" aria-hidden="true">
          N
        </span>
        <span className="nchat-who">
          <b>Niro</b>
          <span>Your Niro Assistant</span>
        </span>
      </div>

      <div className="nchat-screen">
        {B2_HERO_THREADS.map((t, i) => (
          <div
            key={t.me}
            className={`nchat-thread${i === active ? " on" : ""}`}
            aria-hidden={i !== active}
          >
            <p className="nchat-b nchat-me">{t.me}</p>
            {t.system && <p className="nchat-b nchat-sys">{t.system}</p>}
            <p className="nchat-b nchat-niro">
              <i>Kunal from Niro</i>
              {t.niro}
            </p>
          </div>
        ))}
      </div>

      <div className="nchat-dots" aria-hidden="true">
        {B2_HERO_THREADS.map((t, i) => (
          <span key={t.me} className={i === active ? "on" : undefined} />
        ))}
      </div>
    </div>
  );
}
