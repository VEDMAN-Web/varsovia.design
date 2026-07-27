"use client";

import Link from "next/link";
import { INTERIOR_ITEMS, type InteriorItem } from "@/lib/interiorData";

type Props = {
  item: InteriorItem;
};

export default function InteriorDetail({ item }: Props) {
  // Fetch up to 3 other kitchen interior items as recommendations
  const related = INTERIOR_ITEMS.filter(
    (it) => it.category === "Kitchen" && it.id !== item.id
  ).slice(0, 3);

  // Use custom detailed titles and descriptions if the category is Kitchen
  const isKitchen = item.category === "Kitchen";
  const displayTitle = isKitchen
    ? "Cilon Series Modern Curved Kitchen Cabinetry with Island BLCC22300"
    : `${item.title} Cabinetry`;
  const displayDesc = isKitchen
    ? "Elwood is a kitchen that balances modern minimalism with warmth. Built from premium oak and featuring integrated appliances, each detail is planned for daily utility. Under-cabinet task lighting illuminates the workspace, while deep drawers keep cooking tools organized."
    : item.description;

  return (
    <div className="bg-[#f7f3f2]">
      {/* 1. Full-bleed Hero Banner */}
      <section className="relative w-full h-[60vh] min-h-[380px] md:h-[68vh] overflow-hidden">
        <img
          src={isKitchen ? "/Interior-kitchen/kitchen1.png" : item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10" />
      </section>

      {/* Main Content Area */}
      <div className="container-1240 py-12 md:py-20">
        {/* 2. Title & Elwood Description */}
        <section className="max-w-[1000px] mb-12 md:mb-16">
          <h1 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold text-[#5c3d42] tracking-wide leading-tight">
            {displayTitle}
          </h1>
          <p className="mt-6 text-sm md:text-base text-[#5c3d42]/80 leading-relaxed font-medium">
            {displayDesc}
          </p>
        </section>

        {/* 3. Image Grid 1 */}
        <section className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <img
                src={isKitchen ? "/Interior-kitchen/kitchen1.png" : item.image}
                alt="Detail view left"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <img
                src={isKitchen ? "/Interior-kitchen/kitchen1.png" : item.image}
                alt="Detail view right"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Panoramic wide layout */}
          <div className="relative aspect-[2.4/1] w-full mt-4 md:mt-6 overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <img
              src={isKitchen ? "/Interior-kitchen/kitchen1.png" : item.image}
              alt="Panoramic view"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 4. Narrative/Details Layout 1 (Text Left, Image Right) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-24">
          <div>
            <p className="text-sm md:text-base text-[#5c3d42]/85 leading-relaxed font-medium">
              {isKitchen
                ? "The objective was to create a kitchen that is both spacious and functional, without compromising on styling. The challenge was successfully met by introducing a super-sized island layout, custom cabinetry, warm palette, and an open layout that balances utility, efficiency and spaciousness."
                : "Our design team crafted this interior to enhance room proportions and visual lines. Through smart storage elements and cohesive colors, we created a space that is as comfortable to live in as it is beautiful to observe."}
            </p>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <img
              src={isKitchen ? "/Interior-kitchen/kitchen1.png" : item.image}
              alt="Vertical highlight 1"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 5. Narrative/Details Layout 2 (Image Left, Text Right) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-24">
          <div className="relative aspect-[3/4] w-full order-last md:order-first overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <img
              src={isKitchen ? "/Interior-kitchen/kitchen1.png" : item.image}
              alt="Vertical highlight 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm md:text-base text-[#5c3d42]/85 leading-relaxed font-medium">
              {isKitchen
                ? "Through thoughtful space planning, premium finishes, and integrated appliances, we transformed the home's culinary space with seamless functionality. Cabinets run wall-to-wall, drawer organizers keep utensils in order, and warm ambient lighting creates a comfortable user experience."
                : "Every element, from material choices to cabinet hinges and soft lighting fixtures, has been selected for quality and durability. The resulting space feels organic and elevated."}
            </p>
          </div>
        </section>

        {/* 6. Image Grid 2 (Two horizontal kitchen images) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-20 md:mb-28">
          <div className="relative aspect-[4/3] md:aspect-[3/2] w-full overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <img
              src={isKitchen ? "/Interior-kitchen/kitchen2.png" : item.image}
              alt="Related details left"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] md:aspect-[3/2] w-full overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <img
              src={isKitchen ? "/home/featured-project/feature-5.jpg" : item.image}
              alt="Related details right"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 7. "You May Like" Section */}
        {related.length > 0 && (
          <section className="border-t border-[#e5dcd3] pt-16">
            <h2 className="font-display text-2xl font-bold text-[#5c3d42] mb-8">
              You May Like
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((it) => (
                <Link
                  key={it.id}
                  href={`/interior/${it.id}`}
                  className="group relative overflow-hidden rounded-[14px] bg-[#e8e2e0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] block cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {it.isNew && (
                      <span className="absolute left-3 top-3 rounded-sm bg-[#e8a0ad] px-2.5 py-1 text-[0.7rem] font-medium text-white shadow-sm">
                        New
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-5 pt-20">
                      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#e8a0ad] uppercase">
                        {it.category}
                      </p>
                      <h3 className="mt-1 text-[1.15rem] font-semibold text-white md:text-[1.25rem]">
                        {it.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-5 text-white/85 font-medium">
                        {it.description}
                      </p>
                      <span className="mt-3.5 block h-[2px] w-10 bg-[#e8a0ad]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
