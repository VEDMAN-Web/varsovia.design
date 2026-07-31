import type { Locale } from "./routing";

/** CMS field: plain string or { en?, th?, pl? } */
export function pickLocalized(value: unknown, locale: Locale, fallbackLocale: Locale = "en"): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const map = value as Record<string, unknown>;
    const primary = map[locale];
    if (typeof primary === "string" && primary.trim()) return primary.trim();
    const fallback = map[fallbackLocale];
    if (typeof fallback === "string" && fallback.trim()) return fallback.trim();
    const any = Object.values(map).find((v) => typeof v === "string" && String(v).trim());
    if (typeof any === "string") return any.trim();
  }
  return "";
}

export function hasLocalizedMap(value: unknown, locale: Locale): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = (value as Record<string, unknown>)[locale];
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * Prefer locale message fallbacks for th/pl when CMS sends a plain (English) string
 * without { en, th, pl } maps.
 */
export function pickSiteCopy(value: unknown, locale: Locale, localizedFallback: string): string {
  if (hasLocalizedMap(value, locale)) {
    return pickLocalized(value, locale);
  }
  if (locale !== "en" && typeof value === "string" && value.trim()) {
    return localizedFallback;
  }
  const picked = pickLocalized(value, locale);
  return picked || localizedFallback;
}
