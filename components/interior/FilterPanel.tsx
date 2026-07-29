"use client";

import { useEffect, useMemo, useState } from "react";
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
  "inline-flex h-11 w-[150px] items-center justify-between rounded-[6px] border border-[#cfc4c6] bg-white px-5 font-outfit text-[14px] font-normal text-[#6a414d]/70 outline-none transition hover:border-[#6a414d]/35";

const HIDE_SCROLLBAR =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const SCROLLABLE_OPTIONS = 7;

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

export default function FilterPanel({ open, category, value, onClose, onApply }: Props) {
  const t = useTranslations("filter");
  const [draft, setDraft] = useState<AdvancedFilters>(EMPTY_FILTERS);
  const [openSection, setOpenSection] = useState<FilterKey | null>(null);

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
    if (open) {
      setDraft(value);
      setOpenSection(null);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

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
    <AnimatePresence>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[102px] z-[80] overflow-hidden">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            aria-label="Close filter overlay"
            className="absolute inset-0 cursor-pointer bg-black"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="absolute right-0 top-0 z-10 flex h-full w-full max-w-[388px] flex-col bg-white px-[30px] py-10 shadow-2xl"
          >
            <div className="border-b border-[#e5dcd3] pb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-outfit text-[22px] !font-bold leading-none !text-black">
                  {t("title")}
                </h2>
                <button
                  type="button"
                  aria-label={t("close")}
                  onClick={onClose}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#cfc4c6] text-[#6a414d] transition hover:bg-[#f7f1f2]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              className={`min-h-0 flex-1 overflow-y-auto overscroll-contain py-5 ${HIDE_SCROLLBAR}`}
            >
              {sections.map((section, sectionIndex) => {
                const selected = draft[section.key];
                const isOpen = openSection === section.key;
                const isLast = sectionIndex === sections.length - 1;

                return (
                  <div
                    key={section.key}
                    className={
                      isLast ? "pt-0" : "border-b border-[#e5dcd3] pb-5 pt-0"
                    }
                    style={sectionIndex > 0 ? { paddingTop: "1.25rem" } : undefined}
                  >
                    <p className="mb-3 font-outfit text-[15px] font-medium text-black">
                      {section.label}
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleSection(section.key)}
                      className={DROPDOWN_BTN}
                      aria-expanded={isOpen}
                    >
                      <span>
                        {section.placeholder}
                      </span>
                      <ChevronDown
                        size={12}
                        className={`shrink-0 text-[#6a414d]/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden w-[220px]"
                        >
                          <div
                            className={`mt-2 rounded-[6px] border border-[#cfc4c6] bg-white py-1 shadow-sm ${section.options.length > SCROLLABLE_OPTIONS
                              ? `max-h-52 overflow-y-auto ${HIDE_SCROLLBAR}`
                              : ""
                              }`}
                          >
                            {section.options.length === 0 ? (
                              <p className="px-4 py-3 font-outfit text-[14px] text-[#6a414d]/60">
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
                                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left font-outfit text-[14px] transition hover:bg-[#f7f1f2] ${active
                                      ? "font-medium text-[#6a414d]"
                                      : "font-normal text-[#444]"
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

                    {(() => {
                      const combinedTags = [
                        ...draft.shapes,
                        ...draft.subcategories,
                        ...draft.styles,
                        ...draft.colors,
                        ...draft.materials,
                      ];
                      
                      if (section.key !== "finishes") {
                        if (combinedTags.length === 0) return null;
                        return (
                          <div className="mt-3 flex flex-wrap items-center font-outfit text-[13px] font-normal leading-relaxed text-[#7a7072]">
                            {combinedTags.map((tag) => {
                              let targetKey: FilterKey = "shapes";
                              if (draft.subcategories.includes(tag)) targetKey = "subcategories";
                              else if (draft.styles.includes(tag)) targetKey = "styles";
                              else if (draft.colors.includes(tag)) targetKey = "colors";
                              else if (draft.materials.includes(tag)) targetKey = "materials";

                              return (
                                <span key={tag} className="inline-flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => removeTag(targetKey, tag)}
                                    className="cursor-pointer font-medium transition hover:text-[#6a414d]"
                                    title={`Remove ${tag}`}
                                  >
                                    {tag}
                                  </button>
                                  <span className="mx-2 select-none text-[#cfc4c6]">|</span>
                                </span>
                              );
                            })}
                          </div>
                        );
                      } else {
                        if (selected.length === 0) return null;
                        return (
                          <div className="mt-3 flex flex-wrap items-center font-outfit text-[13px] font-normal leading-relaxed text-[#7a7072]">
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
                                  <span className="mx-2 select-none text-[#cfc4c6]">|</span>
                                )}
                              </span>
                            ))}
                          </div>
                        );
                      }
                    })()}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex shrink-0 gap-4 border-t border-[#e5dcd3] pt-5">
              <button
                type="button"
                onClick={() => {
                  onApply(draft);
                  onClose();
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
                  onClose();
                }}
                className="flex-1 cursor-pointer rounded-[6px] border border-[#6a414d] bg-white py-3 font-outfit text-[14px] font-medium text-[#6a414d] transition hover:bg-[#6a414d]/5"
              >
                {t("clear")}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
