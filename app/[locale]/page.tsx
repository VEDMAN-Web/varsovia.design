import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Products from "@/components/sections/Products";
import Catalogue from "@/components/sections/Catalogue";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Testimonials from "@/components/sections/Testimonials";
import CoreStrengths from "@/components/sections/CoreStrengths";
import Partners from "@/components/sections/Partners";
import Contact from "@/components/sections/Contact";
import HomeScrollToTop from "@/components/home/HomeScrollToTop";
import SectionPreloader from "@/components/sections/SectionPreloader";
import { fetchHomeData, fetchProducts, fetchProjects, fetchSite } from "@/lib/api";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { resolveMediaUrl, MEDIA } from "@/lib/mediaAssets";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default as {
    metadata: { siteTitle: string; siteDescription: string };
  };
  const site = await fetchSite(locale as Locale).catch(() => null);
  const cmsTitle = String(site?.homeSeo?.metaTitle ?? "").trim();
  const cmsDescription = String(site?.homeSeo?.metaDescription ?? "").trim();
  return pageMetadata({
    title: cmsTitle || messages.metadata.siteTitle,
    description: cmsDescription || messages.metadata.siteDescription,
    path: `/${locale}`,
    locale,
    indexable: site?.homeSeo?.indexable === true,
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [data, products, projects] = await Promise.all([
    fetchHomeData(locale as Locale),
    fetchProducts(locale as Locale),
    fetchProjects(locale as Locale).catch(() => []),
  ]);
  const site = data.site || {};

  // Preload ALL section images (About, Stats, FeaturedProjects, Products, Catalogue, Testimonials, CoreStrengths)
  const preloadImages = [
    // About section images (3 images)
    ...(site.aboutImages || []).slice(0, 3).map((img: string) => ({
      src: resolveMediaUrl(img, MEDIA.about[0]),
      priority: "low" as const,
    })),
    // Stats image
    {
      src: resolveMediaUrl(site.statsImage, MEDIA.stats),
      priority: "low" as const,
    },
    // Featured projects (first 6)
    ...(projects || []).slice(0, 6).map((project: { coverImage?: string; gallery?: string[] }) => ({
      src: resolveMediaUrl(project.coverImage || project.gallery?.[0], MEDIA.featured[0]),
      priority: "low" as const,
    })),
    // Products section (first 3)
    ...(products || []).slice(0, 3).map((product: { image?: string }) => ({
      src: resolveMediaUrl(product.image, MEDIA.products[0]),
      priority: "low" as const,
    })),
    // Catalogue section (first 5)
    ...(data.catalogues || []).slice(0, 5).map((cat: { coverImage?: string; image?: string }, idx: number) => ({
      src: resolveMediaUrl(cat.coverImage || cat.image, MEDIA.catalogues[idx % MEDIA.catalogues.length]),
      priority: "low" as const,
    })),
    // Testimonials (first 7)
    ...(data.testimonials || []).slice(0, 7).map((t: { image?: string }, idx: number) => ({
      src: resolveMediaUrl(t.image, MEDIA.stories[idx % MEDIA.stories.length]),
      priority: "low" as const,
    })),
    // Core strengths (first 6)
    ...(data.coreStrengths || []).slice(0, 6).map((s: { image?: string }, idx: number) => ({
      src: resolveMediaUrl(s.image, MEDIA.core[idx % MEDIA.core.length]),
      priority: "low" as const,
    })),
    // Contact images (first 3)
    ...(site.contactImages || []).slice(0, 3).map((img: string) => ({
      src: resolveMediaUrl(img, MEDIA.contact[0]),
      priority: "low" as const,
    })),
  ].filter((item) => item.src);

  return (
    <>
      <Navbar />
      <SectionPreloader images={preloadImages} />
      <main>
        <Hero
          eyebrow={site.heroEyebrow}
          headline={site.heroHeadline}
          subtitle={site.heroSubtitle}
          heroImage={site.heroImage}
          primaryCtaLabel={site.heroPrimaryCtaLabel}
          primaryCtaHref={site.heroPrimaryCtaHref}
          secondaryCtaLabel={site.heroSecondaryCtaLabel}
          secondaryCtaHref={site.heroSecondaryCtaHref}
        />
        <About
          title={site.aboutTitle}
          subtitle={site.aboutSubtitle}
          text={site.aboutText}
          images={site.aboutImages}
          ctaLabel={site.aboutCtaLabel}
          ctaHref={site.aboutCtaHref}
        />
        <Stats stats={site.stats} statsImage={site.statsImage} />
        <FeaturedProjects projects={projects} />
        <div id="catalogue">
          <Catalogue catalogues={data.catalogues || []} contactImages={site.contactImages || []} />
        </div>
        <Products products={products} />
        <Testimonials testimonials={data.testimonials || []} />
        <CoreStrengths strengths={data.coreStrengths} />
        <div id="partners">
          <Partners partners={data.partners || []} />
        </div>
        <Contact images={site.contactImages || []} />
      </main>
      <HomeScrollToTop />
    </>
  );
}
