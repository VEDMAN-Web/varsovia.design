"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIntro } from "@/components/preloader/IntroProvider";
import {
  PRELOADER_INITIAL_SCALE,
  WING_PATH,
  portalEndScale,
  wingPortalCenter,
} from "@/components/preloader/preloaderLogo";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { usePathname } from "@/lib/i18n/navigation";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import {
  pickPreloaderBackground,
  readMountedPageHeroSrc,
  resolvePreloaderBackground,
  storePreloaderBackground,
} from "@/lib/preloaderBackground";

/** Hold on white + wing window, then portal zoom */
export const PRELOADER_HOLD = 1;
export const PRELOADER_ZOOM = 1.35;

const MASK_ID = "varsovia-wing-portal-mask";
const OVERLAY = "#ffffff";
const PORTAL_EASE = "cubic-bezier(0.76, 0, 0.2, 1)";
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

type HomePreloaderProps = {
  show: boolean;
  onComplete: () => void;
  /** Fired when the destination page should mount under the overlay */
  onPrepare?: () => void;
  heroImage?: string;
  pathname?: string;
};

function readViewport() {
  if (typeof window === "undefined") return { w: 0, h: 0 };
  return { w: window.innerWidth, h: window.innerHeight };
}

function preloadHero(src: string) {
  return new Promise<void>((resolve) => {
    if (!src || src.startsWith("data:")) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    if (img.complete) {
      resolve();
      return;
    }
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/** Smooth step for portal easing (matches PORTAL_EASE feel) */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Animate SVG portal hole — scale only, origin = parent translate(cx,cy) */
function animatePortalHole(
  portal: SVGGElement,
  startScale: number,
  targetScale: number,
  durationMs: number,
  signal: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const t = Math.min(1, (now - start) / durationMs);
      const scale = startScale + (targetScale - startScale) * easeOutCubic(t);
      portal.setAttribute("transform", `scale(${scale})`);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    signal.addEventListener("abort", () => {
      cancelAnimationFrame(frame);
      reject(new DOMException("Aborted", "AbortError"));
    });

    portal.setAttribute("transform", `scale(${startScale})`);
    frame = requestAnimationFrame(tick);
  });
}

function animateHeroKenBurns(
  hero: HTMLElement,
  durationMs: number,
  signal: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    const animation = hero.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.12)" }],
      { duration: durationMs, easing: PORTAL_EASE, fill: "forwards" },
    );
    signal.addEventListener("abort", () => {
      animation.cancel();
      reject(new DOMException("Aborted", "AbortError"));
    });
    animation.onfinish = () => resolve();
    animation.oncancel = () => reject(new DOMException("Aborted", "AbortError"));
  });
}

