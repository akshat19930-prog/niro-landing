import { Footer } from "@/components/ds/Footer";
import { JoinProvider } from "@/components/JoinProvider";
import { JoinModal } from "@/components/sections/JoinModal";
import { VariantB } from "@/components/sections/VariantB";

/**
 * Home page. The control-vs-reposition A/B concluded a statistical tie with the
 * reposition marginally ahead and better aligned to the dual-sided strategy, so
 * the reposition ("You can't always be in India. Niro can.") is now the single
 * live page. VariantB renders its own Nav + sections + sticky CTA.
 */
export default function Page() {
  return (
    <JoinProvider>
      <VariantB />
      <Footer />
      <JoinModal />
    </JoinProvider>
  );
}
