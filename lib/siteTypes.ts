export type SiteBlock = { title: string; text: string };

export type ProcessStep = { step: string; title: string; text: string };

export type Stat = { value: string; label: string };

export type SiteOffice = { label: string; address: string };

export type SiteSearchPage = {
  title: string;
  description: string;
  href: string;
  order?: number;
};

export type SiteSectionCopy = {
  title?: string;
  subtitle?: string;
};

export type SiteNavItem = {
  id: string;
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string; description?: string }>;
};

export type SiteContent = {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  aboutTitle?: string;
  aboutText?: string;
  aboutIntro?: string;
  aboutStory?: string;
  aboutHeroSubtitle?: string;
  aboutImages?: string[];
  stats?: Stat[];
  statsImage?: string;
  contactImages?: string[];
  processSteps?: ProcessStep[];
  vision?: SiteBlock;
  mission?: SiteBlock;
  values?: SiteBlock;
  footerBio?: string;
  phone?: string;
  email?: string;
  address?: string;
  mobileWhatsapp?: string;
  contactPhone?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  footerOffices?: SiteOffice[];
  sectionCopy?: Record<string, SiteSectionCopy>;
  searchPages?: SiteSearchPage[];
  navMenus?: SiteNavItem[];
  qualitySale?: Record<string, unknown>;
  interiorCatalogMode?: "hybrid" | "api";
};

export type ApiCoreStrength = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  iconKey?: string;
  order?: number;
};

export type ApiProject = {
  _id: string;
  title: string;
  coverImage?: string;
  slug?: string;
  category?: string;
  location?: string;
  description?: string;
  gallery?: string[];
  image?: string;
  isNew?: boolean;
};

export type ApiTestimonial = {
  _id: string;
  name: string;
  role?: string;
  quote: string;
  rating: number;
  image?: string;
};

export type HomeData = {
  site: SiteContent;
  catalogues?: Array<{
    _id?: string;
    title: string;
    coverImage?: string;
    downloadUrl?: string;
  }>;
  testimonials?: ApiTestimonial[];
  partners?: Array<{ _id: string; name: string; logo?: string; website?: string }>;
  coreStrengths?: ApiCoreStrength[];
};
