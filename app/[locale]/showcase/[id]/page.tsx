import { notFound } from "next/navigation";
import ShowcaseDetailContent from "@/components/showcase/ShowcaseDetailContent";
import { getShowcaseProjectById, showcaseStaticParams, SHOWCASE_TABS, type ShowcaseProject, type ShowcaseTab } from "@/lib/showcaseData";
import { fetchShowcases } from "@/lib/api";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return showcaseStaticParams();
}

export const dynamicParams = true;
export const dynamic = "auto";

async function fetchShowcaseById(id: string): Promise<ShowcaseProject | null> {
  try {
    const data = await fetchShowcases();
    if (!data) return null;
    const found = data.find((s) => s._id === id);
    if (!found) return null;
    return {
      id: found._id,
      title: found.title,
      category: (SHOWCASE_TABS.includes(found.category as ShowcaseTab)
        ? found.category
        : "Home case") as ShowcaseTab,
      image: resolveMediaUrl(found.image, MEDIA.interior[0]),
      location: found.location || "",
      typeLabel: found.typeLabel || "Type",
      typeValue: found.typeValue || "",
      supplyArea: found.supplyArea || "",
      gallery: found.gallery?.length
        ? found.gallery.map((url: string) => resolveMediaUrl(url, MEDIA.interior[0]))
        : [resolveMediaUrl(found.image, MEDIA.interior[0])],
    };
  } catch {
    return null;
  }
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Try static lookup first (fast, no network)
  const staticProject = getShowcaseProjectById(id);
  if (staticProject) {
    return <ShowcaseDetailContent project={staticProject} />;
  }

  // Try API lookup (for admin-created showcases)
  const apiProject = await fetchShowcaseById(id);
  if (apiProject) {
    return <ShowcaseDetailContent project={apiProject} />;
  }

  notFound();
}
