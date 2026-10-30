"use client";

import { useRef, useState } from "react";
import { logEvent } from "@/lib/track";

/**
 * "Niro Diaries": the 90-second proof video of real tasks for real families.
 *
 * Poster first, player on tap. Nothing autoplays: the voiceover carries the
 * story, so it only starts with sound when someone asks for it, and the page
 * pays for no player until then. Two shapes share one player:
 *  - ProofVideo: the poster card, in the page (home stories, /pf about).
 *  - ProofVideoLink: a text link that opens the same player in a dialog, for
 *    a section whose one action is already taken (pricing).
 *
 * MOCKUP: plays the YouTube Short until the source MP4 is in /public/media,
 * then `src` switches it to a self-hosted <video>.
 */
const YT_ID = "FVrXM4qh5AQ";
const POSTER = "/media/niro-diaries-poster.jpg";
const LABEL = "Niro Diaries: real tasks for real NRI families, in 90 seconds";

function Player({ src }: { src?: string }) {
  return src ? (
    <video src={src} poster={POSTER} controls autoPlay playsInline className="proof-media" />
  ) : (
    <iframe
      className="proof-media"
      src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&playsinline=1`}
      title={LABEL}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}

function Poster({ onPlay }: { onPlay: () => void }) {
  return (
    <button type="button" className="proof-poster" onClick={onPlay} aria-label={`Play: ${LABEL}`}>
      <img src={POSTER} alt="" loading="lazy" />
      <span className="proof-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      </span>
      <span className="proof-tag">
        <b>Niro Diaries</b>
        <span>Real tasks, real families · 90s</span>
      </span>
    </button>
  );
}

export function ProofVideo({ placement, src, caption }: { placement: string; src?: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="proof-video">
      <div className="proof-frame">
        {playing ? (
          <Player src={src} />
        ) : (
          <Poster onPlay={() => { setPlaying(true); logEvent("proof_video_play", { placement }); }} />
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function ProofVideoLink({ placement, src, children }: { placement: string; src?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  function show() {
    setOpen(true);
    ref.current?.showModal();
    logEvent("proof_video_play", { placement });
  }
  function close() {
    ref.current?.close();
  }
  return (
    <>
      <button type="button" className="proof-link" onClick={show}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
        {children}
      </button>
      <dialog
        ref={ref}
        className="proof-dialog"
        aria-label={LABEL}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <button type="button" className="proof-close" onClick={close} aria-label="Close video">&times;</button>
        <div className="proof-frame">{open && <Player src={src} />}</div>
      </dialog>
    </>
  );
}
