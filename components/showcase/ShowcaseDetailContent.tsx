import Navbar from "@/components/layout/Navbar";
import ShowcaseGallerySection from "@/components/showcase/ShowcaseGallerySection";
import ShowcaseSpecCard from "@/components/showcase/ShowcaseSpecCard";
import { SHOWCASE_CONTENT_WIDTH, SHOWCASE_SECTION_SHELL } from "@/components/showcase/showcaseLayoutShared";
import type { ShowcaseProject } from "@/lib/showcaseData";

type ShowcaseDetailContentProps = {
  project: ShowcaseProject;
};

export default function ShowcaseDetailContent({ project }: ShowcaseDetailContentProps) {
  const gallery = project.gallery.length > 0 ? project.gallery : [project.image];
  const kitchenImages = gallery.slice(0, 3);
  const bathroomImages =
    gallery.length >= 6
      ? gallery.slice(3, 6)
      : [gallery[1] ?? gallery[0], gallery[2] ?? gallery[0], gallery[0]];

  const backHref =
    project.category === "Home case"
      ? "/showcase"
      : `/showcase?tab=${encodeURIComponent(project.category)}`;

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2]">
        <section data-nav-backdrop="dark" className="relative h-[min(75vh,720px)] min-h-[420px] w-full sm:min-h-[480px]">
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#f7f3f2]/20" />
          </div>
        </section>

        <div className={`relative z-20 -mt-[88px] mb-10 sm:-mt-[100px] md:-mt-[115px] md:mb-14 ${SHOWCASE_SECTION_SHELL}`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <ShowcaseSpecCard project={project} backHref={backHref} />
          </div>
        </div>

        <div className={`${SHOWCASE_SECTION_SHELL} pb-16 md:pb-24`} data-nav-backdrop="light">
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <ShowcaseGallerySection title="Kitchen" images={kitchenImages} layout="stacked" />
            <ShowcaseGallerySection title="Bathroom" images={bathroomImages} layout="collage" />
          </div>
        </div>
      </main>
    </>
  );
}
