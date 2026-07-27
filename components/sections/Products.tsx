"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_PRODUCTS } from "@/lib/productData";

export default function Products() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="products" className="bg-[#fdf2f0] py-20 md:py-28">
      <div className="container-1240">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium tracking-[0.08em] text-[#5c3d42]">
            OUR PRODUCTS
          </h2>
          <p className="mt-3 text-[0.72rem] font-medium tracking-[0.22em] text-[#e85d8a] uppercase sm:text-[0.8rem]">
            Interiors made for the way you actually live
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {HOME_PRODUCTS.map((product, i) => {
            const isOpen = hovered === i;

            return (
              <motion.article
                key={product.slug}
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
                <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20">
                  <span className="sr-only">View {product.title}</span>
                </Link>

                <img
                  src={product.image}
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
                      <p className="text-[0.88rem] leading-6 text-white/90">{product.shortDescription}</p>
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
            href="/product/kitchen-cabinet"
            className="inline-flex rounded-md bg-[#5c3d42] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#4a2f34]"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}
