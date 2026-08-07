import { Button } from "@/components/ds/Button";
import { WhatsAppShowcase } from "@/components/ds/WhatsAppShowcase";
import { TrustBar } from "@/components/ds/TrustBar";
import { HERO_MESSAGES, TRUST_ITEMS } from "@/lib/content";
import { HeroCopy } from "./HeroCopy";

/** Hero — two-column, stacks under ~680px via auto-fit. Copy is ad-matched
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
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <HeroCopy />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <Button href="#join" size="lg">
                Join the waitlist
              </Button>
            </div>
            {/* Reward for clicking + reassurance + price anchor — the three
                things a cold visitor needs before they'll spend an email. */}
            <div
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--brand)",
              }}
            >
              Your first task is on us — no card to join.
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Membership from $55/mo · cancel anytime · 20-second signup
            </div>
          </div>
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 380 }}>
          <WhatsAppShowcase messages={HERO_MESSAGES} />
        </div>
      </div>

      {/* Trust strip — first proof a cold, ad-sourced visitor sees, right under
          the hero. Legible even if the page is screenshotted from an ad. */}
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "40px auto 0",
          position: "relative",
        }}
      >
        <TrustBar items={TRUST_ITEMS} />
      </div>
    </section>
  );
}
