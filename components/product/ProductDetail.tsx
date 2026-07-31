"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import MagneticButton from "@/components/ui/MagneticButton";
import type { HomeProduct } from "@/lib/productData";

type Props = {
  product: HomeProduct;
  related: HomeProduct[];
};

const PRODUCT_PRIMARY_BTN =
  "!rounded-md !px-7 !py-3 !font-outfit !text-sm !font-medium !normal-case !tracking-normal";

const PRODUCT_OUTLINE_BTN =
  `${PRODUCT_PRIMARY_BTN} !border-[#5c3d46] !bg-white/90 !text-[#5c3d46] hover:!border-[#5c3d46] hover:!bg-white hover:!text-[#5c3d46]`;

export default function ProductDetail({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="min-w-0 bg-[#f7f3f2]">
      <PageShell className="pb-10 pt-[72px] sm:pt-[102px] md:pb-14">
        <Link
          href="/#products"
          className="mb-6 inline-flex items-center gap-2 font-outfit text-sm text-[#5c3d46]/75 transition hover:text-[#5c3d46] sm:mb-8"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to Products
        </Link>

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-8 xl:gap-x-14">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[14px] bg-[#e8e2e0] sm:rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.title}
                className="aspect-[4/3] h-auto w-full max-w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid min-w-0 grid-cols-4 gap-2 sm:mt-4 sm:gap-2.5">
                {gallery.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    className={`min-w-0 overflow-hidden rounded-lg border-2 transition ${
                      activeImage === src
                        ? "border-[#5c3d46]"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-outfit text-[0.6875rem] font-medium tracking-[0.18em] text-[#c46b7a] uppercase sm:text-[0.75rem]">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-bold tracking-[0.04em] text-[#5c3d46]">
              {product.title}
            </h1>
            <p className="mt-4 text-pretty font-outfit text-[clamp(0.9375rem,2.1vw,1.05rem)] leading-7 text-[#5a5254] sm:mt-5 sm:leading-8">
              {product.fullDescription}
            </p>

            <ul className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex min-w-0 items-start gap-3 font-outfit text-[0.9375rem] leading-snug text-[#5c3d46] sm:text-[0.95rem]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c46b7a]" aria-hidden />
                  <span className="min-w-0 text-pretty">{feature}</span>
                </li>
              ))}
            </ul>

            {product.specs.length > 0 && (
              <div className="mt-6 grid min-w-0 grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 lg:grid-cols-2 xl:grid-cols-4">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="min-w-0 rounded-lg bg-white/70 px-3 py-3 sm:px-3.5 sm:py-3.5"
                  >
                    <p className="font-outfit text-[0.625rem] tracking-[0.12em] text-[#5c3d46]/55 uppercase sm:text-[0.68rem]">
                      {spec.label}
                    </p>
                    <p className="mt-1 break-words font-outfit text-[0.8125rem] font-medium leading-snug text-[#5c3d46] sm:text-sm">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <MagneticButton href="/contact" variant="primary" className={PRODUCT_PRIMARY_BTN}>
                Free Consultation
              </MagneticButton>
              <MagneticButton href="/interior" variant="ghost" className={PRODUCT_OUTLINE_BTN}>
                Browse Interiors
              </MagneticButton>
            </div>
          </div>
        </div>
      </PageShell>

      {related.length > 0 && (
        <PageShell className="pb-16 md:pb-24 lg:pb-28">
          <h2 className="font-display text-balance text-[clamp(1.375rem,3vw,1.875rem)] tracking-[0.06em] text-[#5c3d46]">
            Related Products
          </h2>
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                className="group min-w-0 overflow-hidden rounded-[14px] bg-[#e8e2e0] sm:rounded-[16px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3.5 sm:p-4">
                    <p className="font-outfit text-[0.625rem] tracking-[0.14em] text-[#e8a0ad] uppercase sm:text-[0.68rem]">
                      {item.category}
                    </p>
                    <h3 className="mt-1 text-pretty font-outfit text-base font-semibold text-white sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PageShell>
      )}
    </div>
  );
}
