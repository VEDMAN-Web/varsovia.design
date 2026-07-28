import Navbar from "@/components/layout/Navbar";
import ShowcaseGallerySection from "@/components/showcase/ShowcaseGallerySection";
import ShowcaseSpecCard from "@/components/showcase/ShowcaseSpecCard";
import { SHOWCASE_CONTENT_WIDTH, SHOWCASE_SECTION_SHELL } from "@/components/showcase/showcaseLayoutShared";
import type { ShowcaseProject } from "@/lib/showcaseData";
type ShowcaseDetailContentProps = {
  project: ShowcaseProject;
};

export default function ShowcaseDetailContent({ project }: ShowcaseDetailContentProps) {
  const kitchenImages = project.gallery;
  const bathroomImages = [...project.gallery.slice(1), project.gallery[0]];

  const backHref =
    project.category === "Home case"
      ? "/showcase"
      : `/showcase?tab=${encodeURIComponent(project.category)}`;

  return (
    <>
      <Navbar />
      <main className="bg-[#f5f1f1]">
        {/* Full-viewport hero — image only (overflow clips image, not the card) */}
        <section className="relative h-[75vh] min-h-[480px] w-full">
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/15" />
          </div>
        </section>

        {/* Spec card sits outside hero so metadata is never clipped */}
        <div className={`relative z-20 -mt-[100px] mb-12 md:-mt-[115px] md:mb-16 ${SHOWCASE_SECTION_SHELL}`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <ShowcaseSpecCard project={project} backHref={backHref} />
          </div>        </div>

        <div className={`${SHOWCASE_SECTION_SHELL} pb-16 md:pb-24`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <ShowcaseGallerySection title="Kitchen" images={kitchenImages} />
            <ShowcaseGallerySection title="Bathroom" images={bathroomImages} />
          </div>
        </div>
      </main>
    </>
  );
}
