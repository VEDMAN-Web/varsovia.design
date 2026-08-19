"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import Navbar from "@/components/layout/Navbar";
import BlogCard from "@/components/company/BlogCard";
import BlogDetailBody from "@/components/company/BlogDetailBody";
import BlogShareButton from "@/components/company/BlogShareButton";
import ImageHeroBand from "@/components/ui/ImageHeroBand";
import PagePanelReveal from "@/components/ui/PagePanelReveal";
import {
  BLOG_DETAIL_CARD_BG,
  BLOG_DETAIL_CARD_PAD,
  BLOG_DETAIL_CARD_ROUNDED,
  BLOG_DETAIL_CARD_SHADOW,
  BLOG_DETAIL_COLUMN,
  BLOG_DETAIL_HERO_HEIGHT,
  BLOG_DETAIL_OVERLAP,
  BLOG_DETAIL_PAGE_BG,
} from "@/components/company/blogDetailLayoutShared";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { formatBlogDetailMeta } from "@/lib/blogFormat";
import type { BlogPost } from "@/lib/companyData";
import type { IaArticleCta, IaArticleOffer } from "@/lib/iaPages";
import BlogDetailFooterCtas from "@/components/company/BlogDetailFooterCtas";

const BLOG_GRID =
  "grid w-full min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-[clamp(1.25rem,3vw,2rem)] sm:gap-y-10 lg:grid-cols-3 lg:gap-x-[clamp(1.5rem,4vw,2.5rem)] lg:gap-y-12";

type Props = {
  blog: BlogPost;
  related: BlogPost[];
  articleContact?: IaArticleCta;
  articleOffer?: IaArticleOffer;
};

/**
 * Figma blog detail structure:
 * 1. Full-width sharp hero (no title on image)
 * 2. Center overlap card (~88%): author + share → H1 → body sections
 * 3. Related grid in site shell
 */
export default function BlogDetailView({
  blog,
  related,
  articleContact,
  articleOffer,
}: Props) {
  const t = useTranslations("blogListing");

  return (
    <>
      <Navbar overlayHero />
      <main
        className="min-h-screen pb-16 md:pb-24"
        style={{ backgroundColor: BLOG_DETAIL_PAGE_BG }}
      >
        <ImageHeroBand
          image={blog.image}
          alt=""
          navBackdrop={false}
          sectionClassName={`relative w-full overflow-hidden ${BLOG_DETAIL_HERO_HEIGHT}`}
          overlayClassName="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 from-0% via-black/5 via-[45%] to-transparent to-[72%]"
        />

        {/* —— 2. Overlap card + article —— */}
        <div className={`${COMPANY_SHELL} relative z-10 ${BLOG_DETAIL_OVERLAP}`}>
          <div className={BLOG_DETAIL_COLUMN}>
            <PagePanelReveal trigger="mount" delay={0.1}>
            <article
              className={`overflow-hidden ${BLOG_DETAIL_CARD_ROUNDED} ${BLOG_DETAIL_CARD_SHADOW}`}
              style={{ backgroundColor: BLOG_DETAIL_CARD_BG }}
            >
              <div className={`${BLOG_DETAIL_CARD_PAD} !pb-4 sm:!pb-5`}>
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 font-outfit text-[14px] font-medium text-[#6a414d] transition-colors hover:text-[#1f1f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a414d]/40 focus-visible:ring-offset-2"
                >
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden />
                  {t("backToBlog")}
                </Link>
              </div>

              <div
                className={`flex items-start justify-between gap-4 border-b border-[#e5dcd3]/40 px-5 pb-6 sm:px-8 sm:pb-7 md:px-11 md:pb-8 lg:px-14`}
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#6a414d]/10 bg-white sm:h-[46px] sm:w-[46px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.author.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-outfit text-[15px] font-semibold text-[#1f1f1f] sm:text-[16px]">
                      {blog.author.name}
                    </p>
                    <p className="mt-0.5 font-outfit text-[13px] font-normal text-[#6a414d]/75 sm:text-[14px]">
                      {formatBlogDetailMeta(blog.date)}
                    </p>
                  </div>
                </div>
                <BlogShareButton title={blog.title} />
              </div>

              <div className={`${BLOG_DETAIL_CARD_PAD} !pt-6 sm:!pt-7 md:!pt-8`}>
                <h1 className="mb-7 font-outfit text-[clamp(1.375rem,3.2vw,2.125rem)] font-semibold leading-[1.28] tracking-[-0.02em] text-[#1f1f1f] md:mb-9 md:leading-[1.26] lg:text-[2.125rem]">
                  {blog.title}
                </h1>
                <BlogDetailBody sections={blog.sections} />
              </div>
            </article>
            </PagePanelReveal>
          </div>

          {related.length > 0 && (
            <section className="mt-14 border-t border-[#e5dcd3]/80 pt-12 md:mt-20 md:pt-16">
              <h2 className="mb-8 font-outfit text-[clamp(1.125rem,2vw,1.5rem)] font-semibold text-[#1f1f1f] md:mb-10">
                {t("discoverMore")}
              </h2>
              <div className={BLOG_GRID}>
                {related.map((item, i) => (
                  <BlogCard key={item._id} blog={item} index={i} />
                ))}
              </div>
            </section>
          )}

          <BlogDetailFooterCtas contact={articleContact} offer={articleOffer} />
        </div>
      </main>
    </>
  );
}
