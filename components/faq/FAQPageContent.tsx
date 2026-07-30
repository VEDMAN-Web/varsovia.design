"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import CompanyHero from "@/components/company/CompanyHero";
import FadeInView from "@/components/company/FadeInView";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import {
  ACCORDION_EASE,
  FaqAccordionAccent,
  FaqAccordionList,
  FaqToggleIcon,
  FAQ_ANSWER,
  FAQ_DEFAULT_OPEN_INDEX,
  FAQ_TAB_CARD_BASE,
  FAQ_TAB_CARD_CLOSED,
  FAQ_TAB_CARD_OPEN,
} from "@/components/faq/faqAccordionShared";
import { fetchFAQs } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import {
  FAQ_TOPICS,
  resolveFaqsForTopic,
  type FaqTopic,
} from "@/lib/faqData";

/** Figma FAQ Page 4:4144 — column title row */
const FAQ_COLUMN_TITLE =
  "font-outfit text-[clamp(1.0625rem,1.8vw,1.5rem)] font-semibold leading-[1.3] text-[#6a414d] md:leading-[32px]";

/** Figma FAQ hero */
const FAQ_HERO_TITLE =
  "font-display px-2 text-balance break-words text-[clamp(1.625rem,5.5vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:px-1 sm:tracking-[0.1em]";

const FAQ_HERO_SUBTITLE =
  "font-outfit mx-auto mt-2.5 max-w-[34rem] break-words px-4 text-[clamp(0.5625rem,2.6vw,0.8125rem)] font-normal uppercase leading-[1.45] text-[#cf5374] sm:mt-3 sm:max-w-[42rem] sm:leading-[1.55] sm:tracking-[0.16em] md:max-w-[48rem] md:tracking-[0.22em] lg:tracking-[0.28em] xl:tracking-[0.32em]";

/** Figma topic row — flat list, no box borders */
const FAQ_TOPIC_ROW =
  "relative flex min-h-[50px] w-full cursor-pointer items-center justify-between gap-3 bg-transparent px-0 py-2.5 text-left transition-colors duration-300 sm:min-h-[58px] sm:py-0";

const FAQ_TOPIC_LABEL =
  "font-outfit min-w-0 text-[clamp(0.875rem,1.35vw,1.125rem)] font-semibold leading-snug sm:leading-[1.3] md:leading-[28px]";

const FAQ_NESTED_QUESTION =
  "font-outfit min-w-0 text-[0.875rem] font-semibold leading-snug text-[#6a414d] sm:text-[0.9375rem]";

/** Figma topic tab — tapered spindle, thick center, fade at points */
function FaqTopicAccent({ layoutId }: { layoutId: string }) {
  return (
    <motion.span
      layoutId={layoutId}
      className="pointer-events-none absolute left-0 top-1/2 z-[2] h-[66%] w-[3px] -translate-y-1/2"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(207,83,116,0.4) 20%, #cf5374 50%, rgba(207,83,116,0.4) 80%, transparent 100%)",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      aria-hidden
    />
  );
}

type TopicPickerProps = {
  activeTopic: FaqTopic;
  topicLabels: Record<FaqTopic, string>;
  onSelect: (topic: FaqTopic) => void;
};

