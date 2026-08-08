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
import { fetchHomeData, fetchProducts, fetchProjects } from "@/lib/api";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [data, products, projects] = await Promise.all([
    fetchHomeData(locale as Locale),
    fetchProducts(locale as Locale),
    fetchProjects(locale as Locale),
  ]);
  const site = data.site || {};

  return (
    <>
      <Navbar />
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
          text={site.aboutText}
          images={site.aboutImages}
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
