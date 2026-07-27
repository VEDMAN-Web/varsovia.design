import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/product/ProductDetail";
import { getProductBySlug, getRelatedProducts, HOME_PRODUCTS } from "@/lib/productData";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return HOME_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.title} | Varsovia Design` : "Product | Varsovia Design",
    description: product?.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ProductDetail product={product} related={getRelatedProducts(slug)} />
      </main>
      <Footer />
    </>
  );
}
