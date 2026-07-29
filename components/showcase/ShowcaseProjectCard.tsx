"use client";

import { Link } from "@/lib/i18n/navigation";
import type { ShowcaseProject } from "@/lib/showcaseData";
import { SHOWCASE_CARD_SLOT_HEIGHT } from "@/components/showcase/showcaseLayoutShared";

type ShowcaseProjectCardProps = {
  project: ShowcaseProject;
};

const FALLBACK = "/Interior-kitchen/kitchen1.png";

export default function ShowcaseProjectCard({ project }: ShowcaseProjectCardProps) {
  return (
    <div className={`relative ${SHOWCASE_CARD_SLOT_HEIGHT} w-full min-w-0 overflow-visible`}>
      <Link
        href={`/showcase/${project.id}`}
        className="group absolute inset-x-0 bottom-0 top-0 block overflow-hidden rounded-[14px] border border-[#e5dcd3]/35 shadow-[0_4px_20px_rgba(107,44,58,0.04)] outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(70,40,50,0.16)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.includes(FALLBACK)) return;
            img.src = FALLBACK;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
          <div className="mb-3 h-0.5 w-8 bg-[#cf5374] transition-all duration-300 group-hover:w-14" />
          <h3 className="font-outfit max-w-[95%] text-[clamp(0.875rem,1.6vw,1rem)] font-medium leading-snug text-white">
            {project.title}
          </h3>
        </div>
      </Link>
    </div>
  );
}
