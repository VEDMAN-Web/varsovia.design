const DEV_API_URL = "http://localhost:5001/api";
const DEV_SITE_URL = "http://localhost:3000";

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function requireEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  if (isProduction()) {
    throw new Error(
      `[Varsovia] Missing required environment variable: ${name}. Set it in your hosting provider before deploying.`,
    );
  }
  return "";
}

/** Public API base including `/api` suffix — used by browser and server fetches. */
export function getPublicApiUrl(): string {
  const fromEnv = requireEnv("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
  if (fromEnv) return trimTrailingSlash(fromEnv);
  return DEV_API_URL;
}

/** Contact proxy may target a dedicated backend URL. */
export function getContactApiBaseUrl(): string {
  const dedicated =
    process.env.CONTACT_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (dedicated) return trimTrailingSlash(dedicated);
  if (isProduction()) {
    throw new Error(
      "[Varsovia] Missing CONTACT_API_URL or NEXT_PUBLIC_API_URL for contact form proxy in production.",
    );
  }
  return trimTrailingSlash(DEV_API_URL);
}

function vercelSiteUrlFallback(): string {
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prod) {
    return trimTrailingSlash(prod.startsWith("http") ? prod : `https://${prod}`);
  }
  const preview = process.env.VERCEL_URL?.trim();
  if (preview) {
    return trimTrailingSlash(preview.startsWith("http") ? preview : `https://${preview}`);
  }
  return "";
}

/** Canonical site origin for SEO, sitemap, robots. Call at use-time (not module top-level). */
export function getPublicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);

  const vercel = vercelSiteUrlFallback();
  if (vercel) return vercel;

  if (isProduction()) {
    throw new Error(
      "[Varsovia] Missing required environment variable: NEXT_PUBLIC_SITE_URL. Set it in your hosting provider before deploying (or deploy on Vercel so VERCEL_URL is available).",
    );
  }
  return DEV_SITE_URL;
}

/** Hostnames allowed for next/image when CMS serves absolute URLs. */
export function getImageRemotePatterns(): Array<{
  protocol: "https" | "http";
  hostname: string;
  pathname?: string;
}> {
  const patterns: Array<{
    protocol: "https" | "http";
    hostname: string;
    pathname?: string;
  }> = [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "images.pexels.com" },
    { protocol: "https", hostname: "www.pexels.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "**.onrender.com" },
    { protocol: "https", hostname: "**.amazonaws.com" },
    { protocol: "https", hostname: "**.cloudfront.net" },
  ];

  const candidates = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_MEDIA_ORIGIN,
  ];

  for (const raw of candidates) {
    if (!raw?.trim()) continue;
    try {
      const u = new URL(raw.trim());
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") continue;
      const protocol = u.protocol === "http:" ? "http" : "https";
      if (!patterns.some((p) => p.hostname === u.hostname && p.protocol === protocol)) {
        patterns.push({ protocol, hostname: u.hostname });
      }
    } catch {
      /* ignore invalid URL in env */
    }
  }

  return patterns;
}

/** True when next/image will accept this src without throwing unconfigured-host. */
export function isAllowedNextImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) return true;
  try {
    const u = new URL(src);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    const protocol = u.protocol === "http:" ? "http" : u.protocol === "https:" ? "https" : null;
    if (!protocol) return false;
    return getImageRemotePatterns().some((p) => {
      if (p.protocol !== protocol) return false;
      if (p.hostname.startsWith("**.")) {
        const suffix = p.hostname.slice(2);
        return u.hostname === suffix || u.hostname.endsWith(`.${suffix}`);
      }
      return u.hostname === p.hostname;
    });
  } catch {
    return false;
  }
}
