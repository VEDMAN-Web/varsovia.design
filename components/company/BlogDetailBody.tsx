"use client";

import { motion } from "framer-motion";
import type { BlogSection } from "@/lib/companyData";

const BODY =
  "font-outfit text-[15px] font-normal leading-[1.75] text-[#6a414d]/88 sm:text-[16px] sm:leading-[1.8]";

const BODY_CENTER = `${BODY} mx-auto max-w-[720px] text-center`;

const CAPTION =
  "mt-4 text-center font-outfit text-[clamp(1rem,1.8vw,1.125rem)] font-semibold leading-snug text-[#1f1f1f]";

function RichParagraph({ text, className }: { text: string; className: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx} className="font-semibold text-[#1f1f1f]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part ? <span key={idx}>{part}</span> : null;
      })}
    </p>
  );
}

function SplitImageColumn({
  src,
  alt,
  aspectClass,
}: {
  src: string;
  alt: string;
  aspectClass: string;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] sm:rounded-[18px] md:rounded-[24px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`w-full object-cover ${aspectClass}`} />
    </div>
  );
}

function SplitCaption({ caption, imageOnLeft }: { caption: string; imageOnLeft: boolean }) {
  return (
    <p
      className={`${CAPTION} !mt-3 md:!mt-4 ${
        imageOnLeft
          ? "md:max-w-[calc(50%-1.25rem)]"
          : "md:ml-auto md:max-w-[calc(50%-1.25rem)]"
      }`}
    >
      {caption}
    </p>
  );
}

function ImageBlock({
  src,
  alt,
  caption,
  aspectClass,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspectClass: string;
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-[12px] sm:rounded-[16px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={`w-full object-cover ${aspectClass}`} />
      </div>
      {caption ? <figcaption className={CAPTION}>{caption}</figcaption> : null}
    </figure>
  );
}

type BlogDetailBodyProps = {
  sections: BlogSection[];
};

export default function BlogDetailBody({ sections }: BlogDetailBodyProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      {sections.map((section, i) => {
        if (section.type === "paragraph" && section.text) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <RichParagraph text={section.text} className={BODY} />
            </motion.div>
          );
        }

        if (section.type === "paragraph-center" && section.text) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <RichParagraph text={section.text} className={BODY_CENTER} />
            </motion.div>
          );
        }

        if (section.type === "subheading" && section.text) {
          return (
            <motion.h2
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pt-1 text-left font-outfit text-[clamp(1.125rem,2.2vw,1.375rem)] font-semibold leading-snug text-[#1f1f1f] md:pt-2"
            >
              {section.text}
            </motion.h2>
          );
        }

        if (section.type === "image" && section.image) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ImageBlock
                src={section.image}
                alt={section.imageAlt || "Blog illustration"}
                caption={section.caption}
                aspectClass="aspect-[16/10] sm:aspect-[2/1]"
              />
            </motion.div>
          );
        }

        if ((section.type === "split-left" || section.type === "split-right") && section.image) {
          const imageOnLeft = section.type === "split-left";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="space-y-0"
            >
              <div className="grid items-center gap-6 md:grid-cols-2 md:gap-x-10 md:gap-y-0 lg:gap-x-12">
                <div className={imageOnLeft ? "md:order-1" : "md:order-2"}>
                  <SplitImageColumn
                    src={section.image}
                    alt={section.imageAlt || "Blog detail"}
                    aspectClass="aspect-[4/5] md:aspect-[3/4]"
                  />
                </div>
                <div className={`flex items-center ${imageOnLeft ? "md:order-2" : "md:order-1"}`}>
                  <div className="w-full">
                    {section.text ? <RichParagraph text={section.text} className={BODY} /> : null}
                  </div>
                </div>
              </div>
              {section.caption ? (
                <SplitCaption caption={section.caption} imageOnLeft={imageOnLeft} />
              ) : null}
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}
