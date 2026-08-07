/**
 * Looping WhatsApp-chat demo video (muted autoplay, no controls) — the animated
 * version of the chat mock. Poster shows instantly and covers the first paint,
 * so there's no blank box while the mp4 loads. aspect-ratio reserves the box to
 * avoid layout shift. Native <video> only — no JS library.
 */
export function ChatVideo() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        margin: "0 auto",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-3)",
        border: "1px solid var(--border)",
        aspectRatio: "760 / 1080",
        background: "var(--wa-bg)",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/media/chat-poster.webp"
        aria-label="A Niro family WhatsApp thread: a parent asks for a verified maid replacement and Niro sends three police-verified options, then confirms one."
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      >
        <source src="/media/chat.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
