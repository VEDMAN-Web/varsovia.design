import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/publicEnv";
import { fetchBlogs, fetchProjects, fetchShowcases } from "@/lib/api";
import { interiorDetailPath } from "@/lib/interiorRoutes";
import type { ApiProject } from "@/lib/siteTypes";
import { getShowcaseProjects } from "@/lib/showcaseData";
import { locales } from "@/lib/i18n/routing";

function localeEntries(
  base: string,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"],
) {
  return locales.map((locale) => ({
    url: `${base}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getPublicSiteUrl().replace(/\/$/, "");

  const staticPaths: {
    path: string;
    priority: number;
    freq: MetadataRoute.Sitemap[0]["changeFrequency"];
  }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "weekly" },
    { path: "/contact", priority: 0.8, freq: "weekly" },
    { path: "/faq", priority: 0.8, freq: "weekly" },
    { path: "/catalogue", priority: 0.8, freq: "weekly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/team", priority: 0.8, freq: "weekly" },
    { path: "/showcase", priority: 0.8, freq: "weekly" },
    { path: "/interior", priority: 0.8, freq: "weekly" },
    { path: "/quality-sale", priority: 0.8, freq: "weekly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
    { path: "/terms", priority: 0.3, freq: "yearly" },
  ];

  const staticRoutes = staticPaths.flatMap(({ path, priority, freq }) =>
    localeEntries(base, path, priority, freq),
  );

  const [projects, blogs, showcases] = await Promise.all([
    fetchProjects().catch(() => []),
    fetchBlogs().catch(() => []),
    fetchShowcases().catch(() => null),
  ]);

  const interiorRoutes = projects.flatMap((p) => {
    const row = p as ApiProject;
    if (!row._id) return [];
    const title = typeof row.title === "string" ? row.title : undefined;
    return localeEntries(
      base,
      interiorDetailPath({ slug: row.slug, _id: row._id, title }),
      0.7,
      "weekly",
    );
  });

  const blogRoutes = (Array.isArray(blogs) ? blogs : []).flatMap((b: { _id?: string }) =>
    b._id ? localeEntries(base, `/blog/${b._id}`, 0.6, "monthly") : [],
  );

  const showcaseIds = new Set<string>();
  if (Array.isArray(showcases) && showcases.length > 0) {
    for (const row of showcases) {
      if (row._id) showcaseIds.add(String(row._id));
    }
  } else {
    for (const p of getShowcaseProjects("All")) {
      showcaseIds.add(String(p.id));
    }
  }

  const showcaseRoutes = [...showcaseIds].flatMap((id) =>
    localeEntries(base, `/showcase/${id}`, 0.6, "monthly"),
  );

  return [...staticRoutes, ...interiorRoutes, ...blogRoutes, ...showcaseRoutes];
}
