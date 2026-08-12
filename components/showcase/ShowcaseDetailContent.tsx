import Navbar from "@/components/layout/Navbar";
import ShowcaseDetailHero from "@/components/showcase/ShowcaseDetailHero";
import ShowcaseGallerySection from "@/components/showcase/ShowcaseGallerySection";
import { resolveShowcaseRoomImages } from "@/components/showcase/showcaseGalleryLayoutShared";
import ShowcaseSpecCard from "@/components/showcase/ShowcaseSpecCard";
import {
  SHOWCASE_CONTENT_WIDTH,
  SHOWCASE_DETAIL_CONTENT_SHELL,
  SHOWCASE_DETAIL_GALLERY_PAD_BOTTOM,
  SHOWCASE_DETAIL_GALLERY_PAD_TOP,
  SHOWCASE_DETAIL_PAGE_FILL,
  SHOWCASE_SECTION_SHELL,
} from "@/components/showcase/showcaseLayoutShared";
import type { ShowcaseProject } from "@/lib/showcaseData";

type ShowcaseDetailContentProps = {
  project: ShowcaseProject;
};

export default function ShowcaseDetailContent({ project }: ShowcaseDetailContentProps) {
  const gallery = project.gallery.length > 0 ? project.gallery : [project.image];
  const kitchenImages = resolveShowcaseRoomImages(gallery, 0, project.image);
  const bathroomImages = resolveShowcaseRoomImages(gallery, 1, project.image);

  const backHref =
    project.category === "Home case"
      ? "/projects"
      : `/projects?tab=${encodeURIComponent(project.category)}`;

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2]">
        <ShowcaseDetailHero image={project.image} alt={project.title} />

        <div className={`relative z-20 -mt-[88px] mb-10 sm:-mt-[100px] md:-mt-[115px] md:mb-14 ${SHOWCASE_SECTION_SHELL}`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <ShowcaseSpecCard project={project} backHref={backHref} />
          </div>
        </div>

        <div
          className={`${SHOWCASE_DETAIL_PAGE_FILL} ${SHOWCASE_DETAIL_CONTENT_SHELL} ${SHOWCASE_DETAIL_GALLERY_PAD_TOP} ${SHOWCASE_DETAIL_GALLERY_PAD_BOTTOM}`}
          data-nav-backdrop="light"
        >
          <ShowcaseGallerySection title="Kitchen" images={kitchenImages} />
          <ShowcaseGallerySection title="Bathroom" images={bathroomImages} />
        </div>
      </main>
    </>
  );
}
