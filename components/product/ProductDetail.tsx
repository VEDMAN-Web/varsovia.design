"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { HomeProduct } from "@/lib/productData";

type Props = {
  product: HomeProduct;
  related: HomeProduct[];
};

export default function ProductDetail({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);

  return (
    <div className="bg-[#f7f3f2]">
      <section className="section-pad mx-auto max-w-[1200px] pb-10 pt-28 md:pb-14 md:pt-32">
        <Link
          href="/#products"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#5c3d46]/75 transition hover:text-[#5c3d46]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="overflow-hidden rounded-[18px] bg-[#e8e2e0]">
              <img
                src={activeImage}
                alt={product.title}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {product.gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    activeImage === src ? "border-[#5c3d46]" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.75rem] font-medium tracking-[0.18em] text-[#c46b7a] uppercase">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[0.04em] text-[#5c3d46]">
              {product.title}
            </h1>
            <p className="mt-5 text-[1.05rem] leading-8 text-[#5a5254]">{product.fullDescription}</p>

            <ul className="mt-8 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[0.95rem] text-[#5c3d46]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c46b7a]" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {product.specs.map((spec) => (
                <div key={spec.label} className="rounded-lg bg-white/70 px-3 py-3">
                  <p className="text-[0.68rem] tracking-[0.12em] text-[#5c3d46]/55 uppercase">{spec.label}</p>
                  <p className="mt-1 text-sm font-medium text-[#5c3d46]">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex rounded-md bg-[#5c3d46] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#4a2f34]"
              >
                Free Consultation
              </a>
              <Link
                href="/interior"
                className="inline-flex rounded-md border border-[#5c3d46] px-7 py-3 text-sm font-medium text-[#5c3d46] transition hover:bg-white"
              >
                Browse Interiors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad mx-auto max-w-[1200px] pb-20 md:pb-28">
          <h2 className="font-display text-2xl tracking-[0.06em] text-[#5c3d46] md:text-3xl">
            Related Products
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                className="group overflow-hidden rounded-[16px] bg-[#e8e2e0]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                    <p className="text-[0.68rem] tracking-[0.14em] text-[#e8a0ad] uppercase">{item.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
