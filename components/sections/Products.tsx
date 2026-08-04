"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import ShowcaseProductCard from "@/components/ui/ShowcaseProductCard";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  SHOWCASE_LISTING_GRID,
  SHOWCASE_LISTING_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";
import {
  reducedScaleFadeItem,
  scaleFadeItem,
  staggerContainer,
  VIEWPORT_ONCE,
  fadeUpItem,
  reducedFadeUpItem,
} from "@/lib/motionPresets";
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
  const section = site?.sectionCopy?.featured;
  const reduceMotion = useReducedMotion();
  const itemVariant = reduceMotion ? reducedScaleFadeItem : scaleFadeItem;
  const ctaVariant = reduceMotion ? reducedFadeUpItem : fadeUpItem;

  const displayProducts = (products && products.length > 0 ? products : FALLBACK_PRODUCTS).slice(0, 3);

  return (
    <section id="products" className={`bg-[#fdf2f0] ${SITE_SECTION_PADDING_Y}`}>
      <SectionShell>
        <SectionHeadingReveal
          title={section?.title || t("featuredTitle")}
          subtitle={section?.subtitle || t("featuredSubtitle")}
          className={SECTION_HEADING_WIDE}
        />

        <motion.div
          className={`mt-10 md:mt-12 ${SHOWCASE_LISTING_GRID_WRAP}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={staggerContainer(0.14, 0.08)}
        >
          <div className={SHOWCASE_LISTING_GRID}>
            {displayProducts.map((product, i) => {
              const slug = product.slug || product._id;
              return (
                <motion.div key={product._id} variants={itemVariant} className="min-w-0">
                  <ShowcaseProductCard
                    variant="home"
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    imageFallback={MEDIA.products[i % MEDIA.products.length]}
                    href={`/product/${slug}`}
                    category={product.category}
                    motionVariant="none"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center md:mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={staggerContainer(0, 0.2)}
        >
          <motion.div variants={ctaVariant}>
            <MagneticButton
              href="/products"
              variant="ghost"
              className="!rounded-md !border-transparent !bg-[#5c3d42] !px-8 !py-3 !text-sm !font-medium !normal-case !tracking-normal !text-white hover:!border-transparent hover:!bg-[#4a2f34] hover:!text-white"
              fullWidthMobile={false}
            >
              {t("exploreMore")}
            </MagneticButton>
          </motion.div>
        </motion.div>
      </SectionShell>
    </section>
  );
}
