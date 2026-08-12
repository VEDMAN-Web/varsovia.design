import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import InteriorDetail from "@/components/interior/InteriorDetail";
import { fetchProjectById } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { interiorDetailStaticParams } from "@/lib/interiorData";
import { legacyInteriorSlugRedirect } from "@/lib/interiorRoutes";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return interiorDetailStaticParams();
}

export const revalidate = 0;
export const dynamicParams = true;

const resolveInteriorProject = cache(async (locale: string, slug: string) => {
  const legacySlug = legacyInteriorSlugRedirect(slug);
  if (legacySlug) {
    redirect(`/${locale}/interior-design/${legacySlug}`);
  }

  const project = await fetchProjectById(slug, locale as Locale);
  return project;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await resolveInteriorProject(locale, slug);
  const title =
    typeof project?.title === "string"
      ? project.title
      : typeof (project as { detailTitle?: string } | null)?.detailTitle === "string"
        ? String((project as { detailTitle?: string }).detailTitle)
        : "Interior";
  return pageMetadata({
    title,
    description:
      typeof project?.description === "string" ? project.description : undefined,
    path: `/${locale}/interior-design/${slug}`,
    locale,
  });
}

export default async function InteriorDesignDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await resolveInteriorProject(locale, slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <InteriorDetail project={project} />
    </>
  );
}
