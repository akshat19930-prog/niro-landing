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
import { JoinModal } from "@/components/sections/JoinModal";
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
        {/* Proof sits right after the mechanism - it answers "does this really
            work?" at peak skepticism, and is seen by far more visitors than
            when it lived near the bottom. */}
        <Proof />
        <WhatWeHandle />
        <EmergencyStory />
        <Faq />
      </main>

      <Footer />

      <StickyCta />
      <JoinModal />
    </JoinProvider>
  );
}
