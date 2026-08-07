import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { EmergencyStory } from "@/components/ds/EmergencyStory";
import { JoinProvider } from "@/components/JoinProvider";
import { Hero } from "@/components/sections/Hero";
import {
  Mirror,
  HowItWorks,
  WhatWeHandle,
  Proof,
} from "@/components/sections/StaticSections";
import { JoinFlow } from "@/components/sections/JoinFlow";
import { Faq } from "@/components/sections/Faq";
import { StickyCta } from "@/components/sections/StickyCta";

export default function Page() {
  return (
    <JoinProvider>
      <Nav />
      <main>
        <Hero />
        <Mirror />
        <HowItWorks />
        <WhatWeHandle />
        <EmergencyStory />
        <Proof />
        <JoinFlow />
        <Faq />
      </main>

      {/* One-line reassurance strip above the footer. */}
      <div
        style={{
          background: "var(--forest-950)",
          padding: "16px var(--gutter)",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)" }}>
          Associates on the ground across India · Serving families in the US &amp; UAE.
        </span>
      </div>
      <Footer />

      <StickyCta />
    </JoinProvider>
  );
}
