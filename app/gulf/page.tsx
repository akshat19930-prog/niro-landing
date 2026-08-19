import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { JoinProvider } from "@/components/JoinProvider";
import { GulfJoinModal } from "@/components/sections/GulfJoinModal";
import { GulfPage } from "@/components/sections/GulfPage";

/**
 * /gulf — the dual-sided, single-SKU ($149) landing page for the Gulf Meta
 * split test (Cell A). Cell B is the existing India-only "/" page; Meta keeps
 * the audiences mutually exclusive, so this page is a deliberate dead end:
 * noindex/nofollow, self-referencing canonical, and no link back to the main
 * site (see GulfPage — the nav wordmark points to /gulf).
 */
export const metadata: Metadata = {
  title: "Niro — one house manager, both the places you call home",
  description:
    "A named person for your home in the Gulf and your parents in India. Domestic help, school runs, Emirates ID, appointments back home. Get back 15+ hours a month.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tellniro.com/gulf" },
  openGraph: {
    title: "Niro — one house manager, both the places you call home",
    description:
      "For Indian families in the Gulf. A named person for your household here and your parents in India. Join the waitlist.",
    type: "website",
    url: "https://tellniro.com/gulf",
    images: ["/media/gulf-hero-poster.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Niro — one house manager, both the places you call home",
    description:
      "For Indian families in the Gulf. A named person for your household here and your parents in India.",
    images: ["/media/gulf-hero-poster.jpg"],
  },
};

export default function Page() {
  return (
    <JoinProvider market="gulf">
      <GulfPage />
      <Footer tagline="Niro — your family's own person, in both the places you call home." />
      <GulfJoinModal />
    </JoinProvider>
  );
}
