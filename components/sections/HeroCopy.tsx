"use client";

import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { HERO_VARIANTS, DEFAULT_VARIANT, resolveVariant } from "@/lib/content";

/**
 * Ad-matched hero copy. Renders the default variant on the server / first
 * client render (so hydration matches), then swaps to the ?v=1..4 variant on
 * mount. Only the eyebrow / headline / subhead change between variants.
 */
export function HeroCopy() {
  const [variant, setVariant] = useState<keyof typeof HERO_VARIANTS>(DEFAULT_VARIANT);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    setVariant(resolveVariant(v));
  }, []);

  const hero = HERO_VARIANTS[variant];

  return (
    <>
      {hero.tag && <Eyebrow>{hero.tag}</Eyebrow>}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-4xl)",
          lineHeight: "var(--leading-tight)",
          letterSpacing: "var(--tracking-tight)",
          color: "var(--text-strong)",
          margin: "20px 0 18px",
          fontWeight: 500,
        }}
      >
        {hero.h}
      </h1>
      <p
        style={{
          fontSize: "var(--text-md)",
          lineHeight: "var(--leading-body)",
          color: "var(--text-body)",
          maxWidth: 520,
          margin: "0 0 30px",
        }}
      >
        {hero.s}
      </p>
    </>
  );
}
