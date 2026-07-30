"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModalScrollLock } from "@/hooks/useModalScrollLock";
import { useTranslations } from "next-intl";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EMPTY_FILTERS,
  FILTER_OPTIONS,
  getFilterSectionsForCategory,
  getSubcategoryOptions,
  type AdvancedFilters,
  type CategoryFilterSection,
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
  "min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const DROPDOWN_LIST =
  "mt-2 max-h-44 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-[6px] border border-[#cfc4c6] bg-white py-1 shadow-sm";

const CLOSE_BTN =
  "group relative -m-2 inline-flex shrink-0 cursor-pointer items-center justify-center p-2 touch-manipulation";

const CLOSE_BTN_ICON =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cfc4c6] text-[#6a414d] transition group-hover:bg-[#f7f1f2] group-active:bg-[#f7f1f2]";

// ─── Shared filter sections renderer ─────────────────────────────────────────
function FilterSections({
  sections,
  draft,
  openSection,
  toggleSection,
  toggleOption,
  removeTag,
  t,
}: {
  sections: { section: CategoryFilterSection; key: FilterKey; label: string; placeholder: string; options: readonly string[] }[];
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
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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

type Props = {
  open: boolean;
  category: InteriorCategory;
  value: AdvancedFilters;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
};

function getOptionsForSection(
  section: CategoryFilterSection,
  category: InteriorCategory
): readonly string[] {
  switch (section) {
    case "shapes":
      return FILTER_OPTIONS.shapes;
    case "subcategories":
      return getSubcategoryOptions(category);
    case "styles":
      return FILTER_OPTIONS.styles;
    case "colors":
      return FILTER_OPTIONS.colors;
    case "materials":
      return FILTER_OPTIONS.materials;
    case "finishes":
      return FILTER_OPTIONS.finishes;
    default:
      return [];
  }
}

function FilterPanelContent({
  category,
  value,
  onClose,
  onApply,
}: Omit<Props, "open">) {
  const t = useTranslations("filter");
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<AdvancedFilters>(value);
  const [openSection, setOpenSection] = useState<FilterKey | null>(null);

  useModalScrollLock(true, panelRef);

  const sections = useMemo(
    () =>
      getFilterSectionsForCategory(category).map((section) => ({
        section,
        ...SECTION_META[section],
        options: getOptionsForSection(section, category),
      })),
    [category]
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

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black"
        onClick={onClose}
      />

      <div ref={panelRef} className="pointer-events-none fixed inset-0 z-[90]">
        {/* Mobile — bottom sheet */}
        <motion.aside
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 240 }}
          className="pointer-events-auto fixed inset-x-0 bottom-0 flex h-[min(88dvh,100%)] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-2xl sm:hidden"
          aria-modal="true"
          role="dialog"
          aria-label={t("title")}
        >
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-[#cfc4c6]" />
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-[#e5dcd3] px-5 pb-3 pt-1">
            <h2 className="font-outfit text-[18px] font-medium text-[#6a414d]">{t("title")}</h2>
            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className={`${CLOSE_BTN} -mr-2`}
            >
              <span className={CLOSE_BTN_ICON}>
                <X size={15} strokeWidth={1.75} aria-hidden />
              </span>
            </button>
          </div>

          <div className={`${SCROLL_AREA} px-5 py-4`} data-lenis-prevent>
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

          <div className="flex shrink-0 gap-3 border-t border-[#e5dcd3] px-5 pb-6 pt-4">
            <button
              type="button"
              onClick={() => { onApply(draft); onClose(); }}
              className="flex-1 rounded-[8px] bg-[#6a414d] py-3 font-outfit text-[14px] font-medium uppercase tracking-[0.1em] text-white transition hover:bg-[#5a3640]"
            >
              {t("apply")}
            </button>
            <button
              type="button"
              onClick={() => { setDraft(EMPTY_FILTERS); onApply(EMPTY_FILTERS); onClose(); }}
              className="flex-1 rounded-[8px] border border-[#6a414d] bg-white py-3 font-outfit text-[14px] font-medium text-[#6a414d] transition hover:bg-[#6a414d]/5"
            >
              {t("clear")}
            </button>
          </div>
        </motion.aside>

        {/* Desktop — side drawer */}
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="pointer-events-auto fixed right-0 top-0 hidden h-dvh w-full max-w-[388px] flex-col overflow-hidden bg-white shadow-2xl sm:flex"
          aria-modal="true"
          role="dialog"
          aria-label={t("title")}
        >
          <div className="shrink-0 border-b border-[#e5dcd3] px-[30px] pb-4 pt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-[22px] font-medium leading-none text-[#6a414d]">
                {t("title")}
              </h2>
              <button
                type="button"
                aria-label={t("close")}
                onClick={onClose}
                className={`${CLOSE_BTN} -mr-1`}
              >
                <span className={CLOSE_BTN_ICON}>
                  <X size={16} strokeWidth={1.75} aria-hidden />
                </span>
              </button>
            </div>
          </div>

          <div className={`${SCROLL_AREA} px-[30px] py-5`} data-lenis-prevent>
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

          <div className="flex shrink-0 gap-4 border-t border-[#e5dcd3] px-[30px] pb-10 pt-5">
            <button
              type="button"
              onClick={() => { onApply(draft); onClose(); }}
              className="flex-1 cursor-pointer rounded-[6px] bg-[#6a414d] py-3 font-outfit text-[14px] font-medium uppercase tracking-[0.1em] text-white transition hover:bg-[#5a3640]"
            >
              {t("apply")}
            </button>
            <button
              type="button"
              onClick={() => { setDraft(EMPTY_FILTERS); onApply(EMPTY_FILTERS); onClose(); }}
              className="flex-1 cursor-pointer rounded-[6px] border border-[#6a414d] bg-white py-3 font-outfit text-[14px] font-medium text-[#6a414d] transition hover:bg-[#6a414d]/5"
            >
              {t("clear")}
            </button>
          </div>
        </motion.aside>
      </div>
    </>
  );
}

export default function FilterPanel({ open, category, value, onClose, onApply }: Props) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <FilterPanelContent
          category={category}
          value={value}
          onClose={onClose}
          onApply={onApply}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
