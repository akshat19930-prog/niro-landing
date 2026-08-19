"use client";

import { useEffect, useRef } from "react";

/**
 * Looping WhatsApp-chat demo video (muted autoplay, no controls).
 *
 * iOS Safari is fussy about autoplay: the muted *attribute* in the SSR HTML
 * isn't always enough, so on mount we set the muted *property* and call play()
 * explicitly, and - if iOS still blocks it (e.g. Low Power Mode) - retry on the
 * first user interaction so it starts on any tap rather than only a tap on the
 * video. Poster shows instantly; aspect-ratio reserves the box to avoid shift.
 */
export function ChatVideo({
  src = "/media/chat.mp4",
  poster = "/media/chat-poster.webp",
  aspect = "760 / 1080",
  maxWidth = 380,
  ariaLabel = "A Niro WhatsApp thread cycling three requests - filing an India tax return, booking home physio for a parent, and renewing a pension life certificate - each confirmed done by Niro.",
}: {
  src?: string;
  poster?: string;
  aspect?: string;
  maxWidth?: number;
  ariaLabel?: string;
} = {}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Properties (not just attributes) - required for iOS autoplay.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");

    const tryPlay = () => {
      // With preload="none" nothing is fetched until we ask; kick the download
      // here (post-hydration) so the 285KB clip never competes with the HTML,
      // pixel, and critical JS during the first-paint window.
      if (v.preload === "none" || v.networkState === v.NETWORK_EMPTY) v.load();
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
  }, []);

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