export default function HomePreloader({
  show,
  onComplete,
  onPrepare,
  heroImage,
  pathname = "/",
}: HomePreloaderProps) {
  const reducedMotion = useReducedMotion();
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onPrepareRef = useRef(onPrepare);
  const pathnameRef = useRef(pathname);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [heroReady, setHeroReady] = useState(false);
  const portalRef = useRef<SVGGElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  onCompleteRef.current = onComplete;
  onPrepareRef.current = onPrepare;
  pathnameRef.current = pathname;
  const imageSrc = heroImage ? resolveMediaUrl(heroImage, heroImage) : "";

  useLayoutEffect(() => {
    const sync = () => setViewport(readViewport());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!imageSrc) {
      setHeroReady(true);
      return;
    }
    setHeroReady(false);
    preloadHero(imageSrc).then(() => {
      if (!cancelled) setHeroReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  useLayoutEffect(() => {
    if (show) finishedRef.current = false;
  }, [show]);

  const finishOnce = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onCompleteRef.current();
  };

  const ready = viewport.w > 0 && viewport.h > 0;
  const layout = ready ? wingPortalCenter(viewport.w, viewport.h) : null;

  useLayoutEffect(() => {
    if (!show || !ready || !heroReady) return;

    const portalLayout = wingPortalCenter(viewport.w, viewport.h);
    const portal = portalRef.current;
    const hero = heroRef.current;
    if (!portal || !hero) return;

    const abort = new AbortController();
    const targetScale = portalEndScale(
      viewport.w,
      viewport.h,
      portalLayout.cx,
      portalLayout.cy,
    );
    const zoomMs = reducedMotion ? 320 : PRELOADER_ZOOM * 1000;

    hero.style.transformOrigin = "center center";
    hero.style.transform = "scale(1)";
    portal.setAttribute("transform", `scale(${PRELOADER_INITIAL_SCALE})`);

    const applyLiveHero = async () => {
      const live = readMountedPageHeroSrc();
      if (!live) return;
      storePreloaderBackground(pathnameRef.current, live);
      const img = imgRef.current;
      const resolved = resolveMediaUrl(live, live);
      if (!img || !resolved) return;
      const current = img.currentSrc || img.src;
      if (current === resolved) return;
      await preloadHero(resolved);
      if (abort.signal.aborted) return;
      img.src = resolved;
    };

    const run = async () => {
      try {
        // Mount destination page under overlay so its first-screen photo can fill the wing
        onPrepareRef.current?.();

        if (document.fonts?.ready) {
          try {
            await Promise.race([
              document.fonts.ready,
              new Promise<void>((resolve) => {
                window.setTimeout(resolve, 800);
              }),
            ]);
          } catch {
            /* ignore */
          }
          if (abort.signal.aborted) return;
        }

        const holdMs = reducedMotion ? 0 : PRELOADER_HOLD * 1000;
        const stealDeadline = Math.max(120, Math.min(holdMs || 180, 420));
        const stealUntil = performance.now() + stealDeadline;
        while (performance.now() < stealUntil) {
          if (abort.signal.aborted) return;
          if (readMountedPageHeroSrc()) {
            await applyLiveHero();
            break;
          }
          await wait(32, abort.signal);
        }

        const holdLeft = holdMs - stealDeadline;
        if (holdLeft > 0) {
          await wait(holdLeft, abort.signal);
        }
        if (abort.signal.aborted) return;

        await applyLiveHero();

        await Promise.all([
          animatePortalHole(portal, PRELOADER_INITIAL_SCALE, targetScale, zoomMs, abort.signal),
          animateHeroKenBurns(hero, zoomMs, abort.signal),
        ]);

        if (!abort.signal.aborted) finishOnce();
      } catch {
        /* aborted */
      }
    };

    void run();
    return () => abort.abort();
  }, [show, ready, heroReady, viewport.w, viewport.h, reducedMotion]);

  if (!show) return null;

  if (!ready || !layout) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white" aria-hidden="true" role="presentation" />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-white"
      aria-hidden={!show}
      aria-label="Loading Varsovia Design"
      role="presentation"
    >
      {/* Hero — fixed full bleed; revealed through growing vector wing hole */}
      <div ref={heroRef} className="absolute inset-0 will-change-transform">
        <img
          ref={imgRef}
          src={imageSrc || TRANSPARENT_PIXEL}
          alt=""
          className="h-full w-full object-cover object-center"
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* White overlay — fixed; only the SVG mask hole expands (vector portal) */}
      <svg
        width={viewport.w}
        height={viewport.h}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <defs>
          <mask
            id={MASK_ID}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={viewport.w}
            height={viewport.h}
          >
            <rect width={viewport.w} height={viewport.h} fill="white" />
            <g transform={layout.portalTranslate}>
              <g ref={portalRef}>
                <path d={WING_PATH} fill="black" transform={layout.wingInnerTransform} />
              </g>
            </g>
          </mask>
        </defs>
        <rect width={viewport.w} height={viewport.h} fill={OVERLAY} mask={`url(#${MASK_ID})`} />
      </svg>
    </div>
  );
}

export function HomePreloaderGate() {
  const { showPreloader, finishIntro, prepareIntro } = useIntro();
  const pathname = usePathname();
  const site = useSiteSettings();
  const fromRoute = resolvePreloaderBackground(pathname, site);
  const [heroImage, setHeroImage] = useState(fromRoute);

  useLayoutEffect(() => {
    setHeroImage(pickPreloaderBackground(pathname, site));
  }, [pathname, site, fromRoute]);

  return (
    <HomePreloader
      show={showPreloader}
      onComplete={finishIntro}
      onPrepare={prepareIntro}
      heroImage={heroImage}
      pathname={pathname}
    />
  );
}
