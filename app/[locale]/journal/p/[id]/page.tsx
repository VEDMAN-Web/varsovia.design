import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailView from "@/components/company/BlogDetailView";
import { fetchBlogById, fetchBlogs, fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import {
  enrichBlogForDetailPage,
  getBlogById,
  getRelatedBlogs,
  resolveBlogs,
} from "@/lib/companyData";
import { getIaHub } from "@/lib/iaPages";
import { getPublicSiteUrl } from "@/lib/publicEnv";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const allBlogs = resolveBlogs(await fetchBlogs(locale as Locale), locale as Locale);
  const [apiBlog, site] = await Promise.all([
    fetchBlogById(id, locale as Locale),
    fetchSite(locale as Locale).catch(() => null),
  ]);
  const blog = getBlogById(id, apiBlog, allBlogs, locale as Locale);
  if (!blog) return { title: "Not found" };
  const hub = getIaHub(site, "journal", locale);
  return pageMetadata({
    title: blog.title.slice(0, 60),
    description: (blog.excerpt || blog.title).slice(0, 160),
    path: `/${locale}/journal/p/${id}`,
    locale,
    indexable: hub.indexable === true,
  });
}

export default async function JournalPostPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const allBlogs = resolveBlogs(await fetchBlogs(locale as Locale), locale as Locale);
  const apiBlog = await fetchBlogById(id, locale as Locale);
  const raw = getBlogById(id, apiBlog, allBlogs, locale as Locale);
  if (!raw) notFound();
  const blog = enrichBlogForDetailPage(raw);
  const related = getRelatedBlogs(blog._id, allBlogs, 3);
  const site = await fetchSite(locale as Locale).catch(() => null);
  const hub = getIaHub(site, "journal", locale);
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title.slice(0, 110),
    description: blog.excerpt || undefined,
    image: blog.image || undefined,
    datePublished: blog.date || undefined,
    author: blog.author?.name
      ? { "@type": "Person", name: blog.author.name }
      : undefined,
    mainEntityOfPage: `${base}/${locale}/journal/p/${blog._id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <BlogDetailView
        blog={blog}
        related={related}
        articleContact={hub.articleContact}
        articleOffer={hub.articleOffer}
      />
    </>
  );
}
