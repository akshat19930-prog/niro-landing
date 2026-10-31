"use client";

import { useEffect, useRef } from "react";

/**
 * Looping WhatsApp-chat demo video (muted autoplay, no controls).
 *
 * The clip tells one story, the pain checker, across three screens: Ankush
 * sets it up, Niro checks in with his mother on Friday, and Niro comes back
 * with physio booked for his approval. It is rendered from HTML at 760x1080,
 * 13.4s at 1x, the same rhythm as the clip it replaced. New file names on
 * purpose, so no cached copy of the old clip outlives the change.
 *
 * iOS Safari is fussy about autoplay: the muted *attribute* in the SSR HTML
 * isn't always enough, so on mount we set the muted *property* and call play()
 * explicitly, and - if iOS still blocks it (e.g. Low Power Mode) - retry on the
 * first user interaction so it starts on any tap rather than only a tap on the
 * video. Poster shows instantly; aspect-ratio reserves the box to avoid shift.
 */
export function ChatVideo({
  src = "/media/chat-pain-2.mp4",
  poster = "/media/chat-pain-2-poster.webp",
  aspect = "760 / 1080",
  maxWidth = 380,
  ariaLabel = "A Niro WhatsApp story: Ankush sets a Friday pain checker for his mother's knee, Niro asks her on Friday and she reports 8 out of 10, and Niro books three physio sessions for next week, which Ankush approves.",
  playbackRate = 1,
}: {
  src?: string;
  poster?: string;
  aspect?: string;
  maxWidth?: number;
  ariaLabel?: string;
  /** Below 1 slows the loop down so each request stays readable for longer. */
  playbackRate?: number;
} = {}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Hero A/B "none" version (components/HeroInit.tsx): the clip is hidden,
    // so stop its download. The autoplay attribute makes browsers start
    // fetching at parse time whatever preload says; dropping src and calling
    // load() cancels that fetch.
    if (document.documentElement.getAttribute("data-hero") === "none" && v.closest(".hero-video")) {
      v.removeAttribute("src");
      v.load();
      return;
    }
    // Properties (not just attributes) - required for iOS autoplay.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    // defaultPlaybackRate survives the load() below, which resets playbackRate.
    v.defaultPlaybackRate = playbackRate;
    v.playbackRate = playbackRate;

    const tryPlay = () => {
      // preload="none" is meant to hold the download until here, though the
      // autoplay attribute makes most browsers start fetching at parse time
      // anyway (measured Nov 2026: tens of KB before hydration). Kick it
      // explicitly in case the browser did wait.
      if (v.preload === "none" || v.networkState === v.NETWORK_EMPTY) v.load();
      v.playbackRate = playbackRate;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();

    // Fallback: if autoplay was blocked, start on the first interaction anywhere.
    const kick = () => {
      if (v.paused) tryPlay();
    };
    const opts = { once: true, passive: true } as AddEventListenerOptions;
    document.addEventListener("touchstart", kick, opts);
    document.addEventListener("pointerdown", kick, opts);
    document.addEventListener("scroll", kick, opts);
    return () => {
      document.removeEventListener("touchstart", kick);
      document.removeEventListener("pointerdown", kick);
      document.removeEventListener("scroll", kick);
    };
  }, [playbackRate]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-3)",
        border: "1px solid var(--border)",
        aspectRatio: aspect,
        background: "var(--wa-bg)",
      }}
    >
      <video
        ref={ref}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
        webkit-playsinline="true"
        src={src}
        aria-label={ariaLabel}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
