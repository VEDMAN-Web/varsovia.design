import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { fetchBlogs, fetchProducts, fetchProjects } from "@/lib/api";
import { getShowcaseProjects } from "@/lib/showcaseData";
import { locales } from "@/lib/i18n/routing";

const base = SITE_URL.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/catalogue",
    "/blog",
    "/team",
    "/showcase",
    "/interior",
    "/quality-sale",
  ];

  const staticRoutes = staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${path}`]),
        ),
      },
    })),
  );

  const [products, projects, blogs] = await Promise.all([
    fetchProducts().catch(() => []),
    fetchProjects().catch(() => []),
    fetchBlogs().catch(() => []),
  ]);

  const productRoutes = products
    .filter((p: { slug?: string }) => p.slug)
    .flatMap((p: { slug?: string }) =>
      locales.map((locale) => ({
        url: `${base}/${locale}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}/product/${p.slug}`]),
          ),
        },
      })),
    );

  const interiorRoutes = projects.flatMap((p) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/interior/${p._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}/interior/${p._id}`]),
        ),
      },
    })),
  );

  const blogRoutes = (Array.isArray(blogs) ? blogs : []).flatMap((b: { _id?: string }) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/blog/${b._id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}/blog/${b._id}`]),
        ),
      },
    })),
  );

  const showcaseRoutes = getShowcaseProjects("All").flatMap((p) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/showcase/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}/showcase/${p.id}`]),
        ),
      },
    })),
  );

  return [...staticRoutes, ...productRoutes, ...interiorRoutes, ...blogRoutes, ...showcaseRoutes];
}
