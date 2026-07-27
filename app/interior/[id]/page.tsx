import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InteriorDetail from "@/components/interior/InteriorDetail";
import { INTERIOR_ITEMS } from "@/lib/interiorData";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return INTERIOR_ITEMS.map((item) => ({ id: item.id }));
}

export default async function InteriorDetailPage({ params }: Props) {
  const { id } = await params;
  const item = INTERIOR_ITEMS.find((it) => it.id === id);
  if (!item) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <InteriorDetail item={item} />
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
