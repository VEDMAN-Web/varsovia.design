"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { clearIntroPending, markIntroPending } from "@/lib/introUtils";

type IntroContextValue = {
  /** True once overlay is gone and page may animate in */
  introComplete: boolean;
  /** Mount page under the overlay so the first paint is ready before handoff */
  mountPage: boolean;
  showPreloader: boolean;
  /** Call when portal zoom starts — mounts page under the overlay early */
  prepareIntro: () => void;
  finishIntro: () => void;
  /**
   * Re-run the intro animation programmatically (e.g. logo click).
   * Returns a Promise that resolves once the animation completes.
   */
  replayIntro: () => Promise<void>;
};

const IntroContext = createContext<IntroContextValue>({
  introComplete: true,
  mountPage: true,
  showPreloader: false,
  prepareIntro: () => {},
  finishIntro: () => {},
  replayIntro: () => Promise.resolve(),
});

export function useIntroComplete() {
  return useContext(IntroContext).introComplete;
}

export function useIntro() {
  return useContext(IntroContext);
}

/** Trigger the preloader animation programmatically and await its completion. */
export function useReplayIntro() {
  return useContext(IntroContext).replayIntro;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Full-document intro. Shows on every hard load / refresh.
 * Client-side navigations keep this provider mounted so the intro does not
 * re-run automatically — use replayIntro() to trigger it explicitly.
 */
export default function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [mountPage, setMountPage] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const finishedRef = useRef(false);
  const handoffRaf = useRef(0);
  // Resolvers waiting for the next finishIntro call
  const replayResolversRef = useRef<Array<() => void>>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      finishedRef.current = true;
      setShowPreloader(false);
      setMountPage(true);
      setIntroComplete(true);
      clearIntroPending();
      return;
    }
    markIntroPending();
  }, []);

  useLayoutEffect(() => {
    if (!showPreloader) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showPreloader]);

  useLayoutEffect(() => {
    return () => {
      if (handoffRaf.current) cancelAnimationFrame(handoffRaf.current);
    };
  }, []);

  const prepareIntro = useCallback(() => {
    setMountPage(true);
  }, []);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    setMountPage(true);

    // Single RAF: let browser paint the ready page, then lift overlay
    handoffRaf.current = requestAnimationFrame(() => {
      setIntroComplete(true);
      setShowPreloader(false);
      document.body.style.overflow = "";
      clearIntroPending();

      // Resolve any callers waiting on replayIntro()
      const resolvers = replayResolversRef.current.splice(0);
      for (const resolve of resolvers) resolve();
    });
  }, []);

  const replayIntro = useCallback((): Promise<void> => {
    // Skip animation entirely for users who prefer reduced motion
    if (prefersReducedMotion()) return Promise.resolve();

    return new Promise<void>((resolve) => {
      // Cancel any in-flight handoff RAF so state doesn't get clobbered mid-reset
      if (handoffRaf.current) {
        cancelAnimationFrame(handoffRaf.current);
        handoffRaf.current = 0;
      }

      // Queue this caller to be resolved when finishIntro fires
      replayResolversRef.current.push(resolve);

      // Reset all intro state — triggers the preloader to remount + play
      finishedRef.current = false;
      markIntroPending();

      // Hide content immediately so there's no flash of the page
      setIntroComplete(false);
      setMountPage(false);
      setShowPreloader(true);
    });
  }, []);

  const value = useMemo(
    () => ({
      introComplete,
      mountPage,
      showPreloader,
      prepareIntro,
      finishIntro,
      replayIntro,
    }),
    [introComplete, mountPage, showPreloader, prepareIntro, finishIntro, replayIntro],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
