import { childPath, hubPath, type IaChildPage, type IaHubKey, type IaHubPage } from "@/lib/iaPages";
import { IA_HUB_PATHS } from "@/lib/iaPagesDefaults";
import { MEDIA } from "@/lib/mediaAssets";
import type { SiteContent } from "@/lib/siteTypes";

const STORAGE_PREFIX = "vd-preloader-bg:";

const IA_KEYS = Object.keys(IA_HUB_PATHS) as IaHubKey[];

export function pathWithoutLocale(pathname: string): string {
  const trimmed = (pathname || "/").replace(/\/+$/, "") || "/";
  const stripped = trimmed.replace(/^\/(en|th|pl)(?=\/|$)/, "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

function asHub(value: unknown): IaHubPage | null {
  return value && typeof value === "object" ? (value as IaHubPage) : null;
}

function heroSrc(hero?: { image?: string } | null): string {
  return String(hero?.image || "").trim();
}

function firstSectionSrc(sections?: Array<{ image?: string }> | null): string {
  for (const section of sections || []) {
    const src = String(section?.image || "").trim();
    if (src) return src;
  }
  return "";
}

function hubVisual(hub: IaHubPage | null): string {
  if (!hub) return "";
  return heroSrc(hub.hero) || firstSectionSrc(hub.sections);
}

function childVisual(child: IaChildPage | undefined, hub: IaHubPage | null): string {
  if (!child) return hubVisual(hub);
  return heroSrc(child.hero) || firstSectionSrc(child.sections) || hubVisual(hub);
}

/**
 * CMS / route image for the current URL. Home uses the homepage hero.
 * Other routes never fall back to the homepage house photo.
 */
export function resolvePreloaderBackground(
  pathname: string,
  site: SiteContent | null | undefined,
): string {
  const path = pathWithoutLocale(pathname);
  const pages = (site?.pages || {}) as Record<string, unknown>;

  if (path === "/") {
    return String(site?.heroImage || "").trim();
  }

  for (const key of IA_KEYS) {
    const hub = asHub(pages[key]);
    for (const child of hub?.children || []) {
      if (!child?.slug) continue;
      if (path === childPath(key, child.slug)) {
        return childVisual(child, hub);
      }
    }
  }

  for (const key of IA_KEYS) {
    const base = hubPath(key);
    const hub = asHub(pages[key]);
    if (path === base) return hubVisual(hub);
    if (path.startsWith(`${base}/`)) return hubVisual(hub);
  }

  if (path === "/contact") {
    return String(site?.contactImages?.[0] || "").trim();
  }
  if (path === "/team") {
    return String(MEDIA.team || "").trim();
  }
  if (path === "/catalogue") {
    return String(MEDIA.catalogues?.[0] || "").trim();
  }
  if (path === "/quality-sale") {
    return String(MEDIA.qualitySupport?.[0] || "").trim();
  }

  return "";
}

export function storedPreloaderBackground(pathname: string): string {
  if (typeof window === "undefined") return "";
  try {
    return String(sessionStorage.getItem(`${STORAGE_PREFIX}${pathWithoutLocale(pathname)}`) || "").trim();
  } catch {
    return "";
  }
}

export function storePreloaderBackground(pathname: string, src: string) {
  if (typeof window === "undefined") return;
  const value = String(src || "").trim();
  if (!value || value.startsWith("data:")) return;
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${pathWithoutLocale(pathname)}`, value);
  } catch {
    /* private mode / quota */
  }
}

export function pickPreloaderBackground(
  pathname: string,
  site: SiteContent | null | undefined,
): string {
  return storedPreloaderBackground(pathname) || resolvePreloaderBackground(pathname, site);
}

function isUsableHeroImg(img: HTMLImageElement): boolean {
  const src = img.currentSrc || img.src || "";
  if (!src || src.startsWith("data:")) return false;
  if (img.closest("nav, [data-brand-logo]")) return false;
  const w = img.naturalWidth || img.width || img.offsetWidth;
  const h = img.naturalHeight || img.height || img.offsetHeight;
  if (w > 0 && h > 0 && (w < 160 || h < 80)) return false;
  return true;
}

function srcOf(img: HTMLImageElement): string {
  return String(img.currentSrc || img.src || "").trim();
}

/** First-screen photo of the mounted page (works while the page is visibility:hidden). */
export function readMountedPageHeroSrc(): string {
  if (typeof document === "undefined") return "";
  const root = document.getElementById("app-page-content");
  if (!root) return "";

  const marked = root.querySelector<HTMLImageElement>("[data-preloader-bg] img");
  if (marked && isUsableHeroImg(marked)) return srcOf(marked);

  const dark = root.querySelector<HTMLImageElement>("[data-nav-backdrop='dark'] img");
  if (dark && isUsableHeroImg(dark)) return srcOf(dark);

  for (const img of root.querySelectorAll<HTMLImageElement>("img")) {
    if (isUsableHeroImg(img)) return srcOf(img);
  }
  return "";
}
