"use client";



import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";

import SectionHeading from "@/components/ui/SectionHeading";

import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";

import ShowcaseProductCard from "@/components/ui/ShowcaseProductCard";
import {
  SHOWCASE_LISTING_GRID,
  SHOWCASE_LISTING_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";

import { MEDIA } from "@/lib/mediaAssets";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";



type Product = {

  _id: string;

  title: string;

  slug?: string;

  description?: string;

  image?: string;

  category?: string;

};



type ProductsProps = {

  products?: Product[];

};



const FALLBACK_PRODUCTS: Product[] = [

  {

    _id: "1",

    slug: "kitchen-cabinet",

    title: "Kitchen Cabinet",

    description:

      "Our kitchen cabinets are thoughtfully crafted to combine timeless design, premium materials, and practical functionality.",

    image: MEDIA.products[0],

    category: "Kitchen",

  },

  {

    _id: "2",

    slug: "bedroom-interior",

    title: "Bedroom Interior",

    description:

      "Soft lighting, tailored storage, and calm materials come together in bedrooms designed for rest.",

    image: MEDIA.products[1],

    category: "Bedroom",

  },

  {

    _id: "3",

    slug: "bedroom-suite",

    title: "Bedroom Suite",

    description:

      "From wardrobes to bedside finishes, our bedroom interiors balance quiet luxury with everyday ease.",

    image: MEDIA.products[2],

    category: "Bedroom",

  },

];



export default function Products({ products }: ProductsProps) {

  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.products;

  const displayProducts = (products && products.length > 0 ? products : FALLBACK_PRODUCTS).slice(
    0,
    3,
  );



  return (

    <section id="products" className={`bg-[#fdf2f0] ${SITE_SECTION_PADDING_Y}`}>

      <SectionShell>

        <SectionHeading

          title={section?.title || t("productsTitle")}

          subtitle={section?.subtitle || t("productsSubtitle")}

          className={SECTION_HEADING_WIDE}

        />



        <div className={`mt-10 ${SHOWCASE_LISTING_GRID_WRAP} md:mt-12`}>
          <div className={SHOWCASE_LISTING_GRID}>
            {displayProducts.map((product, i) => {
              const slug = product.slug || product._id;

              return (
                <ShowcaseProductCard
                  key={product._id}
                  index={i}
                  variant="home"
                  title={product.title}
                  description={product.description}
                  image={product.image}
                  imageFallback={MEDIA.products[i % MEDIA.products.length]}
                  href={`/product/${slug}`}
                  category={product.category}
                  motionVariant="inView"
                />
              );
            })}
          </div>
        </div>



        <div className="mt-8 text-center md:mt-10">

          <Link

            href="/products"

            className="inline-flex rounded-md bg-[#5c3d42] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#4a2f34]"

          >

            {t("exploreMore")}

          </Link>

        </div>

      </SectionShell>

    </section>

  );

}

