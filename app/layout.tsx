import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import { PostHog } from "@/components/PostHog";
import "./globals.css";

/**
 * Fonts are self-hosted: next/font downloads the woff2 files at build time and
 * serves them from our own origin - no runtime Google Fonts request, best LCP
 * on mobile. Each exposes a CSS variable that tokens.css maps to --font-*.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tellniro.com"),
  title: "Niro - Your family's own person in India",
  description:
    "One membership. A named associate for your parents' errands, bills, appointments, and emergencies - so you can be there, from anywhere.",
  openGraph: {
    title: "Niro - Your family's own person in India",
    description:
      "A named associate for errands, bills, appointments, and emergencies. Join the waitlist.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F1E7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${hanken.variable}`}>
      <body>
        <MetaPixel />
        <PostHog />
        {children}
      </body>
    </html>
  );
}
