import { notFound } from "next/navigation";
import ShowcaseDetailContent from "@/components/showcase/ShowcaseDetailContent";
import { getShowcaseProjectById, showcaseStaticParams, SHOWCASE_TABS, type ShowcaseProject, type ShowcaseTab } from "@/lib/showcaseData";
import { API_URL } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return showcaseStaticParams();
}

// Allow dynamic rendering for API-created showcase items not in static params
export const dynamic = "auto";
export const dynamicParams = true;

async function fetchShowcaseById(id: string): Promise<ShowcaseProject | null> {
  try {
    const res = await fetch(`${API_URL}/showcases`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const data = await res.json();
    const found = data.find((s: { _id: string }) => s._id === id);
    if (!found) return null;
    return {
      id: found._id,
      title: found.title,
      category: (SHOWCASE_TABS.includes(found.category as ShowcaseTab)
        ? found.category
        : "Home case") as ShowcaseTab,
      image: found.image || "/Interior-kitchen/kitchen1.png",
      location: found.location || "",
      typeLabel: found.typeLabel || "Type",
      typeValue: found.typeValue || "",
      supplyArea: found.supplyArea || "",
      gallery: found.gallery?.length ? found.gallery : [found.image || "/Interior-kitchen/kitchen1.png"],
    };
  } catch {
    return null;
  }
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { id } = await params;

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
