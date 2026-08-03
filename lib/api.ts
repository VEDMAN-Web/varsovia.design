import { resolveMediaUrl, resolveMediaUrls, MEDIA } from "./mediaAssets";
import { getLocaleOrDefault } from "./i18n/messageCatalog";
import { hasLocalizedMap, pickLocalized, pickSiteCopy } from "./i18n/pickLocalized";
import type { Locale } from "./i18n/routing";
import type { ApiProject, HomeData, SiteBlock, SiteContent } from "./siteTypes";
import type { SearchApiResponse } from "./searchTypes";
import {
  getApiMeta,
  readApiErrorMessage,
  unwrapApiData,
  unwrapApiList,
} from "./apiEnvelope";

export type { ApiProject, SiteContent, HomeData };

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const LIST_PAGE_SIZE = 100;

async function parseApiResponse(res: Response) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(readApiErrorMessage(body));
  }
  return body;
}

/** Fetch every page of a list endpoint (max 100 items per page). */
async function fetchAllListItems(
  path: string,
  locale?: Locale,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<unknown[]> {
  const all: unknown[] = [];
  let page = 1;

  while (true) {
    const url = withLocale(`${API_URL}${path}?page=${page}&limit=${LIST_PAGE_SIZE}`, locale);
    const res = await fetch(url, {
      ...init,
      headers: { ...localeHeaders(locale), ...(init?.headers ?? {}) },
    });
    const body = await parseApiResponse(res);
    all.push(...unwrapApiList(body));
    const pagination = getApiMeta(body)?.pagination;
    if (!pagination?.hasNext) break;
    page += 1;
  }

  return all;
}

function withLocale(url: string, locale?: Locale) {
  if (!locale) return url;
  return url.includes("?") ? `${url}&locale=${locale}` : `${url}?locale=${locale}`;
}

function localeHeaders(locale?: Locale): HeadersInit {
  return locale ? { "Accept-Language": locale } : {};
}

function pickString(value: unknown, fallback: unknown) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function pickBlock(value: unknown, fallback: SiteBlock, locale?: Locale): SiteBlock {
  const loc = getLocaleOrDefault(locale);
  if (value && typeof value === "object") {
    const block = value as Record<string, unknown>;
    return {
      title: pickSiteCopy(block.title, loc, String(fallback.title ?? "")),
      text: pickSiteCopy(block.text, loc, String(fallback.text ?? "")),
    };
  }
  return fallback;
}

function pickLocalizedString(value: unknown, locale: Locale | undefined, fallback: string | undefined): string {
  const loc = getLocaleOrDefault(locale);
  return pickSiteCopy(value, loc, fallback && fallback.trim() ? fallback : "");
}

type ProcessStep = { step: string; title: string; text: string };

function mergeProcessSteps(
  raw: unknown,
  locale: Locale | undefined,
  fb: ProcessStep[],
): ProcessStep[] {
  if (!Array.isArray(raw) || raw.length === 0) return fb;
  const loc = getLocaleOrDefault(locale);

  if (loc !== "en") {
    const apiHasLocaleFields = raw.some((row) => {
      const item = row as Record<string, unknown>;
      return hasLocalizedMap(item.title, loc) || hasLocalizedMap(item.text, loc);
    });
    if (!apiHasLocaleFields) return fb;
  }

  return raw.map((row, i) => {
    const item = row as Record<string, unknown>;
    const fallback = fb[i] ?? fb[0];
    return {
      step: String(item.step ?? fallback?.step ?? "01"),
      title: pickSiteCopy(item.title, loc, fallback?.title ?? ""),
      text: pickSiteCopy(item.text, loc, fallback?.text ?? ""),
    };
  });
}

async function mergeSiteFallback(data: Record<string, unknown>, locale?: Locale): Promise<SiteContent> {
  const { getLocalizedSiteFallback } = await import("./i18n/localizedFallback");
  const fb = getLocalizedSiteFallback(locale);
  return {
    ...fb,
    ...(data as SiteContent),
    heroEyebrow: pickLocalizedString(data.heroEyebrow, locale, fb.heroEyebrow),
    heroHeadline: pickLocalizedString(data.heroHeadline, locale, fb.heroHeadline),
    heroSubtitle: pickLocalizedString(data.heroSubtitle, locale, fb.heroSubtitle),
    heroImage: resolveMediaUrl(pickString(data.heroImage, fb.heroImage) as string, MEDIA.hero),
    heroPrimaryCtaLabel: pickLocalizedString(data.heroPrimaryCtaLabel, locale, fb.heroPrimaryCtaLabel),
    heroPrimaryCtaHref: String(pickString(data.heroPrimaryCtaHref, fb.heroPrimaryCtaHref)),
    heroSecondaryCtaLabel: pickLocalizedString(data.heroSecondaryCtaLabel, locale, fb.heroSecondaryCtaLabel),
    heroSecondaryCtaHref: String(pickString(data.heroSecondaryCtaHref, fb.heroSecondaryCtaHref)),
    stats: (data.stats as SiteContent["stats"])?.length ? (data.stats as SiteContent["stats"]) : fb.stats,
    statsImage: resolveMediaUrl(pickString(data.statsImage, fb.statsImage) as string, MEDIA.stats),
    aboutImages: resolveMediaUrls(
      (data.aboutImages as string[])?.length ? (data.aboutImages as string[]) : undefined,
      MEDIA.about,
    ),
    contactImages: resolveMediaUrls(
      (data.contactImages as string[])?.length ? (data.contactImages as string[]) : undefined,
      MEDIA.contact,
    ),
    aboutIntro: pickSiteCopy(data.aboutIntro, getLocaleOrDefault(locale), fb.aboutIntro ?? ""),
    aboutStory: pickSiteCopy(data.aboutStory, getLocaleOrDefault(locale), fb.aboutStory ?? ""),
    aboutText: pickSiteCopy(data.aboutText, getLocaleOrDefault(locale), fb.aboutText ?? ""),
    aboutHeroSubtitle: pickSiteCopy(
      data.aboutHeroSubtitle,
      getLocaleOrDefault(locale),
      fb.aboutHeroSubtitle ?? "",
    ),
    processSteps: mergeProcessSteps(data.processSteps, locale, fb.processSteps ?? []),
    vision: pickBlock(data.vision, fb.vision as SiteBlock, locale),
    mission: pickBlock(data.mission, fb.mission as SiteBlock, locale),
    values: pickBlock(data.values, fb.values as SiteBlock, locale),
    footerBio: pickSiteCopy(data.footerBio, getLocaleOrDefault(locale), fb.footerBio ?? ""),
    phone: pickString(data.phone, fb.phone) as string,
    email: pickString(data.email, fb.email) as string,
    mobileWhatsapp: pickString(data.mobileWhatsapp, fb.mobileWhatsapp) as string,
    contactPhone: pickString(data.contactPhone, fb.contactPhone) as string,
    facebookUrl: pickString(data.facebookUrl, fb.facebookUrl) as string,
    whatsappUrl: pickString(data.whatsappUrl, fb.whatsappUrl) as string,
    footerOffices:
      Array.isArray(data.footerOffices) && data.footerOffices.length > 0
        ? (data.footerOffices as SiteContent["footerOffices"])
        : fb.footerOffices,
    sectionCopy: (data.sectionCopy as SiteContent["sectionCopy"]) || fb.sectionCopy,
    searchPages:
      Array.isArray(data.searchPages) && data.searchPages.length > 0
        ? (data.searchPages as SiteContent["searchPages"])
        : fb.searchPages,
    navMenus: (data.navMenus as SiteContent["navMenus"]) || fb.navMenus,
    qualitySale: (data.qualitySale as SiteContent["qualitySale"]) || fb.qualitySale,
    interiorCatalogMode: (data.interiorCatalogMode as SiteContent["interiorCatalogMode"]) || fb.interiorCatalogMode,
  };
}

function normalizeTestimonials(items: unknown[], locale?: Locale) {
  const loc = getLocaleOrDefault(locale);
  return items.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      _id: String(row._id ?? index),
      name: pickLocalized(row.name, loc) || String(row.name ?? "Client"),
      role: pickLocalized(row.role, loc) || String(row.role ?? ""),
      quote: pickLocalized(row.quote, loc) || String(row.quote ?? ""),
      rating: Number(row.rating ?? 5),
      image: resolveMediaUrl(row.image as string | undefined, MEDIA.stories[index % MEDIA.stories.length]),
    };
  });
}

