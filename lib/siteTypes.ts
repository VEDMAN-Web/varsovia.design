export type SiteBlock = { title: string; text: string };

export type ProcessStep = { step: string; title: string; text: string };

export type Stat = { value: string; label: string };

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
  partners?: Array<{ _id: string; name: string; logo?: string }>;
};
