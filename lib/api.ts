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
import { getPublicApiUrl } from "./publicEnv";

export type { ApiProject, SiteContent, HomeData };

export const API_URL = getPublicApiUrl();

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
      icon: resolveMediaUrl(
        pickString(block.icon, fallback.icon ?? "") as string,
        fallback.icon ?? "",
      ),
    };
  }
  return fallback;
}

function pickLocalizedString(value: unknown, locale: Locale | undefined, fallback: string | undefined): string {
  const loc = getLocaleOrDefault(locale);
  return pickSiteCopy(value, loc, fallback && fallback.trim() ? fallback : "");
}

type ProcessStep = { step: string; title: string; text: string; icon?: string };

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
      icon: resolveMediaUrl(
        pickString(item.icon, fallback?.icon ?? "") as string,
        fallback?.icon ?? "",
      ),
    };
  });
}

async function mergeSiteFallback(data: Record<string, unknown>, locale?: Locale): Promise<SiteContent> {
  const { getLocalizedSiteFallback } = await import("./i18n/localizedFallback");
  const fb = getLocalizedSiteFallback(locale);
  const brandLine1Default = "VARSOVIA";
  const brandLine2Default = "DESIGN";
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
    aboutStoryImages: resolveMediaUrls(
      (data.aboutStoryImages as string[])?.length ? (data.aboutStoryImages as string[]) : undefined,
      [...MEDIA.about, MEDIA.featured[0]],
    ),
    brandLogoMark: resolveMediaUrl(pickString(data.brandLogoMark, "") as string, ""),
    brandLogoMarkOnDark: resolveMediaUrl(pickString(data.brandLogoMarkOnDark, "") as string, ""),
    brandLogoLockup: resolveMediaUrl(pickString(data.brandLogoLockup, "") as string, ""),
    brandLogoLockupOnDark: resolveMediaUrl(pickString(data.brandLogoLockupOnDark, "") as string, ""),
    brandWordmarkLine1: pickLocalizedString(data.brandWordmarkLine1, locale, brandLine1Default),
    brandWordmarkLine2: pickLocalizedString(data.brandWordmarkLine2, locale, brandLine2Default),
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
    instagramUrl: pickString(data.instagramUrl, fb.instagramUrl) as string,
    xUrl: pickString(data.xUrl, fb.xUrl) as string,
    footerOffices:
      Array.isArray(data.footerOffices) && data.footerOffices.length > 0
        ? (data.footerOffices as SiteContent["footerOffices"])
        : fb.footerOffices,
    sectionCopy: (() => {
      const src =
        (data.sectionCopy as Record<string, { title?: unknown; subtitle?: unknown }> | undefined) ||
        {};
      const fbCopy = (fb.sectionCopy || {}) as Record<
        string,
        { title?: string; subtitle?: string }
      >;
      const loc = getLocaleOrDefault(locale);
      const keys = new Set([...Object.keys(src), ...Object.keys(fbCopy)]);
      const out: NonNullable<SiteContent["sectionCopy"]> = {};
      for (const key of keys) {
        out[key] = {
          title: pickSiteCopy(src[key]?.title, loc, fbCopy[key]?.title ?? ""),
          subtitle: pickSiteCopy(src[key]?.subtitle, loc, fbCopy[key]?.subtitle ?? ""),
        };
      }
      return out;
    })(),
    searchPages:
      Array.isArray(data.searchPages) && data.searchPages.length > 0
        ? (data.searchPages as SiteContent["searchPages"])
        : fb.searchPages,
    navMenus: (data.navMenus as SiteContent["navMenus"]) || fb.navMenus,
    mainNavigation: (data.mainNavigation as SiteContent["mainNavigation"]) || fb.mainNavigation,
    footerNavigation: (data.footerNavigation as SiteContent["footerNavigation"]) || fb.footerNavigation,
    qualitySale: (() => {
      const src = (data.qualitySale as Record<string, unknown> | undefined) || {};
      const fbQs = (fb.qualitySale || {}) as Record<string, unknown>;
      const loc = getLocaleOrDefault(locale);
      const out: Record<string, unknown> = { ...fbQs, ...src };
      const textKeys = [
        "heroTitle",
        "heroSubtitle",
        "heroBody",
        "feature1Title",
        "feature1ImageAlt",
        "feature2Title",
        "feature2ImageAlt",
        "feature3Title",
        "feature3ImageAlt",
        "feature4Title",
        "feature4ImageAlt",
        "supportTitle",
        "supportSubtitle",
        "faqTitle",
        "faqSubtitle",
        "step1Title",
        "step1Desc",
        "step2Title",
        "step2Desc",
        "step3Title",
        "step3Desc",
        "step4Title",
        "step4Desc",
        "faq1Q",
        "faq1A",
        "faq2Q",
        "faq2A",
        "faq3Q",
        "faq3A",
        "faq4Q",
        "faq4A",
      ];
      for (const key of textKeys) {
        out[key] = pickSiteCopy(src[key], loc, String(fbQs[key] ?? ""));
      }
      if (Array.isArray(src.faqItems) && src.faqItems.length > 0) {
        out.faqItems = (src.faqItems as Array<Record<string, unknown>>).map((row) => ({
          ...row,
          question: pickSiteCopy(row.question, loc, ""),
          answer: pickSiteCopy(row.answer, loc, ""),
        }));
      }
      return out as SiteContent["qualitySale"];
    })(),
    showcaseMeta: (() => {
      const rows = Array.isArray(data.showcaseMeta)
        ? (data.showcaseMeta as Array<Record<string, unknown>>)
        : [];
      const fbRows = Array.isArray(fb.showcaseMeta) ? fb.showcaseMeta : [];
      const loc = getLocaleOrDefault(locale);
      if (rows.length === 0 && fbRows.length === 0) return fb.showcaseMeta;
      const byKey = new Map<string, { tabKey: string; title?: string; subtitle?: string; order?: number }>();
      for (const row of fbRows) {
        byKey.set(row.tabKey, {
          tabKey: row.tabKey,
          title: row.title,
          subtitle: row.subtitle,
          order: row.order,
        });
      }
      for (const row of rows) {
        const tabKey = String(row.tabKey ?? "").trim();
        if (!tabKey) continue;
        const prev = byKey.get(tabKey);
        byKey.set(tabKey, {
          tabKey,
          title: pickSiteCopy(row.title, loc, prev?.title ?? ""),
          subtitle: pickSiteCopy(row.subtitle, loc, prev?.subtitle ?? ""),
          order: typeof row.order === "number" ? row.order : prev?.order,
        });
      }
      return Array.from(byKey.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    })(),
    designTools:
      Array.isArray(data.designTools) && data.designTools.length > 0
        ? (data.designTools as NonNullable<SiteContent["designTools"]>).map((tool, i) => {
            const fbTool = fb.designTools?.[i] ?? fb.designTools?.[0];
            return {
              name: pickSiteCopy(tool.name, getLocaleOrDefault(locale), fbTool?.name ?? ""),
              image: resolveMediaUrl(
                pickString(tool.image, fbTool?.image ?? "") as string,
                fbTool?.image ?? "",
              ),
              order: tool.order ?? i,
            };
          })
        : fb.designTools,
    teamPage: (() => {
      const tp = (data.teamPage as Record<string, unknown> | undefined) || {};
      const fbTp = (fb.teamPage || {}) as NonNullable<SiteContent["teamPage"]>;
      const loc = getLocaleOrDefault(locale);
      const pick = (key: keyof NonNullable<SiteContent["teamPage"]>, fallback: string) =>
        pickSiteCopy(tp[key], loc, fallback);
      return {
        heroTitle: pick("heroTitle", fbTp.heroTitle ?? ""),
        heroSubtitle: pick("heroSubtitle", fbTp.heroSubtitle ?? ""),
        intro: pick("intro", fbTp.intro ?? ""),
        designTitle: pick("designTitle", fbTp.designTitle ?? ""),
        designEyebrow: pick("designEyebrow", fbTp.designEyebrow ?? ""),
        designBody: pick("designBody", fbTp.designBody ?? ""),
        architectTitle: pick("architectTitle", fbTp.architectTitle ?? ""),
        architectEyebrow: pick("architectEyebrow", fbTp.architectEyebrow ?? ""),
        architectBody: pick("architectBody", fbTp.architectBody ?? ""),
        toolsTitle: pick("toolsTitle", fbTp.toolsTitle ?? ""),
        toolsBody: pick("toolsBody", fbTp.toolsBody ?? ""),
        stats:
          Array.isArray(tp.stats) && tp.stats.length > 0
            ? (tp.stats as Array<Record<string, unknown>>).map((row, i) => ({
                value: pickSiteCopy(row.value, loc, fbTp.stats?.[i]?.value ?? ""),
                label: pickSiteCopy(row.label, loc, fbTp.stats?.[i]?.label ?? ""),
              }))
            : fbTp.stats,
      };
    })(),
    localeFlags: {
      ...(fb.localeFlags || {}),
      ...((data.localeFlags as SiteContent["localeFlags"]) || {}),
    },
    interiorCatalogMode: (data.interiorCatalogMode as SiteContent["interiorCatalogMode"]) || fb.interiorCatalogMode,
    inquiryForm: (data.inquiryForm as SiteContent["inquiryForm"]) || fb.inquiryForm,
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
      cache: "no-store",
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
    return (await fetchAllListItems("/team", locale, { cache: "no-store" })) as Record<
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

export async function fetchProjectById(idOrSlug: string, locale?: Locale) {
  const { getInteriorProjectById, resolveInteriorDetailIntro } = await import("./interiorData");
  const { interiorDetailSlug } = await import("./interiorRoutes");

  try {
    const res = await fetch(withLocale(`${API_URL}/projects/${encodeURIComponent(idOrSlug)}`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const body = await res.json();
      const apiProject = unwrapApiData<Record<string, unknown>>(body);
      const cover = resolveMediaUrl(
        (apiProject.coverImage || apiProject.image) as string | undefined,
        MEDIA.interior[0],
      );
      const galleryRaw = Array.isArray(apiProject.gallery) ? apiProject.gallery : [];
      const gallery =
        galleryRaw.length > 0
          ? galleryRaw.map((url) => resolveMediaUrl(String(url), cover))
          : [cover, cover, cover];

      const title = pickLocalizedString(apiProject.title, locale, "Interior Project");
      const mongoId = String(apiProject._id ?? idOrSlug);
      const slugField = typeof apiProject.slug === "string" ? apiProject.slug : undefined;

      return {
        _id: mongoId,
        slug: interiorDetailSlug({ slug: slugField, _id: mongoId, title }),
        title,
        detailTitle: pickLocalizedString(apiProject.detailTitle, locale, title),
        description: resolveInteriorDetailIntro(
          pickLocalizedString(apiProject.detailDescription, locale, ""),
        ),
        coverImage: cover,
        gallery,
        category: apiProject.category as string | undefined,
        isNew: Boolean(apiProject.isNew),
        narrativeOne: pickLocalizedString(apiProject.narrativeOne, locale, ""),
        narrativeTwo: pickLocalizedString(apiProject.narrativeTwo, locale, ""),
      };
    }
  } catch {
    /* try list fallback */
  }

  try {
    const projects = await fetchProjects(locale);
    const apiProject = projects.find(
      (p) => p._id === idOrSlug || p.slug === idOrSlug,
    ) as ApiProject | undefined;
    if (apiProject) {
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
      const mongoId = String(apiProject._id ?? idOrSlug);
      return {
        _id: mongoId,
        slug: interiorDetailSlug({
          slug: apiProject.slug,
          _id: mongoId,
          title,
        }),
        title,
        detailTitle: pickLocalizedString(apiRec.detailTitle, locale, title),
        description: resolveInteriorDetailIntro(
          pickLocalizedString(apiRec.detailDescription, locale, ""),
        ),
        coverImage: cover,
        gallery,
        category: apiProject.category,
        isNew: apiProject.isNew,
        narrativeOne: pickLocalizedString(apiRec.narrativeOne, locale, ""),
        narrativeTwo: pickLocalizedString(apiRec.narrativeTwo, locale, ""),
      };
    }
  } catch {
    // fall through to static mock
  }

  try {
    const { getInteriorProjectFromFallback } = await import("./interiorData");
    const fromFallback = getInteriorProjectFromFallback(idOrSlug, locale);
    if (fromFallback) return fromFallback;
  } catch {
    /* continue */
  }

  return getInteriorProjectById(idOrSlug);
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

export async function fetchShowcaseById(id: string, locale?: Locale) {
  const { mapApiShowcaseToProject } = await import("./showcaseData");
  const loc = getLocaleOrDefault(locale);

  try {
    const res = await fetch(withLocale(`${API_URL}/showcases/${encodeURIComponent(id)}`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const body = await parseApiResponse(res);
      const data = unwrapApiData<Record<string, unknown>>(body);
      return mapApiShowcaseToProject(data, loc);
    }
  } catch {
    /* list fallback */
  }

  try {
    const list = await fetchShowcases(locale);
    const found = list?.find((s) => String(s._id) === id);
    if (found) {
      return mapApiShowcaseToProject(found as unknown as Record<string, unknown>, loc);
    }
  } catch {
    /* static fallback on page */
  }

  return null;
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
