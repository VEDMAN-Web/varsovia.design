"use client";

import { RefObject, useEffect, useState } from "react";
import { rafThrottle } from "@/lib/scrollRuntime";

/**
 * Frosted header over dark heroes. Samples `[data-nav-backdrop]` bands only —
 * no elementFromPoint / getComputedStyle walks on every Lenis frame.
 */
export function useNavBackdropTone(headerRef: RefObject<HTMLElement | null>) {
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let last = false;

    const sample = () => {
      const rect = header.getBoundingClientRect();
      const y = Math.min(window.innerHeight - 2, Math.max(0, rect.bottom + 4));
      const bands = document.querySelectorAll("[data-nav-backdrop]");
      let dark = false;
      for (let i = 0; i < bands.length; i += 1) {
        const r = bands[i].getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          dark = bands[i].getAttribute("data-nav-backdrop") === "dark";
          break;
        }
      }
      if (dark !== last) {
        last = dark;
        setOverDark(dark);
      }
    };

    const onScroll = rafThrottle(sample);
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headerRef]);

  return overDark;
}
