"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import { usePathname } from "@/lib/i18n/navigation";
import { clearIntroPending } from "@/lib/introUtils";

function RouteChangeCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    clearIntroPending();
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}

/**
 * Site-wide inertia smooth scroll (Lenis) ÔÇö the same technique used by
 * award-winning interior/architecture studio sites. Runs on the real
 * `window` scroll (no transform-wrapper hack), so fixed headers, sticky
 * elements and native anchor links keep working exactly as before.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.11,
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        gestureOrientation: "vertical",
        anchors: { offset: -88 },
        stopInertiaOnNavigate: true,
      }}
    >
      <RouteChangeCleanup />
      {children}
    </ReactLenis>
  );
}
