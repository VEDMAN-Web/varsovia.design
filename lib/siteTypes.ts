export type SiteBlock = { title: string; text: string; icon?: string };

export type ProcessStep = { step: string; title: string; text: string; icon?: string };

export type DesignTool = { name: string; image: string; order?: number };

export type LocaleFlags = { en?: string; th?: string; pl?: string };

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
  ctaLabel?: string;
  ctaHref?: string;
  itemCtaLabel?: string;
};

export type PageSeoBlock = {
  indexable?: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export type LegalDocumentBlock = {
  heading: string;
  text: string;
};

export type LegalDocumentContent = {
  title: string;
  subtitle: string;
  updated: string;
  metaDescription?: string;
  blocks: LegalDocumentBlock[];
};

export type FaqPageContent = PageSeoBlock & {
  heroTitle?: string;
  heroSubtitle?: string;
};

export type CataloguePageContent = PageSeoBlock & {
  heroTitle?: string;
  heroSubtitle?: string;
};

export type ContactPageContent = PageSeoBlock & {
  heroTitle?: string;
  heroSubtitle?: string;
  locationTitle?: string;
  locationSubtitle?: string;
  mapEmbedUrl?: string;
  mapAriaLabel?: string;
  showroomsTitle?: string;
  showroomsSubtitle?: string;
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
  aboutSubtitle?: string;
  aboutText?: string;
  aboutCtaLabel?: string;
  aboutCtaHref?: string;
  aboutIntro?: string;
  aboutStory?: string;
  aboutHeroTitle?: string;
  aboutHeroSubtitle?: string;
  aboutImages?: string[];
  aboutStoryImages?: string[];
  brandLogoMark?: string;
  brandLogoMarkOnDark?: string;
  brandLogoLockup?: string;
  brandLogoLockupOnDark?: string;
  brandWordmarkLine1?: string;
  brandWordmarkLine2?: string;
  designTools?: DesignTool[];
  teamPage?: {
    heroTitle?: string;
    heroSubtitle?: string;
    intro?: string;
    designTitle?: string;
    designEyebrow?: string;
    designBody?: string;
    architectTitle?: string;
    architectEyebrow?: string;
    architectBody?: string;
    toolsTitle?: string;
    toolsBody?: string;
    stats?: Stat[];
    metaTitle?: string;
    metaDescription?: string;
    indexable?: boolean;
  };
  localeFlags?: LocaleFlags;
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
  instagramUrl?: string;
  xUrl?: string;
  footerOffices?: SiteOffice[];
  sectionCopy?: Record<string, SiteSectionCopy>;
  searchPages?: SiteSearchPage[];
  navMenus?: SiteNavItem[];
  mainNavigation?: import("./mainNavigationTypes").MainNavigationConfig;
  footerNavigation?: import("./footerNavigationTypes").FooterNavigationConfig;
  qualitySale?: Record<string, unknown>;
  showcaseMeta?: Array<{
    tabKey: string;
    title?: string;
    subtitle?: string;
    order?: number;
  }>;
  /** /projects listing SEO + hero (Group A CMS block) */
  projectsPage?: {
    metaTitle?: string;
    metaDescription?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    indexable?: boolean;
  };
  interiorCatalogMode?: "hybrid" | "api";
  inquiryForm?: import("./inquiryFormTypes").InquiryFormConfig;
  /** Group A SEO IA hubs */
  pages?: Record<string, unknown>;
  aboutPageSettings?: PageSeoBlock;
  /** Site-wide / home Google listing (locale layout metadata). */
  homeSeo?: PageSeoBlock & {
    metaTitle?: string;
    metaDescription?: string;
  };
  faqPage?: FaqPageContent;
  cataloguePage?: CataloguePageContent;
  contactPage?: ContactPageContent;
  legalPages?: {
    privacy?: LegalDocumentContent & PageSeoBlock;
    terms?: LegalDocumentContent & PageSeoBlock;
  };
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
  featured?: boolean;
};

export type ApiTestimonial = {
  _id: string;
  name: string;
  role?: string;
  quote: string;
  rating: number;
  image?: string;
};

export type ApiProduct = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  category?: string;
  visible?: boolean;
};

export type ApiShowroom = {
  _id: string;
  name: string;
  location?: string;
  image?: string;
  visible?: boolean;
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
  products?: ApiProduct[];
  projects?: ApiProject[];
  showrooms?: ApiShowroom[];
  partners?: Array<{ _id: string; name: string; logo?: string; website?: string }>;
  coreStrengths?: ApiCoreStrength[];
};
