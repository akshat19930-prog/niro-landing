import { SHARE_CARD } from "@/lib/content";
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
  title: SHARE_CARD.title,
  description: SHARE_CARD.description,
  openGraph: {
    title: SHARE_CARD.title,
    description: SHARE_CARD.description,
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
