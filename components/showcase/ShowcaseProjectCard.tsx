"use client";

import ShowcaseProductCard from "@/components/ui/ShowcaseProductCard";
import type { ShowcaseProject } from "@/lib/showcaseData";
import { MEDIA } from "@/lib/mediaAssets";

type ShowcaseProjectCardProps = {
  project: ShowcaseProject;
  index?: number;
};

const FALLBACK = MEDIA.interior[0];

export default function ShowcaseProjectCard({ project, index = 0 }: ShowcaseProjectCardProps) {
  return (
    <ShowcaseProductCard
      variant="showcase"
      index={index}
      motionVariant="mount"
      title={project.title}
      image={project.image}
      imageFallback={FALLBACK}
      href={`/projects/${project.id}`}
    />
  );
}
