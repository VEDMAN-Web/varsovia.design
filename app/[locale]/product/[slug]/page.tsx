import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ProductDetail from "@/components/product/ProductDetail";
import { fetchProductBySlug, fetchProducts, fetchRelatedProducts } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p: { slug?: string; _id?: string }) => ({
    slug: p.slug || p._id || "",
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await fetchProductBySlug(slug, locale as Locale);
  return {
    title: product ? `${product.title} | Varsovia Design` : "Product | Varsovia Design",
    description: product?.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await fetchProductBySlug(slug, locale as Locale);
  if (!product) notFound();
  const related = await fetchRelatedProducts(slug);

  return (
    <>
      <Navbar />
      <main>
        <ProductDetail product={product} related={related} />
      </main>
    </>
  );
}
