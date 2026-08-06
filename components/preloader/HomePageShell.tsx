"use client";

import { useLayoutEffect, type ReactNode } from "react";
import IntroProvider, { useIntro } from "@/components/preloader/IntroProvider";
import { HomePreloaderGate } from "@/components/preloader/HomePreloader";
import { clearIntroPending } from "@/lib/introUtils";

/** Page stays unmounted until handoff starts — then paints under the overlay. */
function IntroContent({ children }: { children: ReactNode }) {
  const { mountPage, introComplete } = useIntro();

  useLayoutEffect(() => {
    if (introComplete) clearIntroPending();
  }, [introComplete]);

  if (!mountPage) return null;

  return (
    <div
      id="app-page-content"
      className={introComplete ? "intro-content-ready" : "intro-content-pending"}
    >
      {children}
    </div>
  );
}

type SiteIntroShellProps = {
  children: ReactNode;
  heroImage?: string;
};

/** Site-wide loader: every hard refresh, every route — not on client navigations. */
export default function SiteIntroShell({ children, heroImage }: SiteIntroShellProps) {
  return (
    <IntroProvider>
      <HomePreloaderGate heroImage={heroImage} />
      <IntroContent>{children}</IntroContent>
    </IntroProvider>
  );
}

/** @deprecated Use SiteIntroShell — kept so existing imports keep working during migrate */
export { SiteIntroShell as HomePageShell };
