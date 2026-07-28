import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { fetchBlogs, fetchProducts, fetchProjects } from "@/lib/api";
import { getShowcaseProjects } from "@/lib/showcaseData";

const base = SITE_URL.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
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
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const [products, projects, blogs] = await Promise.all([
    fetchProducts().catch(() => []),
    fetchProjects().catch(() => []),
    fetchBlogs().catch(() => []),
  ]);

  const productRoutes = products
    .filter((p: { slug?: string }) => p.slug)
    .map((p: { slug?: string }) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const interiorRoutes = projects.map((p) => ({
    url: `${base}/interior/${p._id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogRoutes = (Array.isArray(blogs) ? blogs : []).map((b: { _id?: string }) => ({
    url: `${base}/blog/${b._id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const showcaseRoutes = getShowcaseProjects("All").map((p) => ({
    url: `${base}/showcase/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...interiorRoutes, ...blogRoutes, ...showcaseRoutes];
}
