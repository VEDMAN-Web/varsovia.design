"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import { fallbackHomeData } from "@/lib/fallbackData";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

type Project = {
  _id: string;
  title: string;
  coverImage?: string;
  slug?: string;
  category?: string;
  location?: string;
  description?: string;
  gallery?: string[];
};

type FeaturedProjectsProps = {
  projects?: Project[];
};

const FALLBACK_PROJECTS = fallbackHomeData.projects as Project[];

const DEFAULT_COVER = MEDIA.featured[0];

function resolveCover(project: Project) {
  return resolveMediaUrl(project.coverImage || project.gallery?.[0], DEFAULT_COVER);
}

function buildDisplayProjects(projects?: Project[]) {
  const source = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const merged: Project[] = [];
  const seen = new Set<string>();

  for (const project of source) {
    const key = project.slug || project._id;
    if (seen.has(key)) continue;
    merged.push({ ...project, coverImage: resolveCover(project) });
    seen.add(key);
  }

  for (const fallback of FALLBACK_PROJECTS) {
    if (merged.length >= 8) break;
    const key = fallback.slug || fallback._id;
    if (seen.has(key)) continue;
    merged.push({ ...fallback, coverImage: resolveCover(fallback) });
    seen.add(key);
  }

  return merged;
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, string>>({});
  const [projectLimit, setProjectLimit] = useState(8);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setProjectLimit(4);
      else if (w < 768) setProjectLimit(5);
      else if (w < 1024) setProjectLimit(6);
      else setProjectLimit(8);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const displayProjects = useMemo(
    () => buildDisplayProjects(projects).slice(0, projectLimit),
    [projects, projectLimit],
  );
  const expandedIndex = hovered ?? active;

  useEffect(() => {
    if (active >= displayProjects.length) setActive(0);
    if (hovered !== null && hovered >= displayProjects.length) setHovered(null);
  }, [active, displayProjects.length, hovered]);

  return (
    <section id="projects" className="bg-transparent py-14 sm:py-20 md:py-28">
      <SectionShell>
        <SectionHeading
          title={t("featuredTitle")}
          subtitle={t("featuredSubtitle")}
          className={SECTION_HEADING_WIDE}
        />

        <div className="mt-6 w-full min-w-0 sm:mt-10 md:mt-12" onMouseLeave={() => setHovered(null)}>
          <div className="flex h-[240px] w-full min-w-0 gap-1 overflow-hidden sm:h-[300px] sm:gap-1.5 md:h-[360px] md:gap-2 lg:h-[400px] lg:gap-2.5">
            {displayProjects.map((item, i) => {
              const isExpanded = expandedIndex === i;
              const imageSrc = brokenImages[item._id] || resolveCover(item);

              return (
                <motion.button
                  key={item._id}
                  type="button"
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onClick={() => {
                    setActive(i);
                    setHovered(i);
                  }}
                  className="relative h-full min-w-0 overflow-hidden rounded-[8px] outline-none sm:rounded-[12px] md:rounded-[14px]"
                  initial={false}
                  animate={{ flexGrow: isExpanded ? 12 : 1, flexShrink: 1, flexBasis: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 32 }}
                >
                  <img
                    src={imageSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                    onError={() => {
                      const fallback = item.gallery?.find(Boolean) || DEFAULT_COVER;
                      if (brokenImages[item._id] !== fallback) {
                        setBrokenImages((prev) => ({ ...prev, [item._id]: fallback }));
                      }
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-50"
                    }`}
                  />

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-3 left-3 right-3 text-left sm:bottom-4 sm:left-4 sm:right-4 md:bottom-5 md:left-5 md:right-5"
                    >
                      {(item.location || item.category) && (
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/75 sm:text-xs">
                          {[item.location, item.category].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-medium text-white sm:text-base md:text-[1.15rem]">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-1.5 line-clamp-2 max-w-md text-[0.7rem] leading-relaxed text-white/85 sm:text-xs md:text-sm">
                          {item.description}
                        </p>
                      )}
                      <span className="mt-2 block h-[2px] w-10 bg-[#e85d8a] sm:mt-2.5 sm:w-14" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/interior"
            className="inline-flex rounded-md bg-[#5c3d42] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a2f34] sm:px-8 sm:py-3"
          >
            Explore More
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
