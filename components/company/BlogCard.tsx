"use client";

import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/companyData";

type BlogCardProps = {
  blog: BlogPost;
  index?: number;
};

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const t = useTranslations("blogListing");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full min-w-0"
    >
      <Link
        href={`/blog/${blog._id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-transparent bg-[#f6eaea] shadow-[0_4px_20px_rgba(107,44,58,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:border-[#cf5374]/45 hover:shadow-[0_8px_28px_rgba(207,83,116,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf5374] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3f2] sm:rounded-[16px]"
      >
        <div className="relative aspect-[440/280] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-[440/280]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-outfit text-[11px] font-medium text-white backdrop-blur-[2px] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[12px]">
              <Calendar size={12} className="shrink-0 opacity-90" aria-hidden />
              {blog.date}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-outfit text-[11px] font-medium text-white backdrop-blur-[2px] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[12px]">
              <Clock size={12} className="shrink-0 opacity-90" aria-hidden />
              {blog.readTime}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
          <h3 className="font-outfit text-[clamp(0.9375rem,1.35vw,1.125rem)] font-semibold leading-snug text-[#1f1f1f] transition-colors duration-300 group-hover:text-[#6a414d] sm:leading-[1.35]">
            {blog.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 font-outfit text-[13px] font-normal leading-relaxed text-[#6a414d]/75 sm:mt-3 sm:text-[14px] sm:leading-6">
            {blog.excerpt}{" "}
            <span className="font-semibold text-[#1f1f1f]">{t("readMore")}</span>
          </p>

          <div className="mt-auto border-t border-[#e5dcd3]/70 pt-4 sm:pt-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#6a414d]/10 bg-white sm:h-10 sm:w-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.author.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-outfit text-[13px] font-medium text-[#1f1f1f] sm:text-[14px]">
                {blog.author.name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