function TopicSidebar({ activeTopic, topicLabels, onSelect }: TopicPickerProps) {
  return (
    <LayoutGroup id="faq-topics">
      <ul>
        {FAQ_TOPICS.map((topic) => {
          const active = activeTopic === topic;
          return (
            <li key={topic}>
              <button type="button" onClick={() => onSelect(topic)} className={FAQ_TOPIC_ROW}>
                {active ? <FaqTopicAccent layoutId="faq-topic-accent" /> : null}
                <span
                  className={`${FAQ_TOPIC_LABEL} relative z-[1] pl-3 ${
                    active ? "font-semibold text-[#6a414d]" : "font-normal text-[#6a414d]/55"
                  }`}
                >
                  {topicLabels[topic]}
                </span>
                <ChevronRight
                  size={18}
                  strokeWidth={1.75}
                  className={`relative z-[1] shrink-0 transition-colors duration-300 ${
                    active ? "text-[#6a414d]/65" : "text-[#6a414d]/35"
                  }`}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </LayoutGroup>
  );
}

type MobileNestedFaqProps = {
  topicLabels: Record<FaqTopic, string>;
  dbFaqs: Array<{ category?: string; question?: string; answer?: string }>;
};

/** Mobile / tablet — topic › questions › answers nested accordion */
function MobileNestedFaq({ topicLabels, dbFaqs }: MobileNestedFaqProps) {
  const defaultTopic = FAQ_TOPICS[0];
  const [expandedTopic, setExpandedTopic] = useState<FaqTopic | null>(defaultTopic);
  const [openQuestion, setOpenQuestion] = useState<{ topic: FaqTopic; index: number } | null>(
    () => ({ topic: defaultTopic, index: FAQ_DEFAULT_OPEN_INDEX }),
  );

  function toggleTopic(topic: FaqTopic) {
    if (expandedTopic === topic) {
      setExpandedTopic(null);
      setOpenQuestion(null);
      return;
    }
    setExpandedTopic(topic);
    setOpenQuestion({ topic, index: FAQ_DEFAULT_OPEN_INDEX });
  }

  function toggleQuestion(topic: FaqTopic, index: number) {
    setOpenQuestion((prev) =>
      prev?.topic === topic && prev.index === index ? null : { topic, index },
    );
  }

  return (
    <div className="space-y-2">
      {FAQ_TOPICS.map((topic) => {
        const isTopicOpen = expandedTopic === topic;
        const faqs = resolveFaqsForTopic(topic, dbFaqs);

        return (
          <div
            key={topic}
            className={`${FAQ_TAB_CARD_BASE} ${
              isTopicOpen ? FAQ_TAB_CARD_OPEN : FAQ_TAB_CARD_CLOSED
            }`}
          >
            {isTopicOpen ? <FaqTopicAccent layoutId="faq-mobile-topic-accent" /> : null}
            <button
              type="button"
              onClick={() => toggleTopic(topic)}
              aria-expanded={isTopicOpen}
              className="relative z-[1] flex min-h-[50px] w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-3 text-left sm:min-h-[54px] sm:px-4"
            >
              <span
                className={`${FAQ_TOPIC_LABEL} pl-2 ${
                  isTopicOpen ? "font-semibold text-[#6a414d]" : "font-normal text-[#6a414d]/75"
                }`}
              >
                {topicLabels[topic]}
              </span>
              <ChevronDown
                size={18}
                strokeWidth={1.75}
                className={`shrink-0 text-[#6a414d]/50 transition-transform duration-300 ${
                  isTopicOpen ? "rotate-180 text-[#6a414d]/70" : ""
                }`}
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {isTopicOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: ACCORDION_EASE }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 px-3 pb-3 pt-0 sm:px-3.5 sm:pb-3.5">
                    {faqs.map((faq, index) => {
                      const isQuestionOpen =
                        openQuestion?.topic === topic && openQuestion.index === index;

                      return (
                        <div
                          key={faq.question}
                          className={`${FAQ_TAB_CARD_BASE} ${
                            isQuestionOpen ? FAQ_TAB_CARD_OPEN : FAQ_TAB_CARD_CLOSED
                          }`}
                        >
                          {isQuestionOpen ? (
                            <FaqAccordionAccent layoutId="faq-mobile-question-accent" />
                          ) : null}
                          <button
                            type="button"
                            onClick={() => toggleQuestion(topic, index)}
                            aria-expanded={isQuestionOpen}
                            className="relative z-[1] flex w-full cursor-pointer items-start justify-between gap-2.5 px-3 py-2.5 text-left sm:px-3.5 sm:py-3"
                          >
                            <span className={`${FAQ_NESTED_QUESTION} flex-1 pr-1`}>
                              {faq.question}
                            </span>
                            <FaqToggleIcon open={isQuestionOpen} iconSize={12} />
                          </button>

                          <AnimatePresence initial={false}>
                            {isQuestionOpen ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: ACCORDION_EASE }}
                              >
                                <div className="px-3 pb-3 pt-0 sm:px-3.5 sm:pb-3.5">
                                  <div className="mb-2 h-px w-full bg-[#6a414d]/10" />
                                  <p className={FAQ_ANSWER}>{faq.answer}</p>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQPageContent() {
  const locale = useLocale();
  const t = useTranslations("faq");
  const tCommon = useTranslations("common");
  const topicLabels = useMemo(
    (): Record<FaqTopic, string> => ({
      "Kitchen Interior": t("topicKitchen"),
      "Bedroom Interior": t("topicBedroom"),
      "Living Room": t("topicLivingRoom"),
      "Bathroom Interior": t("topicBathroom"),
      "Doors & Windows": t("topicDoorsWindows"),
      Furniture: t("topicFurniture"),
      "Whole Home": t("topicWholeHome"),
    }),
    [t],
  );
  const [activeTopic, setActiveTopic] = useState<FaqTopic>("Kitchen Interior");
  const [openIndex, setOpenIndex] = useState<number>(FAQ_DEFAULT_OPEN_INDEX);
  const [dbFaqs, setDbFaqs] = useState<Array<{ category?: string; question?: string; answer?: string }>>([]);

  useEffect(() => {
    fetchFAQs(locale as Locale).then((data) => {
      if (Array.isArray(data) && data.length > 0) setDbFaqs(data);
    });
  }, [locale]);

  function handleTopicChange(topic: FaqTopic) {
    setActiveTopic(topic);
    setOpenIndex(FAQ_DEFAULT_OPEN_INDEX);
  }

  function toggleQuestion(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  const currentFAQs = resolveFaqsForTopic(activeTopic, dbFaqs);

  return (
    <div className={COMPANY_PAGE_BG}>
      <CompanyHero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        subtitleSentenceCase={false}
        titleClassName={FAQ_HERO_TITLE}
        subtitleClassName={FAQ_HERO_SUBTITLE}
        sectionClassName="pb-4 pt-6 sm:pb-6 sm:pt-8 md:pb-8 md:pt-12"
        fadeClassName="mb-4 sm:mb-6 md:mb-8"
        compact
      />

      <section className={`${COMPANY_SHELL} mt-6 pb-12 sm:mt-8 sm:pb-16 md:mt-10 md:pb-20 lg:mt-12`}>
        {/* Mobile / tablet — nested topic › question › answer */}
        <FadeInView className="lg:hidden">
          <h2 className={`${FAQ_COLUMN_TITLE} mb-3`}>{tCommon("questionsAndAnswers")}</h2>
          <MobileNestedFaq topicLabels={topicLabels} dbFaqs={dbFaqs} />
        </FadeInView>

        {/* Desktop — two-column Figma layout */}
        <div className="hidden lg:block">
          <FadeInView>
            <div className="mb-3 grid grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:gap-10">
              <h2 className={FAQ_COLUMN_TITLE}>{tCommon("topic")}</h2>
              <h2 className={FAQ_COLUMN_TITLE}>{tCommon("questionsAndAnswers")}</h2>
            </div>
          </FadeInView>

          <div className="grid grid-cols-[minmax(0,280px)_minmax(0,1fr)] items-start gap-8 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:gap-10">
            <FadeInView>
              <TopicSidebar
                activeTopic={activeTopic}
                topicLabels={topicLabels}
                onSelect={handleTopicChange}
              />
            </FadeInView>

            <div className="min-w-0">
              <FaqAccordionList
                faqs={currentFAQs}
                listKey={activeTopic}
                openIndex={openIndex}
                onToggle={toggleQuestion}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
