import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShowcaseDetailContent from "@/components/showcase/ShowcaseDetailContent";
import { fetchShowcaseById, fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { getShowcaseProjectById } from "@/lib/showcaseData";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const site = await fetchSite(locale as Locale).catch(() => null);
  const apiProject = await fetchShowcaseById(id, locale as Locale).catch(() => null);
  const project = apiProject || getShowcaseProjectById(id);
  const title = project?.title ? String(project.title) : "Project";
  return pageMetadata({
    title,
    description: project?.location || undefined,
    path: `/${locale}/projects/${id}`,
    locale,
    indexable: site?.projectsPage?.indexable === true,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const apiProject = await fetchShowcaseById(id, locale as Locale);
  if (apiProject) {
    return <ShowcaseDetailContent project={apiProject} />;
  }

  const staticProject = getShowcaseProjectById(id);
  if (staticProject) {
    return <ShowcaseDetailContent project={staticProject} />;
  }

  notFound();
}
