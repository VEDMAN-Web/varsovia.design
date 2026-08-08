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
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

// ─── Timings ─────────────────────────────────────────────────────────────────
/** Logo hold before zoom starts — 0.7 seconds */
export const PRELOADER_HOLD = 0.6;
/** Portal zoom duration */
export const PRELOADER_ZOOM = 0.85;

// ─── Constants ───────────────────────────────────────────────────────────────
const MASK_ID = "varsovia-wing-portal-mask";
const OVERLAY = "#ffffff";
const FALLBACK_HERO = MEDIA.hero;

// ─── Types ───────────────────────────────────────────────────────────────────
type HomePreloaderProps = {
  show: boolean;
  onComplete: () => void;
  onPrepare?: () => void;
  heroImage?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readViewport() {
  if (typeof window === "undefined") return { w: 0, h: 0 };
  return { w: window.innerWidth, h: window.innerHeight };
}

function preloadImage(src: string): Promise<void> {
  return new Promise<void>((resolve) => {
    // Preload hint
    try {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      (link as any).fetchPriority = "high";
      document.head.appendChild(link);
    } catch { /* ignore */ }

    const img = new Image();
    (img as any).fetchPriority = "high";
    img.src = src;
    if (img.complete) { resolve(); return; }
    img.onload = () => resolve();
    img.onerror = () => resolve();
    window.setTimeout(resolve, 3000); // safety cap
  });
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const t = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { window.clearTimeout(t); reject(); });
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function HomePreloader({
  show,
  onComplete,
  onPrepare,
  heroImage,
}: HomePreloaderProps) {
  const reducedMotion = useReducedMotion();
  const imageSrc = resolveMediaUrl(heroImage, FALLBACK_HERO);

  // Viewport size
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const sync = () => setViewport(readViewport());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Hero image preload
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setHeroReady(false);
    preloadImage(imageSrc).then(() => { if (!cancelled) setHeroReady(true); });
    return () => { cancelled = true; };
  }, [imageSrc]);

  // Animation phase — false = logo at rest, true = portal zooming
  const [animating, setAnimating] = useState(false);

  // Keep stable refs to callbacks
  const onCompleteRef = useRef(onComplete);
  const onPrepareRef = useRef(onPrepare);
  onCompleteRef.current = onComplete;
  onPrepareRef.current = onPrepare;

  // Guard against double-fire
  const finishedRef = useRef(false);
  const finishOnce = useRef(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onCompleteRef.current();
  });

  // ─── KEY FIX: use a run-counter so the effect re-fires every time show
  //     flips to true, even when it was already true from a previous run.
  const runCountRef = useRef(0);
  const [runKey, setRunKey] = useState(0);

  useLayoutEffect(() => {
    if (show) {
      // Every time show becomes true, bump the key → forces effect re-run
      runCountRef.current += 1;
      setRunKey(runCountRef.current);
      // Reset local animation state for a clean replay
      finishedRef.current = false;
      setAnimating(false);
    }
  }, [show]);

  const ready = viewport.w > 0 && viewport.h > 0;

  // ─── Main animation sequence — driven by runKey, not show ─────────────────
  useLayoutEffect(() => {
    // runKey === 0 is initial mount before show was ever true
    if (runKey === 0 || !ready || !heroReady) return;
    if (!show) return;

    const abort = new AbortController();
    const holdMs  = reducedMotion ? 0   : PRELOADER_HOLD * 1000;
    const zoomMs  = reducedMotion ? 180 : PRELOADER_ZOOM * 1000;

    const run = async () => {
      try {
        // 1. Wait for fonts — capped at 300ms so we never block longer than hold
        if (document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            wait(300, abort.signal),
          ]).catch(() => {});
        }
        if (abort.signal.aborted) return;

        // 2. HOLD — 1 full second: logo visible, white mask, hero below
        await wait(holdMs, abort.signal);
        if (abort.signal.aborted) return;

        // 3. Mount page UNDER overlay right before zoom — so it's ready when
        //    the overlay lifts. Doing this here (not before hold) prevents a
        //    flash of the underlying page during the hold phase.
        onPrepareRef.current?.();

        // 4. One rAF to let browser flush the mount before CSS transition starts
        await new Promise<void>((res) => requestAnimationFrame(() => res()));
        if (abort.signal.aborted) return;

        // 5. Start GPU CSS zoom
        setAnimating(true);

        // 6. Wait for zoom + small tail
        await wait(zoomMs + 100, abort.signal);
        if (!abort.signal.aborted) finishOnce.current();
      } catch { /* aborted */ }
    };

    void run();
    return () => abort.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey, ready, heroReady]);

  // Fallback: listen for CSS transitionend so finish fires even if timing drifts
  const portalGroupRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const group = portalGroupRef.current;
    if (!group || !animating) return;
    const onEnd = () => finishOnce.current();
    group.addEventListener("transitionend", onEnd, { once: true });
    return () => group.removeEventListener("transitionend", onEnd);
  }, [animating]);

  // ─── Render ────────────────────────────────────────────────────────────────
  if (!show) return null;

  if (!ready) {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-white"
        aria-hidden="true"
        role="presentation"
      />
    );
  }

  const layout = wingPortalCenter(viewport.w, viewport.h);
  const endScale = portalEndScale(viewport.w, viewport.h, layout.cx, layout.cy);
  const zoomMs = reducedMotion ? 180 : PRELOADER_ZOOM * 1000;
  const currentScale = animating ? endScale : PRELOADER_INITIAL_SCALE;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-white"
      aria-hidden={!show}
      role="presentation"
      aria-label="Loading Varsovia Design"
    >
      {/* ── Hero image — GPU layer, subtle Ken Burns during zoom ── */}
      <div
        className="absolute inset-0"
        style={{
          willChange: animating ? "transform" : "auto",
          transform: animating ? "scale(1.08)" : "scale(1)",
          transition: animating
            ? `transform ${zoomMs}ms cubic-bezier(0.25, 0, 0.15, 1)`
            : "none",
          transformOrigin: "center center",
        }}
      >
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover object-center"
          aria-hidden="true"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      {/* ── White overlay with SVG wing mask — grows via CSS transition ── */}
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
            {/* White = visible overlay */}
            <rect width={viewport.w} height={viewport.h} fill="white" />
            {/* Black = transparent hole — the wing that grows */}
            <g transform={layout.portalTranslate}>
              <g
                ref={portalGroupRef}
                style={{
                  transform: `scale(${currentScale})`,
                  transformOrigin: "0 0",
                  willChange: animating ? "transform" : "auto",
                  transition: animating
                    ? `transform ${zoomMs}ms cubic-bezier(0.25, 0, 0.15, 1)`
                    : "none",
                }}
              >
                <path
                  d={WING_PATH}
                  fill="black"
                  transform={layout.wingInnerTransform}
                />
              </g>
            </g>
          </mask>
        </defs>
        <rect
          width={viewport.w}
          height={viewport.h}
          fill={OVERLAY}
          mask={`url(#${MASK_ID})`}
        />
      </svg>

    </div>
  );
}

// ─── Gate wired to IntroProvider ─────────────────────────────────────────────
export function HomePreloaderGate({ heroImage }: { heroImage?: string }) {
  const { showPreloader, finishIntro, prepareIntro } = useIntro();

  return (
    <HomePreloader
      show={showPreloader}
      onComplete={finishIntro}
      onPrepare={prepareIntro}
      heroImage={heroImage}
    />
  );
}
