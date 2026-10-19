"use client";

import { useEffect } from "react";

/**
 * Opens the catalogue card a jump link or a shared #anchor points at.
 *
 * The cards are native <details>, so they work with no JS at all; this only
 * makes sure a link to #health lands on an open card rather than a closed
 * heading. One listener, no state, nothing rendered.
 */
export function OpenOnHash() {
  useEffect(() => {
    function open() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) el.open = true;
    }
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
