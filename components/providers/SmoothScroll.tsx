"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { usePathname } from "@/lib/i18n/navigation";
import { clearIntroPending } from "@/lib/introUtils";
import { shouldSmoothWheel } from "@/lib/scrollRuntime";

const LENIS_OPTIONS = {
  // Native first; SmoothScrollPolicy turns wheel easing on for capable desktops.
  smoothWheel: false,
  syncTouch: false,
  lerp: 0.2,
  duration: 0.8,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  gestureOrientation: "vertical" as const,
  anchors: { offset: -88 },
  stopInertiaOnNavigate: true,
  autoToggle: false,
  autoRaf: false,
  overscroll: true,
  allowNestedScroll: true,
};

function RouteChangeCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    clearIntroPending();
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}

function lenisNeedsRaf(lenis: {
  isScrolling: boolean | string;
  velocity: number;
}) {
  return (
    lenis.isScrolling === "smooth" ||
    (typeof lenis.velocity === "number" && Math.abs(lenis.velocity) > 0.04)
  );
}

/**
 * Lenis only eases desktop wheel/trackpad. Touch stays on native OS scrolling
 * (the compositor path Google measures for INP / mobile smoothness).
 * RAF runs only while a wheel ease is in flight — never a perpetual loop.
 */
function SmoothScrollPolicy() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let rafId = 0;
    let running = false;

    const loop = (time: number) => {
      if (!shouldSmoothWheel()) {
        running = false;
        lenis.options.smoothWheel = false;
        return;
      }
      lenis.raf(time);
      if (lenisNeedsRaf(lenis)) {
        rafId = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const kickRaf = () => {
      if (!shouldSmoothWheel() || running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const apply = () => {
      const enable = shouldSmoothWheel();
      lenis.options.smoothWheel = enable;
      document.documentElement.dataset.smoothScroll = enable ? "lenis" : "native";
      if (!enable) {
        running = false;
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    apply();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    motion.addEventListener("change", apply);
    coarse.addEventListener("change", apply);
    window.addEventListener("resize", apply, { passive: true });
    window.addEventListener("wheel", kickRaf, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      motion.removeEventListener("change", apply);
      coarse.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("wheel", kickRaf);
      document.documentElement.removeAttribute("data-smooth-scroll");
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root autoRaf={false} options={LENIS_OPTIONS}>
      <SmoothScrollPolicy />
      <RouteChangeCleanup />
      {children}
    </ReactLenis>
  );
}
