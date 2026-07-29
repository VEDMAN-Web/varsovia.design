"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import CatalogueNotebookCard from "@/components/catalogue/CatalogueNotebookCard";
import DownloadCatalogueModal from "@/components/forms/DownloadCatalogueModal";
import SectionHeading from "@/components/ui/SectionHeading";
import { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import {
  CATALOGUE_CARD_HEIGHT,
  CATALOGUE_CONTENT_WIDTH,
  CATALOGUE_NOTEBOOK_GRID,
  CATALOGUE_ROW_SLOT_HEIGHT,
  CATALOGUE_SECTION_SHELL,
} from "@/components/catalogue/catalogueLayoutShared";
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
  const [items, setItems] = useState<CatalogueItem[]>(FALLBACK_ITEMS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
      <main className="bg-cream min-h-screen pt-[72px] pb-16 md:pb-24">
        <div className={`${CATALOGUE_SECTION_SHELL} pt-10 md:pt-14`}>
          <div className={CATALOGUE_CONTENT_WIDTH}>
            <SectionHeading
              titleAs="h1"
              title="Free Catalogue"
              subtitle="Explore Our Interior Design Catalogue"
              subtitleSentenceCase
              className={`${SECTION_HEADING_WIDE} mb-10 md:mb-14`}
            />

            <div className="space-y-14 md:space-y-16">
              {[0, 1].map((row) => (
                <div
                  key={row}
                  className={`${CATALOGUE_NOTEBOOK_GRID} ${CATALOGUE_ROW_SLOT_HEIGHT} ${row === 0 ? "items-end" : "items-start"}`}
                >
                  {displayItems.slice(row * 3, row * 3 + 3).map((item, col) => {
                    const isHovered = hoveredId === item.id;
                    const defaultHover = row === 0 && col === 1 && hoveredId === null;

                    return (
                      <div
                        key={item.id}
                        className={`relative flex ${CATALOGUE_ROW_SLOT_HEIGHT} w-full min-w-0 overflow-visible ${row === 0 ? "items-end" : "items-start"}`}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <CatalogueNotebookCard
                          coverImage={item.coverImage}
                          hovered={isHovered || defaultHover}
                          onClick={() => openDownload(item)}
                        />
                      </div>
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
