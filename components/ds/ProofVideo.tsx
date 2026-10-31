"use client";

import { useRef, useState } from "react";
import { logEvent } from "@/lib/track";
import { trackCustom } from "@/lib/analytics";

/**
 * "Niro Diaries": the 93-second proof video of real tasks for real families.
 *
 * Poster first, player on tap. Nothing autoplays: the voiceover carries the
 * story, so it only starts with sound when someone asks for it, and the page
 * loads no video bytes until then. Two shapes share one player:
 *  - ProofVideo: the poster card, in the page (home stories, /pf about).
 *  - ProofVideoLink: a text link that opens the same player in a dialog, for
 *    a section whose one action is already taken (pricing).
 *
 * Self-hosted rather than a YouTube embed: no player script on the page, and
 * no end screen suggesting other channels' videos. The file is the V11 cut
 * re-encoded at 720x1280 (3.7 MB). The poster is its Jaipur passport frame,
 * a real photo, which reads as proof where the opening talking head did not;
 * its burned-in subtitle strip is painted over so it cannot collide with the
 * poster's own label.
 *
 * Plays and completions go to the events sheet and PostHog (logEvent), and
 * to the Meta Pixel as WatchedProof, so watchers can be a retargeting audience.
 */
const SRC = "/media/niro-diaries.mp4";
const POSTER = "/media/niro-diaries-poster.jpg";
const LABEL = "Niro Diaries: real tasks for real NRI families, in 90 seconds";

function Player({ placement }: { placement: string }) {
  return (
    <video
      src={SRC}
      poster={POSTER}
      controls
      autoPlay
      playsInline
      className="proof-media"
      aria-label={LABEL}
      onEnded={() => logEvent("proof_video_complete", { placement })}
    />
  );
}

function played(placement: string) {
  logEvent("proof_video_play", { placement });
  trackCustom("WatchedProof", { placement });
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
        <span>Real tasks, real families · 1:33</span>
      </span>
    </button>
  );
}

export function ProofVideo({ placement, caption }: { placement: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="proof-video">
      <div className="proof-frame">
        {playing ? (
          <Player placement={placement} />
        ) : (
          <Poster onPlay={() => { setPlaying(true); played(placement); }} />
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function ProofVideoLink({ placement, children }: { placement: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  function show() {
    setOpen(true);
    ref.current?.showModal();
    played(placement);
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
      {/* Closing unmounts the player, which stops the sound. */}
      <dialog
        ref={ref}
        className="proof-dialog"
        aria-label={LABEL}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <button type="button" className="proof-close" onClick={close} aria-label="Close video">&times;</button>
        <div className="proof-frame">{open && <Player placement={placement} />}</div>
      </dialog>
    </>
  );
}
