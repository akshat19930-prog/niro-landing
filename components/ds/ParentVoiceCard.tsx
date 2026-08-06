/** Parent-voice testimonial in Hinglish with translation. Dignified, never cute. */
export function ParentVoiceCard({
  hinglish,
  translation,
  name,
  relation,
}: {
  hinglish: string;
  translation: string;
  name: string;
  relation: string;
}) {
  return (
    <div
      style={{
        background: "var(--forest-800)",
        color: "var(--ivory)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -18,
          left: 20,
          fontFamily: "var(--font-display)",
          fontSize: 130,
          color: "rgba(224,190,132,0.16)",
          lineHeight: 1,
        }}
      >
        &ldquo;
      </span>
      <div style={{ position: "relative" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontStyle: "italic",
            lineHeight: 1.4,
            color: "#fff",
            margin: "0 0 12px",
          }}
        >
          {hinglish}
        </p>
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.5,
            margin: "0 0 20px",
          }}
        >
          {translation}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "var(--gold-500)",
              color: "var(--forest-950)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {name ? name[0] : "?"}
          </span>
          <div style={{ lineHeight: 1.35 }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-base)" }}>{name}</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--gold-300)" }}>
              {relation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
