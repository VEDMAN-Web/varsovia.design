/** Frontend mirror of backend IA page defaults (localized strings already resolved on public GET). */

function L(en: string) {
  return en;
}

function hero(titleEn: string) {
  return {
    eyebrow: "",
    title: titleEn,
    subtitle: "",
    image: "",
    ctaLabel: "Get a consultation",
    ctaHref: "/contact",
  };
}

function child(slug: string, titleEn: string, order = 0) {
  return {
    slug,
    title: titleEn,
    metaTitle: "",
    metaDescription: "",
    hero: hero(titleEn),
    body: "",
    indexable: false,
    order,
  };
}

function hub(slug: string, titleEn: string, children: ReturnType<typeof child>[] = []) {
  return {
    slug,
    indexable: false,
    metaTitle: "",
    metaDescription: "",
    hero: hero(titleEn),
    body: "",
    children,
  };
}

export const IA_HUB_PATHS: Record<string, string> = {
  furniture: "/furniture",
  interiorDesign: "/interior-design",
  completeInteriors: "/complete-interiors",
  services: "/services",
  locations: "/locations",
  forDevelopers: "/for-developers",
  journal: "/journal",
  aboutBrand: "/about",
};

export const DEFAULT_IA_PAGES = {
  furniture: hub("furniture", "Furniture", [
    child("kitchens", "Kitchens", 0),
    child("wardrobes", "Wardrobes", 1),
    child("living-room", "Living Room", 2),
    child("bedrooms", "Bedrooms", 3),
    child("bathroom", "Bathroom", 4),
    child("dining", "Dining", 5),
    child("doors", "Doors", 6),
    child("whole-house", "Whole House", 7),
  ]),
  interiorDesign: hub("interior-design", "Interior Design", []),
  completeInteriors: hub("complete-interiors", "Complete Interiors", [
    child("villas", "Villas", 0),
    child("condos", "Condos", 1),
    child("hotels-resorts", "Hotels & Resorts", 2),
    child("developers", "Developers", 3),
  ]),
  services: hub("services", "Services", [
    child("custom-furniture", "Custom Furniture", 0),
    child("interior-design", "Interior Design", 1),
    child("furniture-packages", "Furniture Packages", 2),
    child("installation", "Installation", 3),
    child("renovation", "Renovation", 4),
  ]),
  locations: hub("locations", "Locations", [
    child("koh-samui", "Koh Samui", 0),
    child("phuket", "Phuket", 1),
    child("bangkok", "Bangkok", 2),
    child("pattaya", "Pattaya", 3),
    child("hua-hin", "Hua Hin", 4),
    child("chiang-mai", "Chiang Mai", 5),
  ]),
  forDevelopers: hub("for-developers", "For Developers", []),
  journal: hub("journal", "Journal", [
    child("kitchens", "Kitchens", 0),
    child("furniture", "Furniture", 1),
    child("materials", "Materials", 2),
    child("interior-design", "Interior Design", 3),
    child("villa-guides", "Villa Guides", 4),
    child("thailand-living", "Thailand Living", 5),
  ]),
  aboutBrand: hub("about", "About", [
    child("varsovia", "Varsovia", 0),
    child("livo", "Livo", 1),
    child("oppolia", "Oppolia", 2),
  ]),
};

// silence unused in some bundlers
void L;
