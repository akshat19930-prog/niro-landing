import { ChatVideo } from "@/components/ds/ChatVideo";
import { HeroEmailForm } from "@/components/ds/HeroEmailForm";
import { HERO_QUOTE } from "@/lib/content";
import { HeroCopy } from "./HeroCopy";

/** Hero - two-column, stacks under ~680px via auto-fit. Copy is ad-matched
 *  (client HeroCopy); everything else is static. Single CTA to #join. */
export function Hero() {
  return (
    <section
      data-screen-label="Hero"
      style={{ padding: "64px var(--gutter) 48px", position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--jaali)",
          backgroundSize: "72px",
          opacity: 0.6,
          maskImage:
            "linear-gradient(180deg,transparent,black 30%,black 70%,transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg,transparent,black 30%,black 70%,transparent)",
        }}
      />
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <HeroCopy />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Inline email capture - the highest-intent path, one fewer tap
                than opening the modal. Submitting advances straight to the
                membership step. */}
            <HeroEmailForm />
            {/* Price anchor + reward + no-card reassurance - the reasons a cold
                visitor spends an email. */}
            <div
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--brand)",
              }}
            >
              Membership starts at $55/mo. First task free. No card to join.
            </div>
            {/* One genuine pull-quote - early social proof before the product
                detail, without asking the full testimonial section to work up
                here (and without a fabricated stat). */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginTop: 6,
                maxWidth: 440,
              }}
            >
              <div
                role="img"
                aria-label={`${HERO_QUOTE.name.split(",")[0]}, beta member`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  flexShrink: 0,
                  backgroundColor: "var(--gold-200, #EAD9B8)",
                  backgroundImage: `url("${HERO_QUOTE.photo}"), linear-gradient(150deg,#EAD9B8,#C9986A)`,
                  backgroundSize: "cover, cover",
                  backgroundPosition: "center, center",
                  backgroundRepeat: "no-repeat, no-repeat",
                  boxShadow: "var(--shadow-1)",
                }}
              />
              <div style={{ lineHeight: 1.4 }}>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-body)",
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{HERO_QUOTE.quote}&rdquo;
                </div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {HERO_QUOTE.name} · {HERO_QUOTE.location}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 380 }}>
          <ChatVideo />
        </div>
      </div>
    </section>
  );
}
