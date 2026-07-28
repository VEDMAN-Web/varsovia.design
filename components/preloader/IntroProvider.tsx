"use client";

import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

const INTRO_STORAGE_KEY = "varsovia-intro-seen";

type IntroContextValue = {
  introComplete: boolean;
  showPreloader: boolean;
  finishIntro: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  introComplete: true,
  showPreloader: false,
  finishIntro: () => {},
});

export function useIntroComplete() {
  return useContext(IntroContext).introComplete;
}

export function useIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({
  children,
  onIntroClear,
}: {
  children: ReactNode;
  onIntroClear?: () => void;
}) {
  const [introComplete, setIntroComplete] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const finishedRef = useRef(false);

  useLayoutEffect(() => {
    const seen = sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setShowPreloader(false);
      setIntroComplete(true);
      finishedRef.current = true;
      onIntroClear?.();
      return;
    }
    document.documentElement.classList.add("intro-pending");
  }, [onIntroClear]);

  useLayoutEffect(() => {
    if (!showPreloader) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showPreloader]);

  const finishIntro = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    // Hero unlocks first; overlay removed same frame — no gap
    setIntroComplete(true);
    setShowPreloader(false);
    document.body.style.overflow = "";
    onIntroClear?.();
  };

  const value = useMemo(
    () => ({ introComplete, showPreloader, finishIntro }),
    [introComplete, showPreloader],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
