"use client";

import { useEffect, useState } from "react";
import { ChevronDown, CirclePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyHero from "@/components/company/CompanyHero";
import FadeInView from "@/components/company/FadeInView";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { fetchFAQs } from "@/lib/api";
import {
  FAQ_TOPICS,
  resolveFaqsForTopic,
  type FaqTopic,
} from "@/lib/faqData";

/** Figma FAQ Page 4:4144 — column title row */
const FAQ_COLUMN_TITLE =
  "font-outfit text-[clamp(1.375rem,2.2vw,1.75rem)] font-semibold leading-[39px] text-[#6a414d]";

/** Figma topic row — 372×75 */
const FAQ_TOPIC_ROW =
  "flex h-[75px] w-full cursor-pointer items-center justify-between bg-[#F6EAEA] px-5 text-left transition hover:bg-[#F4EBEC]";

const FAQ_TOPIC_LABEL =
  "font-outfit text-[clamp(1rem,1.6vw,1.375rem)] font-semibold leading-[35px] text-[#6a414d]";

/** Figma accordion question — 818×75 collapsed */
const FAQ_QUESTION =
  "font-outfit text-[clamp(1rem,1.6vw,1.375rem)] font-semibold leading-[35px] text-[#6a414d]";

const FAQ_ANSWER = "font-outfit text-[clamp(0.875rem,1.4vw,1rem)] font-normal leading-7 text-[#6a414d]/85";

export default function FAQPageContent() {
  const [activeTopic, setActiveTopic] = useState<FaqTopic>("Kitchen Interior");
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [dbFaqs, setDbFaqs] = useState<Array<{ category?: string; question?: string; answer?: string }>>([]);

  useEffect(() => {
    fetchFAQs().then((data) => {
      if (Array.isArray(data) && data.length > 0) setDbFaqs(data);
    });
  }, []);

  function handleTopicChange(topic: FaqTopic) {
    setActiveTopic(topic);
    setOpenIndex(0);
  }

  function toggleQuestion(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  const currentFAQs = resolveFaqsForTopic(activeTopic, dbFaqs);

  return (
    <div className={COMPANY_PAGE_BG}>
      <CompanyHero
        title="FAQ"
        subtitle="Clear answers to help you make informed design decisions"
        subtitleSentenceCase={false}
      />

      <section className={`${COMPANY_SHELL} mt-16 pb-20 md:mt-20 md:pb-28`}>
        {/* Figma 4:4358 — Topic | Questions & Answer header row */}
        <FadeInView>
          <div className="mb-5 grid grid-cols-1 gap-6 lg:mb-5 lg:grid-cols-[minmax(0,372px)_minmax(0,1fr)] lg:gap-[50px]">
            <h2 className={FAQ_COLUMN_TITLE}>Topic</h2>
            <h2 className={FAQ_COLUMN_TITLE}>Questions &amp; Answer</h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,372px)_minmax(0,1fr)] lg:gap-[50px]">
          {/* Figma 4:4269 — topic sidebar */}
          <FadeInView>
            <ul className="space-y-3">
              {FAQ_TOPICS.map((topic) => {
                const active = activeTopic === topic;
                return (
                  <li key={topic}>
                    <button
                      type="button"
                      onClick={() => handleTopicChange(topic)}
                      className={`${FAQ_TOPIC_ROW} ${active ? "ring-1 ring-[#6a414d]/15" : ""}`}
                    >
                      <span className={`${FAQ_TOPIC_LABEL} ${active ? "text-[#6a414d]" : "text-[#6a414d]/80"}`}>
                        {topic}
                      </span>
                      <ChevronDown
                        size={24}
                        className={`-rotate-90 shrink-0 text-[#6a414d]/45 transition ${active ? "text-[#6a414d]" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </FadeInView>

          {/* Figma 4:4315 — accordion list */}
          <div className="space-y-5">
            {currentFAQs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <FadeInView key={`${activeTopic}-${faq.question}`} delay={index * 0.04}>
                  <div className="overflow-hidden bg-[#F6EAEA]">
                    <button
                      type="button"
                      onClick={() => toggleQuestion(index)}
                      className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#F4EBEC]/50"
                    >
                      <span className={`${FAQ_QUESTION} flex-1 pr-2`}>{faq.question}</span>
                      <CirclePlus
                        size={28}
                        strokeWidth={1.5}
                        className={`mt-0.5 shrink-0 text-[#6a414d]/70 transition ${isOpen ? "rotate-45" : ""}`}
                        aria-hidden
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-5 pb-5">
                            <div className="mr-12 max-w-[720px] border-t border-[#6a414d]/12 pt-3">
                              <p className={FAQ_ANSWER}>{faq.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
