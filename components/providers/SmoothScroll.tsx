"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "@/lib/i18n/navigation";
import { clearIntroPending } from "@/lib/introUtils";
import { shouldUseLuxuryWheel } from "@/lib/scrollRuntime";

const LenisContext = createContext<Lenis | null>(null);

export function useOptionalLenis() {
  return useContext(LenisContext);
}

function RouteChangeCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    clearIntroPending();
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}

function lenisIsEasing(lenis: Lenis) {
  return (
    lenis.isScrolling === "smooth" ||
    (typeof lenis.velocity === "number" && Math.abs(lenis.velocity) > 0.04)
  );
}

/**
 * Luxury wheel easing on capable desktops only.
 * Phones/tablets keep native OS momentum (Google-grade compositor path).
 * Lenis is not mounted into the React tree — creating it never remounts the app.
 * RAF runs only while a wheel ease is in flight.
 */
function LuxuryWheelProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const instanceRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let rafId = 0;
    let running = false;

    const stopRaf = () => {
      running = false;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const loop = (time: number) => {
      const instance = instanceRef.current;
      if (!instance) {
        stopRaf();
        return;
      }
      instance.raf(time);
      // Only continue RAF loop if actually scrolling with momentum
      if (lenisIsEasing(instance)) {
        rafId = requestAnimationFrame(loop);
      } else {
        running = false;
        rafId = 0;
      }
    };

    const kickRaf = () => {
      if (!instanceRef.current || running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const destroy = () => {
      if (!instanceRef.current) return;
      stopRaf();
      window.removeEventListener("wheel", kickRaf);
      instanceRef.current.off("scroll", kickRaf);
      instanceRef.current.destroy();
      instanceRef.current = null;
      setLenis(null);
      document.documentElement.dataset.smoothScroll = "native";
    };

    const create = () => {
      if (instanceRef.current) return;
      const instance = new Lenis({
        wrapper: window,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.2,
        duration: 0.9,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        gestureOrientation: "vertical",
        anchors: { offset: -88 },
        stopInertiaOnNavigate: true,
        autoToggle: false,
        autoRaf: false,
        overscroll: true,
        allowNestedScroll: true,
      });
      instance.on("scroll", kickRaf);
      instanceRef.current = instance;
      setLenis(instance);
      document.documentElement.dataset.smoothScroll = "lenis";
      window.addEventListener("wheel", kickRaf, { passive: true });
    };

    const sync = () => {
      if (shouldUseLuxuryWheel()) create();
      else destroy();
    };

    sync();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const hover = window.matchMedia("(hover: none)");
    motion.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    hover.addEventListener("change", sync);
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      motion.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      hover.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      destroy();
      document.documentElement.removeAttribute("data-smooth-scroll");
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <LuxuryWheelProvider>
      <RouteChangeCleanup />
      {children}
    </LuxuryWheelProvider>
  );
}
