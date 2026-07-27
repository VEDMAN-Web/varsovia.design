import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Products from "@/components/sections/Products";
import Catalogue from "@/components/sections/Catalogue";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Testimonials from "@/components/sections/Testimonials";
import Showrooms from "@/components/sections/Showrooms";
import Partners from "@/components/sections/Partners";
import Contact from "@/components/sections/Contact";
import { fetchHomeData } from "@/lib/api";

export default async function Home() {
  const data = await fetchHomeData();
  const site = data.site || {};

  return (
    <>
      <Navbar />
      <main>
        <Hero
          headline={site.heroHeadline || "CHOOSE FROM A RANGE OF HIGH-QUALITY MODULAR KITCHENS."}
        />
        <About
          title="ABOUT VARSOVIA"
          text={`Varsovia started in a rented one-room studio in Warsaw's Praga district, with a simple belief: a beautiful room only earns that word once someone has lived in it for a year and still loves it. We still work that way measuring twice, drawing by hand before we draw on screen, and choosing materials that age instead of wear out.

Every project starts with how you move through a space, not how it will photograph. The result is interiors that feel inevitable, as if they couldn't have been arranged any other way.`}
        />
        <Stats />
        <Products />
        <div id="catalogue">
          <Catalogue />
        </div>
        <FeaturedProjects />
        {/* Real Stories — directly under Featured Projects */}
        <Testimonials testimonials={data.testimonials || []} />
        <div id="showrooms">
          <Showrooms showrooms={data.showrooms || []} />
        </div>
        <div id="partners">
          <Partners partners={data.partners || []} />
        </div>
        <Contact images={site.contactImages || []} />
      </main>
      <Footer
        bio={site.footerBio || ""}
        phone={site.phone || ""}
        email={site.email || ""}
        address={site.address || ""}
      />
    </>
  );
}
