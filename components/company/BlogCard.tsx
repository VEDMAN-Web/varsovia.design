"use client";

import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { cardHoverProps, COMPANY_CARD, SECTION_BODY_CLASS } from "@/components/company/companyLayoutShared";
import { SUBSECTION_TITLE_CLASS } from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/lib/companyData";

type BlogCardProps = {
  blog: BlogPost;
  index?: number;
};

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <motion.div {...cardHoverProps}>
        <Link
          href={`/blog/${blog._id}`}
          className={`group relative flex flex-col justify-between overflow-hidden rounded-[14px] ${COMPANY_CARD} cursor-pointer transition-shadow duration-300`}
        >
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </div>

            <div className="p-5 pb-3">
              <h3 className={`${SUBSECTION_TITLE_CLASS} text-base transition duration-300 group-hover:text-[#cf5374]`}>
                {blog.title}
              </h3>
              <p className={`mt-2 line-clamp-3 ${SECTION_BODY_CLASS} leading-relaxed`}>{blog.excerpt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#e5dcd3]/40 p-4">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-[#6a414d]/10 bg-white">
              <img src={blog.author.avatar} alt={blog.author.name} className="h-full w-full object-cover" />
            </div>
            <span className={`${SECTION_BODY_CLASS} text-xs font-medium`}>{blog.author.name}</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
