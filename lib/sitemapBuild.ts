import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/publicEnv";
import { fetchBlogs, fetchShowcases, fetchSite } from "@/lib/api";
import { getIaPages, hubPath, childPath, type IaHubKey } from "@/lib/iaPages";
import { getShowcaseProjects } from "@/lib/showcaseData";
import { locales } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/mediaAssets";

export type SitemapBucket = "pages" | "journal" | "projects" | "images";

export function localeEntries(
  base: string,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"],
  images?: string[],
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${base}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
    },
    ...(images && images.length > 0 ? { images } : {}),
  }));
}

const CORE_STATIC: {
  path: string;
  priority: number;
  freq: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [{ path: "", priority: 1, freq: "weekly" }];

type IndexablePage = {
  path: string;
  indexable?: boolean;
  priority: number;
  freq: MetadataRoute.Sitemap[0]["changeFrequency"];
};

function indexableRoutes(site: Awaited<ReturnType<typeof fetchSite>> | null): IndexablePage[] {
  return [
    { path: "/contact", indexable: site?.contactPage?.indexable, priority: 0.8, freq: "weekly" },
    { path: "/faq", indexable: site?.faqPage?.indexable, priority: 0.8, freq: "weekly" },
    {
      path: "/catalogue",
      indexable: site?.cataloguePage?.indexable,
      priority: 0.8,
      freq: "weekly",
    },
    {
      path: "/team",
      indexable: (site?.teamPage as { indexable?: boolean } | undefined)?.indexable,
      priority: 0.8,
      freq: "weekly",
    },
    {
      path: "/quality-sale",
      indexable: (site?.qualitySale as { indexable?: boolean } | undefined)?.indexable,
      priority: 0.8,
      freq: "weekly",
    },
    {
      path: "/privacy",
      indexable: site?.legalPages?.privacy?.indexable,
      priority: 0.3,
      freq: "yearly",
    },
    {
      path: "/terms",
      indexable: site?.legalPages?.terms?.indexable,
      priority: 0.3,
      freq: "yearly",
    },
  ];
}

export async function buildSitemapBucket(
  bucket: SitemapBucket,
): Promise<MetadataRoute.Sitemap> {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const site = await fetchSite("en").catch(() => null);
  const pages = getIaPages(site);

  if (bucket === "pages") {
    const routes: MetadataRoute.Sitemap = CORE_STATIC.flatMap(({ path, priority, freq }) =>
      localeEntries(base, path, priority, freq),
    );
    for (const page of indexableRoutes(site)) {
      if (page.indexable === true) {
        routes.push(...localeEntries(base, page.path, page.priority, page.freq));
      }
    }
    if (site?.projectsPage?.indexable === true) {
      routes.push(...localeEntries(base, "/projects", 0.8, "weekly"));
    }
    for (const hubKey of Object.keys(pages) as IaHubKey[]) {
      const hub = pages[hubKey];
      if (hub?.indexable === true) {
        routes.push(...localeEntries(base, hubPath(hubKey), 0.7, "weekly"));
      }
      for (const child of hub?.children || []) {
        if (child.indexable === true && child.slug) {
          routes.push(
            ...localeEntries(base, childPath(hubKey, child.slug), 0.65, "monthly"),
          );
        }
      }
    }
    return routes;
  }

  if (bucket === "journal") {
    const blogs = await fetchBlogs().catch(() => []);
    return (Array.isArray(blogs) ? blogs : []).flatMap(
      (b: { _id?: string; image?: string }) =>
        b._id
          ? localeEntries(
              base,
              `/journal/p/${b._id}`,
              0.6,
              "monthly",
              b.image ? [resolveMediaUrl(String(b.image), String(b.image))] : undefined,
            )
          : [],
    );
  }

  if (bucket === "projects") {
    const showcases = await fetchShowcases().catch(() => null);
    const ids = new Set<string>();
    const imagesById = new Map<string, string>();
    if (Array.isArray(showcases) && showcases.length > 0) {
      for (const row of showcases) {
        if (!row._id) continue;
        const id = String(row._id);
        ids.add(id);
        if (row.image) imagesById.set(id, resolveMediaUrl(String(row.image), String(row.image)));
      }
    } else {
      for (const p of getShowcaseProjects("All")) {
        ids.add(String(p.id));
        if (p.image) imagesById.set(String(p.id), p.image);
      }
    }
    return [...ids].flatMap((id) =>
      localeEntries(
        base,
        `/projects/${id}`,
        0.7,
        "weekly",
        imagesById.get(id) ? [imagesById.get(id)!] : undefined,
      ),
    );
  }

  // images: image-bearing IA heroes + projects + journal covers
  const imageRoutes: MetadataRoute.Sitemap = [];
  for (const hubKey of Object.keys(pages) as IaHubKey[]) {
    const hub = pages[hubKey];
    if (hub?.indexable === true && hub.hero?.image) {
      imageRoutes.push(
        ...localeEntries(base, hubPath(hubKey), 0.5, "monthly", [
          resolveMediaUrl(hub.hero.image, hub.hero.image),
        ]),
      );
    }
    for (const child of hub?.children || []) {
      if (child.indexable === true && child.slug && child.hero?.image) {
        imageRoutes.push(
          ...localeEntries(base, childPath(hubKey, child.slug), 0.5, "monthly", [
            resolveMediaUrl(child.hero.image, child.hero.image),
          ]),
        );
      }
    }
  }

  const [blogs, showcases] = await Promise.all([
    fetchBlogs().catch(() => []),
    fetchShowcases().catch(() => null),
  ]);
  for (const b of Array.isArray(blogs) ? blogs : []) {
    if (b._id && b.image) {
      imageRoutes.push(
        ...localeEntries(base, `/journal/p/${b._id}`, 0.4, "monthly", [
          resolveMediaUrl(String(b.image), String(b.image)),
        ]),
      );
    }
  }
  if (Array.isArray(showcases)) {
    for (const row of showcases) {
      if (row._id && row.image) {
        imageRoutes.push(
          ...localeEntries(base, `/projects/${row._id}`, 0.4, "weekly", [
            resolveMediaUrl(String(row.image), String(row.image)),
          ]),
        );
      }
    }
  }
  return imageRoutes;
}

export function sitemapEntriesToXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((entry) => {
      const images = Array.isArray(entry.images)
        ? entry.images
            .map(
              (img) =>
                `    <image:image><image:loc>${escapeXml(String(img))}</image:loc></image:image>`,
            )
            .join("\n")
        : "";
      const langs = entry.alternates?.languages
        ? Object.entries(entry.alternates.languages)
            .map(
              ([lang, href]) =>
                `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(String(href))}" />`,
            )
            .join("\n")
        : "";
      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
${langs ? `${langs}\n` : ""}${images ? `${images}\n` : ""}    <lastmod>${(entry.lastModified instanceof Date ? entry.lastModified : new Date()).toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency || "weekly"}</changefreq>
    <priority>${entry.priority ?? 0.5}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
