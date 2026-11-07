import { SHARE_CARD } from "@/lib/content";
import type { Metadata, Viewport } from "next";
import { MetaPixel } from "@/components/MetaPixel";
import { PostHog } from "@/components/PostHog";
import { VariantInit } from "@/components/VariantInit";
import { HeroInit } from "@/components/HeroInit";
import "./globals.css";

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
    <html lang="en">
      <head>
        {/* The two faces above the fold. Same origin, so they still need
            crossOrigin: a font fetch is CORS-mode either way, and without
            it the browser downloads the file twice. The italic face is not
            preloaded; almost nothing on the site uses it. */}
        <link
          rel="preload"
          href="/fonts/hanken-grotesk-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/newsreader-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Before the pixel, which fires PageView at parse time: that event
            has to carry the arm or the test's top-of-funnel number is blind. */}
        <VariantInit />
        {/* After VariantInit: the hero test only enrols arm A visitors. */}
        <HeroInit />
        <MetaPixel />
        <PostHog />
        {children}
      </body>
    </html>
  );
}
