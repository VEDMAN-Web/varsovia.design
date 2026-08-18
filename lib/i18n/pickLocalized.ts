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

/** Map has this locale, or the public API already resolved a non-empty string. */
export function hasCmsCopy(value: unknown, locale: Locale): boolean {
  if (hasLocalizedMap(value, locale)) return true;
  return typeof value === "string" && value.trim().length > 0;
}

function hasThaiScript(value: string): boolean {
  return /[\u0E00-\u0E7F]/.test(value);
}

function hasPolishChars(value: string): boolean {
  return /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(value);
}

/** Public API often resolves empty th/pl to English; prefer the locale dictionary in that case. */
function prefersLocalizedFallback(resolved: string, fallback: string, locale: Locale): boolean {
  if (!fallback || fallback === resolved) return false;
  if (locale === "th") {
    if (hasThaiScript(resolved)) return false;
    return hasThaiScript(fallback);
  }
  if (locale === "pl") {
    if (hasPolishChars(resolved)) return false;
    return hasPolishChars(fallback) || fallback !== resolved;
  }
  return false;
}

/**
 * Prefer locale message fallbacks for th/pl when CMS sends a plain (English) string
 * without { en, th, pl } maps — or a fake map where th/pl were copied from en.
 */
export function pickSiteCopy(value: unknown, locale: Locale, localizedFallback: string): string {
  const fallback = (localizedFallback || "").trim();

  if (hasLocalizedMap(value, locale)) {
    const picked = pickLocalized(value, locale);
    if (locale !== "en") {
      const enVal = pickLocalized(value, "en");
      if (picked && enVal && picked === enVal) return fallback || picked;
    }
    return picked;
  }

  if (typeof value === "string" && value.trim()) {
    const resolved = value.trim();
    if (locale !== "en" && prefersLocalizedFallback(resolved, fallback, locale)) {
      return fallback;
    }
    return resolved;
  }

  const picked = pickLocalized(value, locale);
  return picked || fallback;
}
