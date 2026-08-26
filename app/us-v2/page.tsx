import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { JoinProvider } from "@/components/JoinProvider";
import { UsJoinModal } from "@/components/sections/UsJoinModal";
import { UsPage } from "@/components/sections/UsPage";

/**
 * /us-v2 - STAGING ONLY. The India-first rework of /us, for review before it
 * replaces the live page.
 *
 * No ad points here and it is noindex, so it takes no traffic and cannot
 * contaminate the running dual-vs-single test. /us is untouched while this
 * exists. Once approved, /us switches to `indiaFirst` and this route is deleted.
 *
 * It shares JoinProvider market "us_dual" deliberately: if anyone does sign up
 * from a review pass, the lead still lands in the right bucket rather than
 * creating a market the report has never heard of.
 */
export const metadata: Metadata = {
  title: "Niro - staging - India-first",
  description: "Staging preview. Not for distribution.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tellniro.com/us-v2" },
};

export default function Page() {
  return (
    <JoinProvider market="us_dual">
      <UsPage indiaFirst />
      <Footer tagline="Niro - less household admin. More time for your family." />
      <UsJoinModal />
    </JoinProvider>
  );
}
