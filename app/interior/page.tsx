import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
        <InteriorPage key={initialCategory} initialCategory={initialCategory} />
      </main>
      <Footer
        bio="Transforming homes with thoughtfully designed interiors that feel timeless, warm, and uniquely yours."
        phone="+91 98765 43210"
        email="hello@Varsoviadesign.in"
        address="SG Highway, Ahmedabad, Gujarat 380015"
      />
    </>
  );
}
