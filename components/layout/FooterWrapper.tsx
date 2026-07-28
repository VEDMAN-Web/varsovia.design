"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

type SiteFooter = {
  footerBio?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export default function FooterWrapper({ site }: { site?: SiteFooter | null }) {
  const pathname = usePathname();
  const [introPending, setIntroPending] = useState(false);

  useLayoutEffect(() => {
    const sync = () => {
      setIntroPending(document.documentElement.classList.contains("intro-pending"));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (pathname === "/" && introPending) return null;

  return (
    <Footer
      bio={site?.footerBio}
      phone={site?.phone}
      email={site?.email}
      address={site?.address}
    />
  );
}
