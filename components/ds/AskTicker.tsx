import { Icon } from "@/components/ds/Icon";
import { ASK_TASKS } from "@/lib/content";

/**
 * Hero "ask" ticker - a single row of WhatsApp-style outgoing bubbles, each a
 * task you'd text Niro. Auto-scrolls (pauses on hover, static under
 * prefers-reduced-motion) via the shared .marquee engine. Positioned at the
 * bottom of the first fold: the motion + the peek pull the eye down and drive
 * the first scroll (the fold where ~73% of visitors currently drop). Static
 * markup, no JS - the list is duplicated once so the loop is seamless.
 */
export function AskTicker() {
  const track = [...ASK_TASKS, ...ASK_TASKS];
  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 10,
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-wide)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        <Icon name="message-circle" size={14} style={{ color: "var(--brand)" }} />
        Just text Niro
      </div>
      <div className="marquee" aria-label="Things families ask Niro">
        <div className="marquee-track" style={{ animationDuration: "46s", padding: "4px 0" }}>
          {track.map((task, i) => (
            <span
              className="ask-bubble"
              key={i}
              aria-hidden={i >= ASK_TASKS.length ? true : undefined}
            >
              {task}
              <span className="tick" aria-hidden="true">
                ✓✓
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
