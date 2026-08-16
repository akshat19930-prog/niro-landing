import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { EmergencyStory } from "@/components/ds/EmergencyStory";
import { JoinProvider } from "@/components/JoinProvider";
import { AbExposure } from "@/components/AbExposure";
import { Hero } from "@/components/sections/Hero";
import {
  Mirror,
  HowItWorks,
  WhatWeHandle,
  Proof,
} from "@/components/sections/StaticSections";
import { JoinModal } from "@/components/sections/JoinModal";
import { Faq } from "@/components/sections/Faq";
import { StickyCta } from "@/components/sections/StickyCta";
import { VariantB } from "@/components/sections/VariantB";

export default function Page() {
  return (
    <JoinProvider>
      <AbExposure />

      {/* Arm A — control (current page). Both arms ship in the static HTML;
          AbInit stamps data-pg at parse time and CSS shows only the assigned
          one, so there is no flash. */}
      <div className="pg-a">
        <Nav />
        <main>
          <Hero />
          <Mirror />
          <HowItWorks />
          <Proof />
          <WhatWeHandle />
          <EmergencyStory />
          <Faq />
        </main>
        <StickyCta />
      </div>

      {/* Arm B — "You can't always be in India. Niro can." reposition. */}
      <div className="pg-b">
        <VariantB />
      </div>

      <Footer />
      <JoinModal />
    </JoinProvider>
  );
}
