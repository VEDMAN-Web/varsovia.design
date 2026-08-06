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
};

const IntroContext = createContext<IntroContextValue>({
  introComplete: true,
  mountPage: true,
  showPreloader: false,
  prepareIntro: () => {},
  finishIntro: () => {},
});

export function useIntroComplete() {
  return useContext(IntroContext).introComplete;
}

export function useIntro() {
  return useContext(IntroContext);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Full-document intro. Shows on every hard load / refresh.
 * Client-side navigations keep this provider mounted, so the intro does not re-run mid-session.
 */
export default function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [mountPage, setMountPage] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const finishedRef = useRef(false);
  const handoffRaf = useRef(0);

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

    // Ensure page is mounted under the overlay
    setMountPage(true);

    // Two frames: layout + paint, then lift overlay and unlock motion together
    const outer = requestAnimationFrame(() => {
      handoffRaf.current = requestAnimationFrame(() => {
        setIntroComplete(true);
        setShowPreloader(false);
        document.body.style.overflow = "";
        clearIntroPending();
      });
    });
    handoffRaf.current = outer;
  }, []);

  const value = useMemo(
    () => ({ introComplete, mountPage, showPreloader, prepareIntro, finishIntro }),
    [introComplete, mountPage, showPreloader, prepareIntro, finishIntro],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
