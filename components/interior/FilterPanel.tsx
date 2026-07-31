"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModalScrollLock } from "@/hooks/useModalScrollLock";
import { useTranslations } from "next-intl";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EMPTY_FILTERS,
  getFilterOptionsForSection,
  getFilterSectionsForCategory,
  type AdvancedFilters,
  type CategoryFilterSection,
  type InteriorCatalogFilterSource,
  type InteriorCategory,
} from "@/lib/interiorData";

type FilterKey = keyof AdvancedFilters;

const SECTION_META: Record<
  CategoryFilterSection,
  { key: FilterKey; label: string; placeholder: string }
> = {
  shapes: { key: "shapes", label: "Shapes", placeholder: "Select Shapes" },
  subcategories: {
    key: "subcategories",
    label: "Type",
    placeholder: "Select Type",
  },
  styles: { key: "styles", label: "Style", placeholder: "Select Style" },
  colors: { key: "colors", label: "Color", placeholder: "Select Color" },
  materials: {
    key: "materials",
    label: "Material",
    placeholder: "Select Material",
  },
  finishes: { key: "finishes", label: "Finish", placeholder: "Select Finish" },
};

const DROPDOWN_BTN =
  "inline-flex h-11 w-full items-center justify-between rounded-[6px] border border-[#cfc4c6] bg-white px-5 font-outfit text-[14px] font-normal text-[#6a414d]/70 outline-none transition hover:border-[#6a414d]/35";

const SCROLL_AREA =
  "scrollbar-brand min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] pr-1";

const DROPDOWN_LIST =
  "scrollbar-brand mt-2 max-h-44 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] rounded-[6px] border border-[#cfc4c6] bg-white py-1 pr-1 shadow-sm";

const CLOSE_BTN =
  "group relative -m-2 inline-flex shrink-0 cursor-pointer items-center justify-center p-2 touch-manipulation";

const CLOSE_BTN_ICON =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cfc4c6] text-[#6a414d] transition group-hover:bg-[#f7f1f2] group-active:bg-[#f7f1f2]";

const FILTER_EASE = [0.32, 0.72, 0, 1] as const;
const BACKDROP_TRANSITION = { duration: 0.32, ease: "easeOut" as const };
const DRAWER_TRANSITION = { duration: 0.38, ease: FILTER_EASE };

function readMinWidthSm() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 640px)").matches;
}

