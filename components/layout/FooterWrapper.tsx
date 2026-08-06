"use client";

import { useLayoutEffect, useState } from "react";
import Footer from "@/components/layout/Footer";

import type { SiteContent } from "@/lib/siteTypes";

export default function FooterWrapper({ site }: { site?: SiteContent | null }) {
  const [introPending, setIntroPending] = useState(true);

  useLayoutEffect(() => {
    const sync = () => {
      setIntroPending(document.documentElement.classList.contains("intro-pending"));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Avoid footer paint under / flashing through the portal
  if (introPending) return null;

  return <Footer bio={site?.footerBio} site={site} />;
}
