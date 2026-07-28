"use client";

import { useLayoutEffect, type ReactNode } from "react";
import IntroProvider, { useIntroComplete } from "@/components/preloader/IntroProvider";
import { HomePreloaderGate } from "@/components/preloader/HomePreloader";

const INTRO_CLASS = "intro-pending";

export function clearIntroPending() {
  document.documentElement.classList.remove(INTRO_CLASS);
}

/** Keep page unmounted during preloader — avoids main-thread jank mid-zoom */
function IntroContent({ children }: { children: ReactNode }) {
  const introComplete = useIntroComplete();

  useLayoutEffect(() => {
    if (introComplete) clearIntroPending();
  }, [introComplete]);

  if (!introComplete) return null;
  return <div id="home-page-content">{children}</div>;
}

type HomePageShellProps = {
  children: ReactNode;
  heroImage?: string;
};

export default function HomePageShell({ children, heroImage }: HomePageShellProps) {
  return (
    <IntroProvider onIntroClear={clearIntroPending}>
      <HomePreloaderGate heroImage={heroImage} />
      <IntroContent>{children}</IntroContent>
    </IntroProvider>
  );
}
