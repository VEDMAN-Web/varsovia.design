"use client";

import { RefObject, useEffect, useState } from "react";
import { usePathname } from "@/lib/i18n/navigation";

/**
 * Frosted header over dark heroes. IntersectionObserver on `[data-nav-backdrop]`
 * — no scroll handler, no getBoundingClientRect on every frame.
 */
export function useNavBackdropTone(headerRef: RefObject<HTMLElement | null>) {
  const pathname = usePathname();
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const intersecting = new Set<Element>();
    let observer: IntersectionObserver | null = null;

    const publish = () => {
      let dark = false;
      intersecting.forEach((el) => {
        if (el.getAttribute("data-nav-backdrop") === "dark") dark = true;
      });
      setOverDark(dark);
    };

    const connect = () => {
      observer?.disconnect();
      intersecting.clear();

      const headerBottom = Math.max(8, Math.round(header.getBoundingClientRect().bottom));
      const bottomGap = Math.max(0, window.innerHeight - headerBottom - 1);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          }
          publish();
        },
        {
          root: null,
          rootMargin: `-${headerBottom}px 0px -${bottomGap}px 0px`,
          threshold: 0,
        },
      );

      document.querySelectorAll("[data-nav-backdrop]").forEach((el) => observer?.observe(el));
      publish();
    };

    connect();
    window.addEventListener("resize", connect, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", connect);
    };
  }, [headerRef, pathname]);

  return overDark;
}
