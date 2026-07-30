"use client";

import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export const FAQ_QUESTION =
  "font-outfit min-w-0 text-[clamp(0.875rem,1.35vw,1.125rem)] font-semibold leading-snug text-[#6a414d] sm:leading-[1.3] md:leading-[28px]";

export const FAQ_ANSWER =
  "font-outfit text-[clamp(0.8125rem,1.25vw,0.9375rem)] font-normal leading-[1.6] text-[#6a414d]/85 sm:leading-6";

export const ACCORDION_EASE = [0.22, 1, 0.36, 1] as const;

/** Figma FAQ tab — rounded card, hairline border, soft lift */
export const FAQ_TAB_CARD_BASE =
  "relative overflow-hidden rounded-[8px] border border-[#6a414d]/[0.08] shadow-[0_2px_10px_rgba(106,65,77,0.06)] transition-[background-color,border-color,box-shadow] duration-300";

export const FAQ_TAB_CARD_OPEN = "bg-[#F4EBEC] border-[#6a414d]/[0.11] shadow-[0_3px_14px_rgba(106,65,77,0.07)]";

export const FAQ_TAB_CARD_CLOSED = "bg-[#F6EAEA]";

export function FaqAccordionAccent({ layoutId }: { layoutId: string }) {
  return (
    <motion.span
      layoutId={layoutId}
      className="pointer-events-none absolute bottom-0 left-0 top-0 z-[2] w-[3px] bg-[#cf5374]"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      aria-hidden
    />
  );
}

export function FaqToggleIcon({
  open,
  className = "",
  iconSize = 14,
}: {
  open: boolean;
  className?: string;
  iconSize?: number;
}) {
  return (
    <motion.span
      aria-hidden
      className={`mt-0.5 flex shrink-0 items-center justify-center text-[#6a414d] sm:mt-0 ${className}`.trim()}
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.28, ease: ACCORDION_EASE }}
    >
      {open ? (
        <Minus size={iconSize} strokeWidth={2.25} />
      ) : (
        <Plus size={iconSize} strokeWidth={2.25} />
      )}
    </motion.span>
  );
}

export type FaqAccordionItem = { question: string; answer: string };

/** First item open by default across FAQ accordions */
export const FAQ_DEFAULT_OPEN_INDEX = 0;

type FaqAccordionListProps = {
  faqs: FaqAccordionItem[];
  listKey: string;
  openIndex: number;
  onToggle: (index: number) => void;
  accentLayoutId?: string;
  className?: string;
  /** Wider horizontal padding inside each card (Quality After Sales / Figma) */
  inset?: boolean;
};

export function FaqAccordionList({
  faqs,
  listKey,
  openIndex,
  onToggle,
  accentLayoutId = "faq-accordion-accent",
  className = "space-y-2 sm:space-y-2.5",
  inset = false,
}: FaqAccordionListProps) {
  const rowPad = inset
    ? "px-3.5 py-3 sm:min-h-[58px] sm:items-center sm:px-5 md:px-6 sm:py-0"
    : "px-3.5 py-3 sm:min-h-[58px] sm:items-center sm:px-4 sm:py-0";
  const bodyPad = inset ? "px-3.5 pb-3.5 sm:px-5 md:px-6 sm:pb-4" : "px-3.5 pb-3.5 sm:px-4 sm:pb-4";
  const bodyInnerMr = inset ? "mr-5 sm:mr-8" : "mr-7 sm:mr-10";

  return (
    <LayoutGroup id={`faq-accordion-${listKey}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={listKey}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: ACCORDION_EASE }}
          className={className}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.04, ease: ACCORDION_EASE }}
                className={`${FAQ_TAB_CARD_BASE} ${
                  isOpen ? FAQ_TAB_CARD_OPEN : FAQ_TAB_CARD_CLOSED
                }`}
              >
                {isOpen ? <FaqAccordionAccent layoutId={accentLayoutId} /> : null}
                <button
                  type="button"
                  onClick={() => onToggle(index)}
                  aria-expanded={isOpen}
                  className={`relative z-[1] flex min-h-[50px] w-full cursor-pointer items-start justify-between gap-3 text-left transition-colors duration-300 ${rowPad} ${
                    isOpen ? "" : "hover:bg-[#F4EBEC]/50"
                  }`}
                >
                  <span className={`${FAQ_QUESTION} flex-1 pr-1`}>{faq.question}</span>
                  <FaqToggleIcon open={isOpen} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: ACCORDION_EASE }}
                    >
                      <div className={bodyPad}>
                        <div className={`max-w-[720px] pt-0.5 ${bodyInnerMr}`}>
                          <div className="mb-2 h-px w-full bg-[#6a414d]/10" />
                          <p className={FAQ_ANSWER}>{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
