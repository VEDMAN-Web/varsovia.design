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
    redirect(`/${locale}/interior/${legacySlug}`);
  }

  const project = await fetchProjectById(slug, locale as Locale);
  if (!project) notFound();

  const canonicalSlug = project.slug?.trim();
  if (canonicalSlug && slug !== canonicalSlug) {
    redirect(`/${locale}/interior/${canonicalSlug}`);
  }

  return project;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await resolveInteriorProject(locale, slug);
  const title = project.detailTitle || project.title;
  const description =
    project.description?.slice(0, 160) ||
    "Interior design project by Varsovia Design.";

  return pageMetadata({
    title,
    description,
    path: `/interior/${project.slug ?? slug}`,
  });
}

export default async function InteriorDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await resolveInteriorProject(locale, slug);

  return (
    <>
      <Navbar />
      <main>
        <InteriorDetail project={project} />
      </main>
    </>
  );
}
