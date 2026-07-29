import { defineRouting } from "next-intl/routing";

export const locales = ["en", "th", "pl"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  th: "Thai",
  pl: "Polish",
};

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "always",
});
