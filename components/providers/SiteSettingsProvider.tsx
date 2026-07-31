"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/lib/siteTypes";

const SiteSettingsContext = createContext<SiteContent | null>(null);

export function SiteSettingsProvider({
  site,
  children,
}: {
  site: SiteContent | null;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={site}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
