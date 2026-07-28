import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BlogCard from "@/components/company/BlogCard";
import BlogDetailBody from "@/components/company/BlogDetailBody";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { SECTION_BODY_CLASS, PAGE_ARTICLE_TITLE_CLASS, SUBSECTION_TITLE_CLASS } from "@/components/ui/SectionHeading";
import { fetchBlogById, fetchBlogs } from "@/lib/api";
import {
  blogStaticParams,
  getBlogById,
  getRelatedBlogs,
  resolveBlogs,
} from "@/lib/companyData";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return blogStaticParams();
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const apiBlog = await fetchBlogById(id);
  const blog = getBlogById(id, apiBlog);
  if (!blog) notFound();

  const allBlogs = resolveBlogs(await fetchBlogs());
  const related = getRelatedBlogs(blog._id, allBlogs, 3);

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <section className="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[60vh]">
          <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f7f3f2]" />
        </section>

        <div className={`${COMPANY_SHELL} py-10 md:py-16`}>
          <article className="mb-10 md:mb-14">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-[#6a414d]/10 bg-white">
                <img src={blog.author.avatar} alt={blog.author.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className={`${SECTION_BODY_CLASS} text-sm font-medium`}>{blog.author.name}</h4>
                <p className={`mt-0.5 ${SECTION_BODY_CLASS} text-xs opacity-70`}>{blog.date}</p>
              </div>
            </div>

            <h1 className={`mb-10 ${PAGE_ARTICLE_TITLE_CLASS}`}>{blog.title}</h1>

            <BlogDetailBody sections={blog.sections} />
          </article>

          {related.length > 0 && (
            <section className="border-t border-[#e5dcd3] pt-16">
              <h2 className={`mb-8 ${SUBSECTION_TITLE_CLASS}`}>Discover More Blog</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {related.map((item, i) => (
                  <BlogCard key={item._id} blog={item} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
