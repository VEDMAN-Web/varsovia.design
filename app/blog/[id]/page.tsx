import { notFound } from "next/navigation";
import Link from "next/link";
import { Share2, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate static params for 6 mock blogs
export function generateStaticParams() {
  return Array.from({ length: 6 }, (_, i) => ({ id: String(i + 1) }));
}

const RELATED_BLOGS = Array.from({ length: 3 }, (_, i) => ({
  id: String(i + 2),
  title: "Top Trends Transforming Modern Interior Design Showrooms in 2026",
  excerpt: "For entrepreneurs, dealers, and showroom investors looking to transform modern showrooms, keeping up with design updates is essential for...",
  date: "12 Jun 2026",
  readTime: "4 min",
  author: {
    name: "Courtney Henry",
    avatar: "/team/team.png",
  },
  image: "/blog/blog1.png",
}));

import { fetchBlogById } from "@/lib/api";

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const dbBlog = await fetchBlogById(id);

  const fallbackBlog = {
    title: "10 Interior Design Trends That Will Transform Your Home in 2026",
    excerpt: "For entrepreneurs, dealers, and showroom investors looking to transform modern showrooms...",
    content: "Interior design continues to evolve...",
    date: "12 Jun 2026",
    readTime: "4 min",
    author: {
      name: "Courtney Henry",
      avatar: "/team/team.png",
    },
    image: "/Interior-kitchen/kitchen1.png",
    views: 31,
  };

  const blog = dbBlog || fallbackBlog;

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen">
        {/* 1. Full-bleed Hero Image Banner */}
        <section className="relative w-full h-[50vh] min-h-[340px] md:h-[60vh] overflow-hidden">
          <img
            src={blog.image}
            alt="Blog Hero Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10" />
        </section>

        <div className="container-1240 py-10 md:py-16">
          {/* 2. Floating Author Box */}
          <div className="flex items-center justify-between bg-[#F6EAEA] rounded-[12px] p-5 shadow-[0_4px_20px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/30 max-w-[800px] mb-8 select-none">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-[#5c3d42]/10 bg-white">
                <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#5c3d42]">{blog.author.name}</h4>
                <p className="text-[0.68rem] font-semibold text-[#5c3d42]/60 mt-0.5">
                  {blog.date} &middot; {blog.views} views
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/40 text-[#5c3d42] transition hover:bg-white cursor-pointer"
              title="Share post"
            >
              <Share2 size={15} />
            </button>
          </div>

          {/* 3. Title & Content */}
          <article className="max-w-[1000px] mb-16 md:mb-24">
            <h1 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold text-[#5c3d42] tracking-wide leading-tight">
              10 Interior Design Trends That Will Transform Your Home in 2026
            </h1>

            <p className="mt-6 text-sm md:text-[0.98rem] text-[#5c3d42]/80 leading-relaxed font-medium">
              Interior design continues to evolve with changing lifestyles and modern living needs. In 2026, homeowners are embracing spaces that are elegant, functional, and personalized. Whether you&apos;re renovating a single room or designing your dream home, these trends will help you create interiors that are timeless and inspiring.
            </p>

            {/* Panoramic green kitchen image */}
            <div className="w-full aspect-[21/9] md:aspect-[2.4/1] rounded-[16px] overflow-hidden my-10 shadow-[0_8px_30px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30">
              <img src="/blog/blog.png" alt="Modern kitchen showcase" className="w-full h-full object-cover" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-[#5c3d42] mb-4">
              Warm Neutral Color Palettes
            </h2>
            <p className="text-sm md:text-[0.98rem] text-[#5c3d42]/80 leading-relaxed font-medium mb-12">
              Interior design continues to evolve with changing lifestyles and modern living needs. In 2026, homeowners are embracing spaces that are elegant, functional, and personalized. Whether you&apos;re renovating a single room or designing your dream home, these trends will help you create interiors that are timeless and inspiring.
            </p>

            {/* Narrative 1 (Image left, text right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
              <div className="aspect-[3/4] w-full rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.02)]">
                <img src="/blog/blog1.png" alt="Kitchen highlight detail" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm md:text-[0.98rem] text-[#5c3d42]/85 leading-relaxed font-medium">
                  At Varsovia Design, we believe every project begins with understanding our clients&apos; unique vision and lifestyle. Our approach combines creativity, craftsmanship, and innovative design solutions to create interiors that are elegant, functional, and built to stand the test of time. Whether you&apos;re renovating a single room, designing your dream home, or planning a complete interior transformation, staying informed about the latest design trends can help you make confident decisions and achieve exceptional results.
                </p>
              </div>
            </div>

            {/* Narrative 2 (Text left, image right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-sm md:text-[0.98rem] text-[#5c3d42]/85 leading-relaxed font-medium">
                  At Varsovia Design, we believe every project begins with understanding our clients&apos; unique vision and lifestyle. Our approach combines creativity, craftsmanship, and innovative design solutions to create interiors that are elegant, functional, and built to stand the test of time. Whether you&apos;re renovating a single room, designing your dream home, or planning a complete interior transformation, staying informed about the latest design trends can help you make confident decisions and achieve exceptional results.
                </p>
              </div>
              <div className="aspect-[3/4] w-full rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.02)]">
                <img src="/blog/blog1.png" alt="Kitchen highlight overview" className="w-full h-full object-cover" />
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-[#5c3d42] mt-10 mb-4">
              Warm Neutral Color Palettes
            </h3>
          </article>

          {/* 4. Discover More Blog Recommendations */}
          <section className="border-t border-[#e5dcd3] pt-16">
            <h2 className="font-display text-2xl font-bold text-[#5c3d42] mb-8">
              Discover More Blog
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {RELATED_BLOGS.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="group relative overflow-hidden rounded-[14px] bg-[#F6EAEA] shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 flex flex-col justify-between transition hover:shadow-[0_8px_30px_rgba(107,44,58,0.04)] cursor-pointer"
                >
                  <div>
                    {/* Blog Cover Image with overlay tag */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-between items-center text-white text-[0.72rem] font-semibold select-none">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#e8a0ad]" />
                          {blog.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#e8a0ad]" />
                          {blog.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Excerpt details */}
                    <div className="p-5 pb-3">
                      <h3 className="text-[1.05rem] font-bold text-[#5c3d42] leading-snug group-hover:text-[#e85d8a] transition duration-300">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#5c3d42]/75 leading-relaxed font-medium line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <span className="mt-3 inline-block text-xs font-bold text-[#5c3d42] underline hover:text-[#e85d8a] transition duration-300">
                        Read More
                      </span>
                    </div>
                  </div>

                  {/* Author footer */}
                  <div className="border-t border-[#e5dcd3]/40 p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-[#5c3d42]/10 bg-white">
                      <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-[#5c3d42]/90">
                      {blog.author.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer
        bio="Transforming homes with thoughtfully designed interiors that feel timeless, warm, and uniquely yours."
        phone="+91 98765 43210"
        email="hello@Varsoviadesign.in"
        address="SG Highway, Ahmedabad, Gujarat 380015"
      />
    </>
  );
}