export async function fetchSite(locale?: Locale): Promise<SiteContent> {
  try {
    const res = await fetch(withLocale(`${API_URL}/site`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch site");
    const body = await res.json();
    const data = unwrapApiData<Record<string, unknown>>(body);
    if (!data) throw new Error("Empty");
    return await mergeSiteFallback(data, locale);
  } catch {
    const { getLocalizedSiteFallback } = await import("./i18n/localizedFallback");
    return getLocalizedSiteFallback(locale);
  }
}

export type FetchedProduct = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  category?: string;
  [key: string]: unknown;
};

export async function fetchProducts(locale?: Locale): Promise<FetchedProduct[]> {
  try {
    const rows = await fetchAllListItems("/products", locale, { next: { revalidate: 30 } });
    if (!rows.length) throw new Error("Empty");
    return rows.map((row, index) => {
      const product = row as Record<string, unknown>;
      return {
        ...product,
        _id: String(product._id ?? product.id ?? index),
        title: String(product.title ?? ""),
        image: resolveMediaUrl(product.image as string | undefined, MEDIA.products[index % MEDIA.products.length]),
      };
    });
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData.products;
  }
}

export async function fetchProductBySlug(slug: string, locale?: Locale) {
  const { getProductBySlug } = await import("./productData");
  try {
    const res = await fetch(withLocale(`${API_URL}/products/${encodeURIComponent(slug)}`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const body = await res.json();
      const apiProduct = unwrapApiData<Record<string, unknown>>(body);
      const galleryRaw = Array.isArray(apiProduct.gallery) ? apiProduct.gallery : [];
      const gallery = galleryRaw.length
        ? galleryRaw.map((u) => resolveMediaUrl(String(u)))
        : [resolveMediaUrl(apiProduct.image as string | undefined, "/home/product/product-1.png")];
      const features = Array.isArray(apiProduct.features)
        ? apiProduct.features.map((f: { text?: string }) => String(f.text || "")).filter(Boolean)
        : [];
      const specs = Array.isArray(apiProduct.specs)
        ? apiProduct.specs.map((s: { label?: string; value?: string }) => ({
            label: String(s.label || ""),
            value: String(s.value || ""),
          }))
        : [];
      const local = getProductBySlug(slug);
      return {
        slug: String(apiProduct.slug || slug),
        title: String(apiProduct.title || local?.title || slug),
        category: String(apiProduct.category || local?.category || "Kitchen"),
        shortDescription: String(apiProduct.description || local?.shortDescription || ""),
        fullDescription: String(
          apiProduct.fullDescription || apiProduct.description || local?.fullDescription || "",
        ),
        image: resolveMediaUrl(
          apiProduct.image as string | undefined,
          local?.image || "/home/product/product-1.png",
        ),
        gallery,
        features: features.length ? features : local?.features || [],
        specs: specs.length ? specs : local?.specs || [],
      };
    }
  } catch {
    /* fall through */
  }
  try {
    const products = await fetchProducts(locale);
    const apiProduct = products.find(
      (p: { slug?: string; _id?: string }) => p.slug === slug || p._id === slug,
    );
    const local = getProductBySlug(slug);
    if (!apiProduct && !local) return null;
    const base = local || {
      slug,
      title: apiProduct?.title ?? slug,
      category: apiProduct?.category || "Kitchen",
      shortDescription: String(apiProduct?.description ?? ""),
      fullDescription: String(apiProduct?.description ?? ""),
      image: apiProduct?.image || "/home/product/product-1.png",
      gallery: [apiProduct?.image || "/home/product/product-1.png"],
      features: [],
      specs: [],
    };
    return {
      ...base,
      slug: apiProduct?.slug || base.slug,
      title: apiProduct?.title || base.title,
      category: apiProduct?.category || base.category,
      shortDescription: apiProduct?.description || base.shortDescription,
      image: apiProduct?.image || base.image,
    };
  } catch {
    return getProductBySlug(slug);
  }
}

export async function fetchRelatedProducts(slug: string, locale?: Locale) {
  const { getRelatedProducts } = await import("./productData");
  try {
    const products = await fetchProducts(locale);
    const related = products.filter(
      (p: { slug?: string; _id?: string }) => p.slug !== slug && p._id !== slug,
    ).slice(0, 3);
    if (related.length === 0) return getRelatedProducts(slug);
    return related.map((p: { slug?: string; _id?: string; title: string; category?: string; description?: string; image?: string }) => ({
      slug: p.slug || p._id || "",
      title: p.title,
      category: p.category || "Kitchen",
      shortDescription: p.description || "",
      fullDescription: p.description || "",
      image: p.image || "/home/product/product-1.png",
      gallery: [p.image || "/home/product/product-1.png"],
      features: [],
      specs: [],
    }));
  } catch {
    return getRelatedProducts(slug);
  }
}

const MIN_FEATURED_PROJECTS = 8;

function normalizeProjectCover(project: Record<string, unknown>) {
  const gallery = (project.gallery as string[] | undefined)?.map((url) => resolveMediaUrl(url));
  const coverImage = resolveMediaUrl(
    (typeof project.coverImage === "string" && project.coverImage.trim()) ||
      gallery?.[0] ||
      null,
    MEDIA.featured[0],
  );
  return { ...project, coverImage, gallery: gallery?.length ? gallery : [coverImage] };
}

async function mergeFeaturedProjects(apiProjects: Record<string, unknown>[]) {
  const { fallbackHomeData } = await import("./fallbackData");
  const fallbacks = fallbackHomeData.projects as Record<string, unknown>[];
  const merged: Record<string, unknown>[] = apiProjects.map(normalizeProjectCover);
  const seen = new Set(
    merged.map((project) => String(project.slug || project._id)),
  );

  for (const fallback of fallbacks) {
    if (merged.length >= MIN_FEATURED_PROJECTS) break;
    const key = String(fallback.slug || fallback._id);
    if (seen.has(key)) continue;
    merged.push(normalizeProjectCover(fallback));
    seen.add(key);
  }

  return merged.length > 0 ? merged : fallbacks.map(normalizeProjectCover);
}

export async function fetchProjects(locale?: Locale): Promise<ApiProject[]> {
  const { fallbackHomeData } = await import("./fallbackData");
  try {
    const rows = await fetchAllListItems("/projects", locale, { next: { revalidate: 30 } });
    if (!rows.length) throw new Error("Empty");
    return (await mergeFeaturedProjects(rows as Record<string, unknown>[])) as ApiProject[];
  } catch {
    return fallbackHomeData.projects.map(normalizeProjectCover) as ApiProject[];
  }
}

export async function fetchHomeData(locale?: Locale): Promise<HomeData> {
  try {
    const res = await fetch(withLocale(`${API_URL}/home`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch home data");
    const body = await res.json();
    const data = unwrapApiData<HomeData>(body);
    if (data.site) {
      data.site = await mergeSiteFallback(data.site as Record<string, unknown>, locale);
    }
    if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
      data.testimonials = normalizeTestimonials(data.testimonials, locale);
    } else {
      const { fallbackHomeData } = await import("./fallbackData");
      data.testimonials = fallbackHomeData.testimonials;
    }
    // If catalogues are empty, use local fallback
    if (!data.catalogues || data.catalogues.length === 0) {
      const { fallbackHomeData } = await import("./fallbackData");
      data.catalogues = fallbackHomeData.catalogues;
    } else {
      data.catalogues = data.catalogues.map(
        (catalogue: Record<string, unknown>, index: number) => ({
          ...catalogue,
          title: String(catalogue.title ?? ""),
          coverImage: resolveMediaUrl(
            catalogue.coverImage as string | undefined,
            MEDIA.catalogues[index % MEDIA.catalogues.length],
          ),
        }),
      ) as HomeData["catalogues"];
    }
    return data;
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData as HomeData;
  }
}

export async function submitContact(payload: Record<string, string>) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "We couldn't reach our servers right now. Please try again in a moment, or call us directly.",
    );
  }

  let body: unknown = {};
  try {
    body = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error("Something went wrong while sending your message. Please try again.");
    }
  }

  if (!res.ok) throw new Error(readApiErrorMessage(body, "Submission failed"));

  const data = unwrapApiData<{ contact?: unknown }>(body);
  const message =
    getApiMeta(body)?.message || readApiErrorMessage(body, "Thank you! We will get back to you soon.");
  return { message, contact: data.contact, ...data };
}

