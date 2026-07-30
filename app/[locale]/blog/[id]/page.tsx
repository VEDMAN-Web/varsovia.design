import { notFound } from "next/navigation";
import BlogDetailView from "@/components/company/BlogDetailView";
import { fetchBlogById, fetchBlogs } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import {
  blogStaticParams,
  enrichBlogForDetailPage,
  getBlogById,
  getRelatedBlogs,
  resolveBlogs,
} from "@/lib/companyData";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return blogStaticParams();
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const allBlogs = resolveBlogs(await fetchBlogs(locale as Locale));
  const apiBlog = await fetchBlogById(id, locale as Locale);
  const raw = getBlogById(id, apiBlog, allBlogs);
  if (!raw) notFound();
  const blog = enrichBlogForDetailPage(raw);

  const related = getRelatedBlogs(blog._id, allBlogs, 3);

  return <BlogDetailView blog={blog} related={related} />;
}
