"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import IntroProvider, { useIntro } from "@/components/preloader/IntroProvider";
import { HomePreloaderGate } from "@/components/preloader/HomePreloader";
import { usePathname } from "@/lib/i18n/navigation";
import { clearIntroPending } from "@/lib/introUtils";
import { readMountedPageHeroSrc, storePreloaderBackground } from "@/lib/preloaderBackground";

function PageBackgroundCapture() {
  const pathname = usePathname();
  const { mountPage, introComplete } = useIntro();

  useEffect(() => {
    if (!mountPage) return;

    const capture = () => {
      const src = readMountedPageHeroSrc();
      if (src) storePreloaderBackground(pathname, src);
    };

    capture();
    const t = window.setTimeout(capture, 450);
    return () => window.clearTimeout(t);
  }, [pathname, mountPage, introComplete]);

  return null;
}

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
      <PageBackgroundCapture />
      {children}
    </div>
  );
}

type SiteIntroShellProps = {
  children: ReactNode;
};

/** Site-wide loader: every hard refresh, every route — not on client navigations. */
export default function SiteIntroShell({ children }: SiteIntroShellProps) {
  return (
    <IntroProvider>
      <HomePreloaderGate />
      <IntroContent>{children}</IntroContent>
    </IntroProvider>
  );
}

/** @deprecated Use SiteIntroShell — kept so existing imports keep working during migrate */
export { SiteIntroShell as HomePageShell };
