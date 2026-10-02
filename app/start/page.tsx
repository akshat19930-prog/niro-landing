import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { JoinProvider } from "@/components/JoinProvider";
import { JoinModal } from "@/components/sections/JoinModal";
import { VariantB } from "@/components/sections/VariantB";

/**
 * /start - arm B2 of the positioning A/B. Oct 2026.
 *
 * Sales kept hitting the same wall: buyers get convinced, go to ask their
 * parents, and drop. This arm sells Niro as the NRI's own 1:1 assistant for
 * everything back home, so there is nobody to ask for sign-off, and the family
 * group becomes an optional later step rather than the premise of the product.
 * Price, offer and scope are identical to /. Only the story changes.
 *
 * The two arms are driven by two Meta campaigns pointed at two URLs, not by a
 * split on one URL: Meta's own Experiments tool keeps the audiences from
 * overlapping, which a client-side split cannot. So there is no assignment
 * logic here, only a page.
 *
 * NOT INDEXED, and canonical to /. Two near-identical pages are the textbook
 * way to split your own ranking, and this one is meant to be reachable only
 * from an ad for the fourteen days the test runs. Nothing on the site links
 * here. Note this is a static export, so noindex is a request to crawlers, not
 * a lock: anyone with the URL can open it.
 *
 * To retire it, follow /us and /gulf: leave the route as a meta-refresh stub
 * pointing at /, because the URL will be sitting in old ad destinations and in
 * WhatsApp threads long after the campaign is switched off.
 */
export const metadata: Metadata = {
  title: "Niro",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tellniro.com/" },
};

export default function StartPage() {
  return (
    <JoinProvider>
      <VariantB arm="B2" />
      <Footer />
      <JoinModal />
    </JoinProvider>
  );
}
