import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";

/** Nav + content + Footer shell for standalone pages (legal, about).
 *  The nav CTA points back to the home join section. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav href="/#join" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