export async function fetchBlogs(locale?: Locale): Promise<Record<string, unknown>[]> {
  try {
    const rows = await fetchAllListItems("/blogs", locale, { next: { revalidate: 10 } });
    if (rows.length > 0) return rows as Record<string, unknown>[];
  } catch {
    /* fall through to fallback */
  }
  const { fallbackBlogs, resolveBlogs } = await import("@/lib/companyData");
  return resolveBlogs(fallbackBlogs, locale);
}

export async function fetchBlogById(id: string, locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/blogs/${id}`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 10 },
    });
    if (res.ok) {
      const body = await res.json();
      const data = unwrapApiData<Record<string, unknown>>(body);
      if (data && typeof data === "object" && "title" in data) {
        return {
          ...data,
          image: resolveMediaUrl(data.image as string | undefined, "/home/blog/blog-1.jpg"),
        };
      }
    }
  } catch {
    /* try list fallback below */
  }

  try {
    const list = await fetchBlogs(locale);
    const { resolveBlogs, getBlogById } = await import("@/lib/companyData");
    const resolved = resolveBlogs(Array.isArray(list) ? list : [], locale);
    const fromList = getBlogById(id, null, resolved, locale);
    if (fromList) {
      return {
        _id: fromList._id,
        title: fromList.title,
        excerpt: fromList.excerpt,
        content: fromList.content,
        date: fromList.date,
        readTime: fromList.readTime,
        category: fromList.category,
        image: fromList.image,
        author: fromList.author,
        views: fromList.views,
      };
    }
  } catch {
    /* ignore */
  }

  const { getBlogById } = await import("@/lib/companyData");
  return getBlogById(id, null, undefined, locale) ?? null;
}

export async function fetchTeamMembers(locale?: Locale): Promise<Record<string, unknown>[]> {
  try {
    return (await fetchAllListItems("/team", locale, { next: { revalidate: 10 } })) as Record<
      string,
      unknown
    >[];
  } catch {
    return [];
  }
}

export async function fetchFAQs(locale?: Locale): Promise<Record<string, unknown>[]> {
  try {
    return (await fetchAllListItems("/faqs", locale, { next: { revalidate: 10 } })) as Record<
      string,
      unknown
    >[];
  } catch {
    return [];
  }
}

export async function fetchProjectById(id: string, locale?: Locale) {
  const { getInteriorProjectById, INTERIOR_NARRATIVE_ONE, INTERIOR_NARRATIVE_TWO } =
    await import("./interiorData");
  const interior = getInteriorProjectById(id);
  if (interior) return interior;

  try {
    const projects = await fetchProjects(locale);
    const apiProject = projects.find(
      (p) => p._id === id || p.slug === id,
    ) as ApiProject | undefined;
    if (!apiProject) return null;

    const cover = resolveMediaUrl(
      apiProject.coverImage || apiProject.image,
      MEDIA.interior[0],
    );
    const gallery =
      apiProject.gallery && apiProject.gallery.length > 0
        ? apiProject.gallery.map((url: string) => resolveMediaUrl(url, cover))
        : [cover, cover, cover];

    const apiRec = apiProject as Record<string, unknown>;
    const title = pickLocalizedString(apiProject.title, locale, "Interior Project");
    return {
      _id: String(apiProject._id ?? id),
      title,
      detailTitle: pickLocalizedString(apiRec.detailTitle, locale, title),
      description:
        pickLocalizedString(apiRec.detailDescription, locale, "") ||
        pickLocalizedString(apiProject.description, locale, "") ||
        "A beautifully crafted interior designed for everyday living.",
      coverImage: cover,
      gallery,
      category: apiProject.category,
      isNew: apiProject.isNew,
      narrativeOne: pickLocalizedString(apiRec.narrativeOne, locale, INTERIOR_NARRATIVE_ONE),
      narrativeTwo: pickLocalizedString(apiRec.narrativeTwo, locale, INTERIOR_NARRATIVE_TWO),
    };
  } catch {
    return getInteriorProjectById(id);
  }
}

export async function fetchCatalogues(locale?: Locale): Promise<Record<string, unknown>[]> {
  try {
    const rows = await fetchAllListItems("/catalogues", locale, { next: { revalidate: 10 } });
    if (!rows.length) throw new Error("Empty");
    return rows as Record<string, unknown>[];
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData.catalogues as Record<string, unknown>[];
  }
}

export async function fetchShowcases(locale?: Locale) {
  try {
    const rows = await fetchAllListItems("/showcases", locale, { next: { revalidate: 30 } });
    if (!rows.length) throw new Error("Empty");
    return rows as {
      _id: string;
      title: string;
      category: string;
      image: string;
      location: string;
      typeLabel: string;
      typeValue: string;
      supplyArea: string;
      gallery: string[];
      order: number;
    }[];
  } catch {
    return null; // null = use hardcoded fallback
  }
}

export async function fetchSearch(
  query: string,
  locale?: Locale,
  signal?: AbortSignal,
): Promise<SearchApiResponse> {
  const q = encodeURIComponent(query.trim());
  const res = await fetch(withLocale(`${API_URL}/search?q=${q}&limit=12`, locale), {
    headers: localeHeaders(locale),
    signal,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Search failed");
  }
  const body = await res.json();
  const payload = unwrapApiData<{ query: string; results: SearchApiResponse["results"] }>(body);
  const meta = getApiMeta(body);
  return {
    query: payload.query,
    locale: meta?.locale ?? locale ?? "en",
    results: payload.results ?? [],
    tookMs: meta?.tookMs,
  } satisfies SearchApiResponse;
}
