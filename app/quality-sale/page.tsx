"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Wind, Leaf, ShieldAlert, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// FAQ Items
const FAQ_ITEMS = [
  {
    question: "Is my project covered under warranty?",
    answer: "Yes, we provide warranty coverage on our products and workmanship. Please check the contract details for specific items.",
  },
  {
    question: "How can I request after-sales support?",
    answer: "You can reach out through our contact page, email us directly, or call our customer care number. Our support team will guide you through the process.",
  },
  {
    question: "Do you provide maintenance services?",
    answer: "Yes, we offer scheduled maintenance and check-ups to keep your modular cabinetry and kitchen elements in top shape.",
  },
  {
    question: "What happens if my warranty period has expired?",
    answer: "We still provide full support! Post-warranty services are charged nominally based on the material replacement and technician visit charges.",
  },
];

export default function QualityAfterSalesPage() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Open first item by default

  function toggleFAQ(index: number) {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen">
        {/* 1. Header Banner */}
        <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
          <div className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50 mb-8 md:mb-12">
            <h1 className="font-display text-[clamp(2.0rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              Quality After Sales
            </h1>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              Committed to your satisfaction beyond project completion
            </p>
            <p className="mx-auto mt-8 max-w-4xl text-sm md:text-base leading-8 text-[#5c3d46]/80 font-medium px-4 md:px-6">
              We believe our service in interior design is stand by the normal and luxurious after project completion, offering reliable after-sales support, maintenance guidance, and prompt assistance to keep your interiors looking and performing at their best for years to come.
            </p>
          </div>
        </section>

        {/* 2. Feature Cards Staggered Grid */}
        <section className="mx-auto max-w-[1240px] px-6 mb-20 md:mb-28">
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto align-start">
            {/* Column 1 */}
            <div className="space-y-8">
              {/* Card 01 */}
              <div className="rounded-[16px] bg-[#F6EAEA] p-8 border border-[#e5dcd3]/30 shadow-[0_4px_25px_rgba(107,44,58,0.015)] relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 max-w-[80%]">
                    <div className="h-12 w-12 rounded-full bg-[#dfc2c6] text-[#5c3d42] flex items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-[#5c3d42] leading-snug">
                      95.8% efficiency of Formaldehyde Purification
                    </span>
                  </div>
                  <span className="text-6xl font-bold text-[#5c3d42]/10 select-none">01</span>
                </div>
                {/* Embedded Kitchen Image */}
                <div className="mt-8 rounded-[12px] overflow-hidden aspect-[4/3] border border-[#e5dcd3]/20 shadow-inner">
                  <img
                    src="/quality-sale/quality-sale.png"
                    alt="Kitchen Interior Purification"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Card 02 */}
              <div className="rounded-[16px] bg-[#F6EAEA] p-8 border border-[#e5dcd3]/30 shadow-[0_4px_25px_rgba(107,44,58,0.015)] relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 max-w-[80%]">
                    <div className="h-12 w-12 rounded-full bg-[#dfc2c6] text-[#5c3d42] flex items-center justify-center shrink-0">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-[#5c3d42] leading-snug">
                      E0/F4 Star level certified of Formaldehyde Leveling
                    </span>
                  </div>
                  <span className="text-6xl font-bold text-[#5c3d42]/10 select-none">02</span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-8 md:mt-12">
              {/* Card 03 */}
              <div className="rounded-[16px] bg-[#F6EAEA] p-8 border border-[#e5dcd3]/30 shadow-[0_4px_25px_rgba(107,44,58,0.015)] relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 max-w-[80%]">
                    <div className="h-12 w-12 rounded-full bg-[#dfc2c6] text-[#5c3d42] flex items-center justify-center shrink-0">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-[#5c3d42] leading-snug">
                      Long-Lasting Mold Resistance Level 0
                    </span>
                  </div>
                  <span className="text-6xl font-bold text-[#5c3d42]/10 select-none">03</span>
                </div>
                {/* Embedded Kitchen Image */}
                <div className="mt-8 rounded-[12px] overflow-hidden aspect-[4/3] border border-[#e5dcd3]/20 shadow-inner">
                  <img
                    src="/quality-sale/quality-sale.png"
                    alt="Kitchen Interior Mold Resistance"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Card 04 */}
              <div className="rounded-[16px] bg-[#F6EAEA] p-8 border border-[#e5dcd3]/30 shadow-[0_4px_25px_rgba(107,44,58,0.015)] relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 max-w-[80%]">
                    <div className="h-12 w-12 rounded-full bg-[#dfc2c6] text-[#5c3d42] flex items-center justify-center shrink-0">
                      <Wind className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-[#5c3d42] leading-snug">
                      24-Hour Continuous Air Purification
                    </span>
                  </div>
                  <span className="text-6xl font-bold text-[#5c3d42]/10 select-none">04</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Support Process Timeline */}
        <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16 mb-20 md:mb-28">
          <div className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50 mb-12">
            <h2 className="font-display text-[clamp(2.0rem,5vw,2.8rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              Support Process
            </h2>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              How it's work
            </p>
          </div>

          <div className="mx-auto max-w-4xl px-6 relative mt-16">
            {/* Center Timeline Line */}
            <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-0.5 bg-[#5c3d42]/30 -translate-x-1/2 z-0" />

            <div className="space-y-16 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
                <div className="w-full md:w-[42%] flex justify-start md:justify-end pl-14 md:pl-0">
                  <div className="w-48 aspect-square flex items-center justify-center bg-[#F6EAEA] rounded-[16px] border border-[#e5dcd3]/30 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
                    <img
                      src="/quality-sale/Illustration.png"
                      alt="Step 01 - Contact Us"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute left-[30px] md:left-1/2 h-6 w-6 rounded-full bg-[#5c3d42] border-4 border-[#f7f3f2] -translate-x-1/2" />

                <div className="w-full md:w-[42%] pl-14 md:pl-8 text-left">
                  <span className="text-xs font-bold text-[#e85d8a] uppercase tracking-widest leading-none">
                    Step 01
                  </span>
                  <h4 className="text-lg font-bold text-[#5c3d42] mt-1.5 leading-snug">
                    Contact Us
                  </h4>
                  <p className="text-sm text-[#5c3d42]/70 mt-2 font-medium leading-relaxed">
                    Share your service requests with our support team.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-8 md:gap-0">
                <div className="w-full md:w-[42%] flex justify-start pl-14 md:pl-8">
                  <div className="w-48 aspect-square flex items-center justify-center bg-[#F6EAEA] rounded-[16px] border border-[#e5dcd3]/30 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
                    <img
                      src="/quality-sale/Illustration (1).png"
                      alt="Step 02 - Issue Assessment"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute left-[30px] md:left-1/2 h-6 w-6 rounded-full bg-[#5c3d42] border-4 border-[#f7f3f2] -translate-x-1/2" />

                <div className="w-full md:w-[42%] pl-14 md:pl-0 text-left md:text-right pr-0 md:pr-8">
                  <span className="text-xs font-bold text-[#e85d8a] uppercase tracking-widest leading-none">
                    Step 02
                  </span>
                  <h4 className="text-lg font-bold text-[#5c3d42] mt-1.5 leading-snug">
                    Issue Assessment
                  </h4>
                  <p className="text-sm text-[#5c3d42]/70 mt-2 font-medium leading-relaxed">
                    Our team reviews your request and identifies the best solution.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
                <div className="w-full md:w-[42%] flex justify-start md:justify-end pl-14 md:pl-0">
                  <div className="w-48 aspect-square flex items-center justify-center bg-[#F6EAEA] rounded-[16px] border border-[#e5dcd3]/30 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
                    <img
                      src="/quality-sale/Illustration (2).png"
                      alt="Step 03 - Service Scheduling"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute left-[30px] md:left-1/2 h-6 w-6 rounded-full bg-[#5c3d42] border-4 border-[#f7f3f2] -translate-x-1/2" />

                <div className="w-full md:w-[42%] pl-14 md:pl-8 text-left">
                  <span className="text-xs font-bold text-[#e85d8a] uppercase tracking-widest leading-none">
                    Step 03
                  </span>
                  <h4 className="text-lg font-bold text-[#5c3d42] mt-1.5 leading-snug">
                    Service Scheduling
                  </h4>
                  <p className="text-sm text-[#5c3d42]/70 mt-2 font-medium leading-relaxed">
                    A service visit is arranged at your convenience.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-8 md:gap-0">
                <div className="w-full md:w-[42%] flex justify-start pl-14 md:pl-8">
                  <div className="w-48 aspect-square flex items-center justify-center bg-[#F6EAEA] rounded-[16px] border border-[#e5dcd3]/30 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
                    <img
                      src="/quality-sale/9ca1c87c-faa9-489e-842b-b578389ef660 1.png"
                      alt="Step 04 - Resolution"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute left-[30px] md:left-1/2 h-6 w-6 rounded-full bg-[#5c3d42] border-4 border-[#f7f3f2] -translate-x-1/2" />

                <div className="w-full md:w-[42%] pl-14 md:pl-0 text-left md:text-right pr-0 md:pr-8">
                  <span className="text-xs font-bold text-[#e85d8a] uppercase tracking-widest leading-none">
                    Step 04
                  </span>
                  <h4 className="text-lg font-bold text-[#5c3d42] mt-1.5 leading-snug">
                    Resolution
                  </h4>
                  <p className="text-sm text-[#5c3d42]/70 mt-2 font-medium leading-relaxed">
                    Our experts complete the required service efficiently and professionally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FAQ Section */}
        <section className="mx-auto max-w-[1240px] px-6">
          <div className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50 mb-12">
            <h2 className="font-display text-[clamp(2.0rem,5vw,2.8rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              FAQ
            </h2>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              Questions & Answer
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndexes.includes(index);
              return (
                <div
                  key={index}
                  className="rounded-[12px] bg-[#F6EAEA] border border-[#e5dcd3]/30 overflow-hidden shadow-[0_4px_15px_rgba(107,44,58,0.01)]"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left text-[#5c3d42] hover:text-[#5c3d42]/90 cursor-pointer"
                  >
                    <span className="text-[0.95rem] font-bold tracking-wide">
                      {item.question}
                    </span>
                    <span className="h-6 w-6 rounded-full bg-[#dfc2c6] text-[#5c3d42] flex items-center justify-center shrink-0">
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-[#e5dcd3]/20 text-sm leading-7 text-[#5c3d42]/75 font-medium">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
