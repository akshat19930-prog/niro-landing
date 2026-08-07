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

      <Footer />

      <StickyCta />
    </JoinProvider>
  );
}
