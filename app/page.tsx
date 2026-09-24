import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { JoinProvider } from "@/components/JoinProvider";
import { JoinModal } from "@/components/sections/JoinModal";
import { VariantB } from "@/components/sections/VariantB";

/**
 * Home page. The control-vs-reposition A/B concluded a statistical tie with the
 * reposition marginally ahead and better aligned to the dual-sided strategy, so
 * the reposition ("You can't always be in India. Niro can.") is now the single
 * live page. VariantB renders its own Nav + sections + sticky CTA.

 * Its own share card: the home link is the one that gets pasted into WhatsApp,
 * so it carries the art (design/og-home.source.html, rendered at 1200x630) and
 * the assistant line. Every other page inherits the plain card from the layout.
 */
export const metadata: Metadata = {
  openGraph: {
    title: "Niro - Your family's own person in India",
    description:
      "Your family's personal assistant in India, getting things done for them and for you.",
    type: "website",
    url: "https://tellniro.com/",
    siteName: "Niro",
    // Absolute URL: WhatsApp and Meta fetch the card without our page context.
    images: [{ url: "https://tellniro.com/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Niro - Your family's own person in India",
    description:
      "Your family's personal assistant in India, getting things done for them and for you.",
    images: ["https://tellniro.com/og/home.png"],
  },
};

export default function Page() {
  return (
    <JoinProvider>
      <VariantB />
      <Footer />
      <JoinModal />
    </JoinProvider>
  );
}
