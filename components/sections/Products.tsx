"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

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
  const [hovered, setHovered] = useState<number | null>(null);

  const displayProducts = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <section id="products" className="bg-[#fdf2f0] py-20 md:py-28">
      <SectionShell>
        <SectionHeading
          title="Our Products"
          subtitle="Interiors made for the way you actually live"
          className={SECTION_HEADING_WIDE}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {displayProducts.map((product, i) => {
            const isOpen = hovered === i;
            const slug = product.slug || product._id;

            return (
              <motion.article
                key={product._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-[22px]"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
              >
                <Link href={`/product/${slug}`} className="absolute inset-0 z-20">
                  <span className="sr-only">View {product.title}</span>
                </Link>

                <img
                  src={resolveMediaUrl(product.image, MEDIA.products[i % MEDIA.products.length])}
                  alt={product.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
                    isOpen ? "scale-110" : "scale-100"
                  }`}
                />

                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-400 ${
                    isOpen ? "opacity-100" : "opacity-80"
                  }`}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 md:p-6">
                  <h3 className="text-[1.35rem] font-semibold leading-tight text-white md:text-[1.5rem]">
                    {product.title}
                  </h3>

                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[0.88rem] leading-6 text-white/90">{product.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-[#e85d8a]">
                        Explore Interiors
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/interior"
            className="inline-flex rounded-md bg-[#5c3d42] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#4a2f34]"
          >
            Explore More
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