function useMinWidthSm() {
  const [minSm, setMinSm] = useState(readMinWidthSm);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setMinSm(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return minSm;
}

function FilterSections({
  sections,
  draft,
  openSection,
  toggleSection,
  toggleOption,
  removeTag,
  t,
}: {
  sections: {
    section: CategoryFilterSection;
    key: FilterKey;
    label: string;
    placeholder: string;
    options: readonly string[];
  }[];
  draft: AdvancedFilters;
  openSection: FilterKey | null;
  toggleSection: (key: FilterKey) => void;
  toggleOption: (key: FilterKey, option: string) => void;
  removeTag: (key: FilterKey, option: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <>
      {sections.map((section, sectionIndex) => {
        const selected = draft[section.key];
        const isOpen = openSection === section.key;
        const isLast = sectionIndex === sections.length - 1;

        return (
          <div
            key={section.key}
            className={isLast ? "pt-0" : "border-b border-[#e5dcd3] pb-4 pt-0"}
            style={sectionIndex > 0 ? { paddingTop: "1rem" } : undefined}
          >
            <p className="mb-2.5 font-outfit text-[14px] font-medium text-[#6a414d]">
              {section.label}
            </p>

            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              className={DROPDOWN_BTN}
              aria-expanded={isOpen}
            >
              <span>
                {selected.length > 0 ? `${selected.length} selected` : section.placeholder}
              </span>
              <ChevronDown
                size={12}
                className={`shrink-0 text-[#6a414d]/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: FILTER_EASE }}
                  className="overflow-hidden"
                >
                  <div className={DROPDOWN_LIST} data-lenis-prevent>
                    {section.options.length === 0 ? (
                      <p className="px-4 py-3 font-outfit text-[13px] text-[#6a414d]/60">
                        {t("noOptions")}
                      </p>
                    ) : (
                      section.options.map((option) => {
                        const active = selected.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleOption(section.key, option)}
                            className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left font-outfit text-[13px] transition hover:bg-[#f7f1f2] ${
                              active ? "font-medium text-[#6a414d]" : "font-normal text-[#444]"
                            }`}
                          >
                            <span>{option}</span>
                            {active && <span className="text-[#825E69]">✓</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selected.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1 font-outfit text-[12px] text-[#7a7072]">
                {selected.map((tag, i) => (
                  <span key={tag} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => removeTag(section.key, tag)}
                      className="cursor-pointer font-medium transition hover:text-[#6a414d]"
                      title={`Remove ${tag}`}
                    >
                      {tag}
                    </button>
                    {i < selected.length - 1 && (
                      <span className="mx-1.5 select-none text-[#cfc4c6]">|</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

type PanelBodyProps = {
  category: InteriorCategory;
  value: AdvancedFilters;
  catalog: InteriorCatalogFilterSource[];
  isDesktopDrawer: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
};

function FilterPanelBody({
  category,
  value,
  catalog,
  isDesktopDrawer,
  onClose,
  onApply,
}: PanelBodyProps) {
  const t = useTranslations("filter");
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<AdvancedFilters>(value);
  const [openSection, setOpenSection] = useState<FilterKey | null>(null);

  useModalScrollLock(true, panelRef, undefined, { overlay: true });

  const sections = useMemo(
    () =>
      getFilterSectionsForCategory(category).map((section) => ({
        section,
        ...SECTION_META[section],
        options: getFilterOptionsForSection(section, category, catalog),
      })),
    [category, catalog],
  );

  useEffect(() => {
    setDraft(value);
    setOpenSection(null);
  }, [value, category]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleSection(key: FilterKey) {
    setOpenSection((prev) => (prev === key ? null : key));
  }

  function toggleOption(key: FilterKey, option: string) {
    setDraft((prev) => {
      const list = prev[key];
      const next = list.includes(option) ? list.filter((v) => v !== option) : [...list, option];
      return { ...prev, [key]: next };
    });
  }

  function removeTag(key: FilterKey, option: string) {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== option),
    }));
  }

  function handleClose() {
    setOpenSection(null);
    onClose();
  }

  const footer = (
    <div
      className={`flex shrink-0 gap-3 border-t border-[#e5dcd3] sm:gap-4 ${isDesktopDrawer ? "px-[30px] pb-10 pt-5" : "px-5 pb-6 pt-4"}`}
    >
      <button
        type="button"
        onClick={() => {
          onApply(draft);
          handleClose();
        }}
        className="flex-1 cursor-pointer rounded-[6px] bg-[#6a414d] py-3 font-outfit text-[14px] font-medium uppercase tracking-[0.1em] text-white transition hover:bg-[#5a3640]"
      >
        {t("apply")}
      </button>
      <button
        type="button"
        onClick={() => {
          setDraft(EMPTY_FILTERS);
          onApply(EMPTY_FILTERS);
          handleClose();
        }}
        className="flex-1 cursor-pointer rounded-[6px] border border-[#6a414d] bg-white py-3 font-outfit text-[14px] font-medium text-[#6a414d] transition hover:bg-[#6a414d]/5"
      >
        {t("clear")}
      </button>
    </div>
  );

  return (
    <div ref={panelRef} className="pointer-events-none absolute inset-0 size-full">
      <motion.button
        type="button"
        aria-label={t("close")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={BACKDROP_TRANSITION}
        className="pointer-events-auto absolute inset-0 z-0 cursor-default bg-black/40"
        onClick={handleClose}
      />

      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        initial={isDesktopDrawer ? { x: "100%" } : { y: "100%" }}
        animate={isDesktopDrawer ? { x: 0 } : { y: 0 }}
        exit={isDesktopDrawer ? { x: "100%" } : { y: "100%" }}
        transition={DRAWER_TRANSITION}
        style={{ willChange: "transform" }}
        className={
          isDesktopDrawer
            ? "pointer-events-auto absolute right-0 top-0 z-10 flex h-dvh w-full max-w-[388px] flex-col overflow-hidden bg-white shadow-2xl"
            : "pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex h-[min(88dvh,100%)] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-2xl"
        }
      >
        {!isDesktopDrawer && (
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-[#cfc4c6]" />
          </div>
        )}

        <div
          className={`flex shrink-0 items-center justify-between border-b border-[#e5dcd3] ${isDesktopDrawer ? "px-[30px] pb-4 pt-10" : "px-5 pb-3 pt-1"}`}
        >
          <h2
            className={`font-outfit font-medium text-[#6a414d] ${isDesktopDrawer ? "text-[22px] leading-none" : "text-[18px]"}`}
          >
            {t("title")}
          </h2>
          <button
            type="button"
            aria-label={t("close")}
            onClick={handleClose}
            className={`${CLOSE_BTN} ${isDesktopDrawer ? "-mr-1" : "-mr-2"}`}
          >
            <span className={CLOSE_BTN_ICON}>
              <X size={isDesktopDrawer ? 16 : 15} strokeWidth={1.75} aria-hidden />
            </span>
          </button>
        </div>

        <div
          className={`${SCROLL_AREA} ${isDesktopDrawer ? "px-[30px] py-5" : "px-5 py-4"}`}
          data-lenis-prevent
        >
          <FilterSections
            sections={sections}
            draft={draft}
            openSection={openSection}
            toggleSection={toggleSection}
            toggleOption={toggleOption}
            removeTag={removeTag}
            t={t}
          />
        </div>

        {footer}
      </motion.aside>
    </div>
  );
}

type Props = {
  open: boolean;
  category: InteriorCategory;
  value: AdvancedFilters;
  catalog?: InteriorCatalogFilterSource[];
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
};

function FilterPanelLayer({
  category,
  value,
  catalog = [],
  onClose,
  onApply,
}: Omit<Props, "open">) {
  const isDesktopDrawer = useMinWidthSm();

  return (
    <FilterPanelBody
      category={category}
      value={value}
      catalog={catalog}
      isDesktopDrawer={isDesktopDrawer}
      onClose={onClose}
      onApply={onApply}
    />
  );
}

export default function FilterPanel({
  open,
  category,
  value,
  catalog,
  onClose,
  onApply,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="interior-filter-panel"
          className="fixed inset-0 z-[100]"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1, transition: DRAWER_TRANSITION }}
        >
          <FilterPanelLayer
            category={category}
            value={value}
            catalog={catalog}
            onClose={onClose}
            onApply={onApply}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
