import { resolveMediaUrl, resolveMediaUrls, MEDIA } from "./mediaAssets";
import type { Locale } from "./i18n/routing";
import type { ApiProject, HomeData, SiteBlock, SiteContent } from "./siteTypes";

export type { ApiProject, SiteContent, HomeData };

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

function pickBlock(value: unknown, fallback: SiteBlock): SiteBlock {
  if (value && typeof value === "object") {
    const block = value as Record<string, unknown>;
    return {
      title: String(pickString(block.title, fallback.title)),
      text: String(pickString(block.text, fallback.text)),
    };
  }
  return fallback;
}

async function mergeSiteFallback(data: Record<string, unknown>): Promise<SiteContent> {
  const { fallbackHomeData } = await import("./fallbackData");
  const fb = fallbackHomeData.site;
  return {
    ...fb,
    ...(data as SiteContent),
    heroEyebrow: String(pickString(data.heroEyebrow, fb.heroEyebrow)),
    heroHeadline: String(pickString(data.heroHeadline, fb.heroHeadline)),
    heroSubtitle: String(pickString(data.heroSubtitle, fb.heroSubtitle)),
    heroImage: resolveMediaUrl(pickString(data.heroImage, fb.heroImage) as string, MEDIA.hero),
    heroPrimaryCtaLabel: String(pickString(data.heroPrimaryCtaLabel, fb.heroPrimaryCtaLabel)),
    heroPrimaryCtaHref: String(pickString(data.heroPrimaryCtaHref, fb.heroPrimaryCtaHref)),
    heroSecondaryCtaLabel: String(pickString(data.heroSecondaryCtaLabel, fb.heroSecondaryCtaLabel)),
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
    processSteps: (data.processSteps as SiteContent["processSteps"])?.length
      ? (data.processSteps as SiteContent["processSteps"])
      : fb.processSteps,
    vision: pickBlock(data.vision, fb.vision as SiteBlock),
    mission: pickBlock(data.mission, fb.mission as SiteBlock),
    values: pickBlock(data.values, fb.values as SiteBlock),
  };
}

function normalizeTestimonials(items: unknown[]) {
  return items.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      _id: String(row._id ?? index),
      name: String(row.name ?? "Client"),
      role: String(row.role ?? ""),
      quote: String(row.quote ?? ""),
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
    const data = await res.json();
    if (!data) throw new Error("Empty");
    return await mergeSiteFallback(data);
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData.site;
  }
}

export async function fetchProducts(locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/products`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Empty");
    return data.map((product: Record<string, unknown>, index: number) => ({
      ...product,
      image: resolveMediaUrl(product.image as string | undefined, MEDIA.products[index % MEDIA.products.length]),
    }));
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData.products;
  }
}

export async function fetchProductBySlug(slug: string, locale?: Locale) {
  const { getProductBySlug } = await import("./productData");
  try {
    const products = await fetchProducts(locale);
    const apiProduct = products.find(
      (p: { slug?: string; _id?: string }) => p.slug === slug || p._id === slug,
    );
    const local = getProductBySlug(slug);
    if (!apiProduct && !local) return null;
    const base = local || {
      slug,
      title: apiProduct.title,
      category: apiProduct.category || "Kitchen",
      shortDescription: apiProduct.description || "",
      fullDescription: apiProduct.description || "",
      image: apiProduct.image || "/home/product/product-1.png",
      gallery: [apiProduct.image || "/home/product/product-1.png"],
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

export async function fetchRelatedProducts(slug: string) {
  const { getRelatedProducts } = await import("./productData");
  try {
    const products = await fetchProducts();
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
    const res = await fetch(withLocale(`${API_URL}/projects`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Empty");
    return (await mergeFeaturedProjects(data)) as ApiProject[];
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
    const data = await res.json();
    if (data.site) {
      data.site = await mergeSiteFallback(data.site as Record<string, unknown>);
    }
    if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
      data.testimonials = normalizeTestimonials(data.testimonials);
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
          coverImage: resolveMediaUrl(
            catalogue.coverImage as string | undefined,
            MEDIA.catalogues[index % MEDIA.catalogues.length],
          ),
        }),
      );
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

  let data: { message?: string } = {};
  try {
    data = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error("Something went wrong while sending your message. Please try again.");
    }
  }

  if (!res.ok) throw new Error(data.message || "Submission failed");
  return data;
}

export async function adminFetch(path: string, options: RequestInit = {}, adminKey: string) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function fetchBlogs(locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/blogs`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    /* fall through to fallback */
  }
  const { fallbackBlogs } = await import("@/lib/companyData");
  return fallbackBlogs;
}

export async function fetchBlogById(id: string, locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/blogs/${id}`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 10 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && "title" in data) return data;
    }
  } catch {
    /* try list fallback below */
  }

  try {
    const list = await fetchBlogs(locale);
    const { resolveBlogs, getBlogById } = await import("@/lib/companyData");
    const resolved = resolveBlogs(Array.isArray(list) ? list : []);
    const fromList = getBlogById(id, null, resolved);
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
  return getBlogById(id) ?? null;
}

export async function fetchTeamMembers(locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/team`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error("Failed to fetch team");
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchFAQs(locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/faqs`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error("Failed to fetch FAQs");
    return await res.json();
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

    return {
      _id: String(apiProject._id ?? id),
      title: apiProject.title || "Interior Project",
      detailTitle: apiProject.title || "Interior Project",
      description:
        apiProject.description ||
        "A beautifully crafted interior designed for everyday living.",
      coverImage: cover,
      gallery,
      category: apiProject.category,
      isNew: apiProject.isNew,
      narrativeOne: INTERIOR_NARRATIVE_ONE,
      narrativeTwo: INTERIOR_NARRATIVE_TWO,
    };
  } catch {
    return getInteriorProjectById(id);
  }
}

export async function fetchCatalogues(locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/catalogues`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error("Failed to fetch catalogues");
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Empty");
    return data;
  } catch {
    const { fallbackHomeData } = await import("./fallbackData");
    return fallbackHomeData.catalogues;
  }
}

export async function fetchShowcases(locale?: Locale) {
  try {
    const res = await fetch(withLocale(`${API_URL}/showcases`, locale), {
      headers: localeHeaders(locale),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch showcases");
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Empty");
    return data as {
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
