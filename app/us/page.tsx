import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { JoinProvider } from "@/components/JoinProvider";
import { UsJoinModal } from "@/components/sections/UsJoinModal";
import { UsPage } from "@/components/sections/UsPage";

/**
 * /us - the North America dual-sided split test.
 *
 * India-primary, US household admin as the add-on - deliberately the inverse of
 * /gulf, which led with the local side and converted 5x worse than the single
 * India page for the same audience. Two SKUs (Niro India $99, Niro Prime Global
 * $169) so the test reads dual willingness-to-pay directly.
 *
 * Like /gulf this is a deliberate dead end: noindex/nofollow, self-referencing
 * canonical, and no link back to the main site (the nav wordmark points to /us),
 * so the split test stays clean.
 */
export const metadata: Metadata = {
  title: "Niro - your parents in India, and your household here",
  description:
    "For Indian families in the US. A named person for your parents back home and the household admin here. Health, paperwork, repairs, school runs - handled on WhatsApp.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tellniro.com/us" },
  openGraph: {
    title: "Niro - your parents in India, and your household here",
    description:
      "For Indian families in the US. One person for both sides of your family's life. Join the waitlist.",
    type: "website",
    url: "https://tellniro.com/us",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niro - your parents in India, and your household here",
    description:
      "For Indian families in the US. One person for both sides of your family's life.",
  },
};

export default function Page() {
  return (
    <JoinProvider market="us_dual">
      <UsPage />
      <Footer tagline="Niro - less household admin. More time for your family." />
      <UsJoinModal />
    </JoinProvider>
  );
}
