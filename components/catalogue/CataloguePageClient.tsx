"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import CatalogueNotebookCard from "@/components/catalogue/CatalogueNotebookCard";
import DownloadCatalogueModal from "@/components/forms/DownloadCatalogueModal";
import SectionHeading from "@/components/ui/SectionHeading";
import { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import {
  CATALOGUE_CARD_SLOT,
  CATALOGUE_CONTENT_WIDTH,
  CATALOGUE_NOTEBOOK_GRID,
  CATALOGUE_SECTION_SHELL,
} from "@/components/catalogue/catalogueLayoutShared";
import { catalogueCoverPhoto } from "@/components/catalogue/catalogueMedia";
import { notebookBrochureTheme } from "@/components/catalogue/catalogueBrochureThemes";
import { fetchCatalogues } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { fallbackHomeData } from "@/lib/fallbackData";

type CatalogueItem = {
  id: string;
  title: string;
  coverImage: string;
  downloadUrl: string;
};

const FALLBACK_ITEMS: CatalogueItem[] = fallbackHomeData.catalogues.map((c) => ({
  id: c._id,
  title: c.title,
  coverImage: c.coverImage,
  downloadUrl: c.downloadUrl || "",
}));

export default function CataloguePageClient() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [items, setItems] = useState<CatalogueItem[]>(FALLBACK_ITEMS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false);
  const [selected, setSelected] = useState<CatalogueItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCatalogues(locale as Locale).then((data) => {
      if (!data?.length) return;
      setItems(
        data.map((c: { _id?: string; id?: string; title: string; coverImage?: string; downloadUrl?: string }) => ({
          id: c._id || c.id || c.title,
          title: c.title,
          coverImage: c.coverImage || "/home/catalog.png",
          downloadUrl: c.downloadUrl || "",
        }))
      );
    });
  }, [locale]);

  // Touch devices keep a stale :hover after tapping, so lift only where hover exists
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverCapable(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const displayItems = useMemo(() => {
    if (items.length >= 6) return items.slice(0, 6);
    const padded = [...items];
    while (padded.length < 6) {
      padded.push({ ...FALLBACK_ITEMS[padded.length % FALLBACK_ITEMS.length], id: `fallback-${padded.length}` });
    }
    return padded.slice(0, 6);
  }, [items]);

  function openDownload(item: CatalogueItem) {
    setSelected(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelected(null);
  }

  return (
    <>
      <Navbar />
      {/* overflow-x-clip: the hover lift scales cards past the edge column */}
      <main className="bg-cream min-h-screen overflow-x-clip pt-[72px] pb-12 sm:pt-[102px] sm:pb-16 md:pb-24">
        <div className={`${CATALOGUE_SECTION_SHELL} pt-8 sm:pt-10 md:pt-14`}>
          <div className={CATALOGUE_CONTENT_WIDTH}>
            <SectionHeading
              titleAs="h1"
              title="Free Catalogue"
              subtitle="Explore Our Interior Design Catalogue"
              subtitleSentenceCase
              className={`${SECTION_HEADING_WIDE} mb-8 sm:mb-10 md:mb-14`}
            />

            <div className="space-y-10 sm:space-y-12 lg:space-y-14">
              {[0, 1].map((row) => (
                <div key={row} className={CATALOGUE_NOTEBOOK_GRID}>
                  {displayItems.slice(row * 3, row * 3 + 3).map((item, col) => {
                    const index = row * 3 + col;
                    const theme = notebookBrochureTheme(index, item.title);
                    const isHovered = hoveredId === item.id;
                    const isAccent = hoverCapable && row === 0 && col === 1 && hoveredId === null;

                    return (
                      <motion.div
                        key={item.id}
                        className={CATALOGUE_CARD_SLOT}
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: reducedMotion ? 0.2 : 0.55,
                          delay: reducedMotion ? 0 : index * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse") setHoveredId(item.id);
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") setHoveredId(null);
                        }}
                      >
                        <CatalogueNotebookCard
                          coverImage={catalogueCoverPhoto(item.coverImage, index, theme.photo)}
                          room={theme.room}
                          hovered={isHovered || isAccent}
                          onClick={() => openDownload(item)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <DownloadCatalogueModal
        open={modalOpen}
        onClose={closeModal}
        downloadUrl={selected?.downloadUrl || selected?.coverImage}
        images={fallbackHomeData.site.contactImages}
      />
    </>
  );
}
