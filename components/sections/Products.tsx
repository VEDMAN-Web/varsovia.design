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

/** Home Our Products is a 3-card teaser. Phone = 1 col, tablet = 2, desktop = 3. */
const HOME_PRODUCT_LIMIT = 3;

function pickHomeProducts(products?: Product[]): Product[] {
  const visible = (products || []).filter(
    (p) => (p as Product & { visible?: boolean }).visible !== false,
  );
  const featured = visible.filter(
    (p) => (p as Product & { featured?: boolean }).featured === true,
  );
  const source = featured.length > 0 ? featured : visible;
  return [...source]
    .sort((a, b) => {
      const ao = Number((a as Product & { order?: number }).order ?? 0);
      const bo = Number((b as Product & { order?: number }).order ?? 0);
      if (ao !== bo) return ao - bo;
      return String(a._id).localeCompare(String(b._id));
    })
    .slice(0, HOME_PRODUCT_LIMIT);
}

function interiorListingHref(category?: string) {
  const c = category?.trim();
  if (!c) return "/interior-design";
  return `/interior-design?category=${encodeURIComponent(c)}`;
}

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
  const reduceMotion = useReducedMotion();
  const itemVariant = reduceMotion ? reducedScaleFadeItem : scaleFadeItem;
  const ctaVariant = reduceMotion ? reducedFadeUpItem : fadeUpItem;

  const displayProducts = pickHomeProducts(products);

  if (displayProducts.length === 0) return null;

  return (
    <section
      id="products"
      className={`bg-[#fdf2f0] ${SITE_SECTION_PADDING_Y} !pb-6 !pt-8 sm:!pb-8 sm:!pt-10 md:!pb-10 md:!pt-14`}
    >
      <SectionShell>
        <SectionHeadingReveal
          title={section?.title || t("productsTitle")}
          subtitle={section?.subtitle || t("productsSubtitle")}
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
              return (
                <motion.div key={product._id} variants={itemVariant} className="min-w-0">
                  <ShowcaseProductCard
                    variant="home"
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    imageFallback={MEDIA.products[i % MEDIA.products.length]}
                    href={interiorListingHref(product.category)}
                    category={product.category}
                    ctaLabel={section?.itemCtaLabel || t("exploreInteriors")}
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
              href={section?.ctaHref || "/interior-design"}
              variant="ghost"
              className="!rounded-md !border-transparent !bg-[#5c3d42] !px-8 !py-3 !text-sm !font-medium !normal-case !tracking-normal !text-white hover:!border-transparent hover:!bg-[#4a2f34] hover:!text-white"
              fullWidthMobile={false}
            >
              {section?.ctaLabel || t("exploreMore")}
            </MagneticButton>
          </motion.div>
        </motion.div>
      </SectionShell>
    </section>
  );
}

