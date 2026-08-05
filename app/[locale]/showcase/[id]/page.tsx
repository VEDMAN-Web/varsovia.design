import { notFound } from "next/navigation";
import ShowcaseDetailContent from "@/components/showcase/ShowcaseDetailContent";
import { fetchShowcaseById } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { getShowcaseProjectById, showcaseStaticParams } from "@/lib/showcaseData";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return showcaseStaticParams();
}

export const dynamicParams = true;
export const dynamic = "auto";

export default async function ShowcaseDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const staticProject = getShowcaseProjectById(id);
  if (staticProject) {
    return <ShowcaseDetailContent project={staticProject} />;
  }

  const apiProject = await fetchShowcaseById(id, locale as Locale);
  if (apiProject) {
    return <ShowcaseDetailContent project={apiProject} />;
  }

  notFound();
}
