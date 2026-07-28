import Navbar from "@/components/layout/Navbar";
import InteriorPage from "@/components/interior/InteriorPage";
import type { InteriorCategory } from "@/lib/interiorData";
import { INTERIOR_CATEGORIES } from "@/lib/interiorData";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

function resolveCategory(value?: string): InteriorCategory {
  if (!value) return "Kitchen";
  const match = INTERIOR_CATEGORIES.find(
    (c) => c.toLowerCase() === decodeURIComponent(value).toLowerCase()
  );
  return match || "Kitchen";
}

export default async function InteriorRoute({ searchParams }: Props) {
  const params = await searchParams;
  const initialCategory = resolveCategory(params.category);

  return (
    <>
      <Navbar />
      <main>
        <InteriorPage initialCategory={initialCategory} />
      </main>
    </>
  );
}
