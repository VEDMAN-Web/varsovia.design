const { z } = require("zod");
const { sendError } = require("../utils/apiResponse");

const localizedString = z.union([
  z.string().max(50000),
  z.object({
    en: z.string().max(50000).optional(),
    th: z.string().max(50000).optional(),
    pl: z.string().max(50000).optional(),
  }),
]);

const localizedRequired = z.union([
  z.string().min(1).max(50000),
  z.object({
    en: z.string().min(1).max(50000),
    th: z.string().max(50000).optional(),
    pl: z.string().max(50000).optional(),
  }),
]);

const localizedBlock = z.object({
  title: localizedString.optional(),
  text: localizedString.optional(),
  icon: z.string().max(500).trim().optional(),
});

const localizedStat = z.object({
  value: localizedString.optional(),
  label: localizedString.optional(),
});

const localizedProcessStep = z.object({
  step: z.string().max(20).optional(),
  title: localizedString.optional(),
  text: localizedString.optional(),
  icon: z.string().max(500).trim().optional(),
});

const designToolSchema = z.object({
  name: localizedString.optional(),
  image: z.string().max(500).trim().optional(),
  order: z.number().int().min(0).optional(),
});

const localeFlagsSchema = z.object({
  en: z.string().max(500).trim().optional(),
  th: z.string().max(500).trim().optional(),
  pl: z.string().max(500).trim().optional(),
});

/**
 * validate(schema) — returns Express middleware that validates req.body
 * against a Zod schema. Returns 422 with structured errors on failure.
 */
function validate(schema) {
  return (req, res, next) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const result = schema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const errors = issues.map((e) => ({
        field: (e.path || []).join("."),
        message: e.message,
      }));
      return sendError(res, 422, {
        code: "VALIDATION_ERROR",
        message: "Validation failed.",
        details: errors,
      });
    }
    // Preserve raw Unicode string fields that Zod may sanitize
    const PRESERVE_RAW = ["budget", "message", "whatsapp", "city", "country", "address"];
    const parsed = result.data;
    for (const key of PRESERVE_RAW) {
      if (body[key] !== undefined && typeof body[key] === "string") {
        parsed[key] = body[key];
      }
    }
    req.body = parsed;
    next();
  };
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const nameField = z
  .string()
  .min(1, "Name is required.")
  .max(100)
  .trim()
  .refine((val) => /^[\p{L}][\p{L}\s'.-]*$/u.test(val), "Name contains invalid characters.");

const placeField = z
  .string()
  .max(100)
  .trim()
  .refine((val) => val === "" || (/^[\p{L}][\p{L}\s'.-]*$/u.test(val) && val.length >= 2), {
    message: "Use letters only (no numbers or symbols).",
  });

const contactSchema = z.object({
  name:        nameField,
  email:       z.string().email("Invalid email address.").max(200).trim(),
  phone:       z.string().min(6, "Phone is required.").max(30).trim(),
  whatsapp:    z
    .string()
    .max(30)
    .trim()
    .optional()
    .refine((val) => !val || /^\d{6,15}$/.test(val.replace(/\D/g, "")), "Invalid WhatsApp number."),
  city:        placeField.optional(),
  country:     placeField.optional(),
  projectType: z.string().max(100).trim().optional(),
  budget:      z.custom((val) => typeof val === "string").optional(),
  message:     z.string().max(2000).trim().optional(),
});

const productSchema = z.object({
  title:       localizedRequired,
  slug:        z.string().min(1).max(200).trim().optional(),
  description: localizedString.optional(),
  fullDescription: localizedString.optional(),
  image:       z.string().max(500).trim().optional(),
  gallery:     z.array(z.string().max(500)).optional(),
  features:    z.array(z.object({ text: localizedString.optional() })).optional(),
  specs:       z.array(z.object({ label: localizedString.optional(), value: localizedString.optional() })).optional(),
  category:    z.string().max(100).trim().optional(),
  featured:    z.boolean().optional(),
  order:       z.number().int().min(0).optional(),
});

const projectSchema = z.object({
  title:           localizedRequired,
  slug:            z.string().max(200).trim().optional(),
  description:     localizedString.optional(),
  location:        localizedString.optional(),
  coverImage:      z.string().max(500).trim().optional(),
  gallery:         z.array(z.string().max(500)).optional(),
  category:        z.enum(["Kitchen","Bedroom","Bathroom","Door & Windows","Whole House Solutions","Furniture"]).optional(),
  featured:        z.boolean().optional(),
  interiorCatalog: z.boolean().optional(),
  subcategory:     z.string().max(100).trim().optional(),
  shape:           z.string().max(100).trim().optional(),
  style:           z.string().max(100).trim().optional(),
  color:           z.string().max(100).trim().optional(),
  material:        z.string().max(100).trim().optional(),
  finish:          z.string().max(100).trim().optional(),
  price:           z.number().min(0).optional(),
  isNew:           z.boolean().optional(),
  order:           z.number().int().min(0).optional(),
  detailTitle:     localizedString.optional(),
  detailDescription: localizedString.optional(),
  narrativeOne:    localizedString.optional(),
  narrativeTwo:    localizedString.optional(),
});

const blogSchema = z.object({
  title:    localizedRequired,
  excerpt:  localizedString.optional(),
  content:  localizedString.optional(),
  date:     z.string().optional(),
  readTime: localizedString.optional(),
  author:   z.object({
    name:   localizedString.optional(),
    avatar: z.string().max(500).trim().optional(),
  }).optional(),
  image:    z.string().max(500).trim().optional(),
  views:    z.number().int().min(0).optional(),
  order:    z.number().int().min(0).optional(),
});

const testimonialSchema = z.object({
  name:   localizedRequired,
  role:   localizedString.optional(),
  quote:  localizedRequired,
  rating: z.number().int().min(1).max(5).optional(),
  image:  z.string().max(500).trim().optional(),
  order:  z.number().int().min(0).optional(),
});

const teamMemberSchema = z.object({
  name:     localizedRequired,
  role:     localizedString.optional(),
  image:    z.string().max(500).trim().optional(),
  teamType: z.enum(["Italian", "Headquarter"]).optional(),
  order:    z.number().int().min(0).optional(),
});

const faqSchema = z.object({
  question: localizedRequired,
  answer:   localizedRequired,
  category: localizedString.optional(),
  order:    z.number().int().min(0).optional(),
});

const catalogueSchema = z.object({
  title:       localizedRequired,
  coverImage:  z.string().max(500).trim().optional(),
  downloadUrl: z.string().max(500).trim().optional(),
  order:       z.number().int().min(0).optional(),
});

const partnerSchema = z.object({
  name:    localizedRequired,
  logo:    z.string().max(500).trim().optional(),
  website: z.string().max(500).trim().optional(),
  order:   z.number().int().min(0).optional(),
});

const showroomSchema = z.object({
  name:     localizedRequired,
  location: localizedString.optional(),
  image:    z.string().max(500).trim().optional(),
  address:  localizedString.optional(),
  order:    z.number().int().min(0).optional(),
});

const coreStrengthSchema = z.object({
  title:       localizedRequired,
  description: localizedString.optional(),
  image:       z.string().max(500).trim().optional(),
  iconKey:     z.enum(["eye", "ruler", "users", "box", "shield", "pen"]).optional(),
  order:       z.number().int().min(0).optional(),
});

const footerOfficeSchema = z.object({
  label:   localizedString.optional(),
  address: z.string().max(500).trim().optional(),
});

const searchPageSchema = z.object({
  title:       localizedString.optional(),
  description: localizedString.optional(),
  href:        z.string().max(500).trim().optional(),
  order:       z.number().int().min(0).optional(),
});

const inquiryFormOptionSchema = z.object({
  value: z.string().min(1).max(200).trim(),
  label: localizedRequired,
});

const inquiryFormFieldSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(64)
    .trim()
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Field key must start with a letter."),
  type: z.enum(["name", "text", "email", "phone", "whatsapp", "textarea", "select", "place"]),
  label: localizedRequired,
  placeholder: localizedString.optional(),
  required: z.boolean().optional(),
  width: z.enum(["full", "half"]).optional(),
  order: z.number().int().min(0).optional(),
  enabled: z.boolean().optional(),
  useLocaleDialCode: z.boolean().optional(),
  maxLength: z.number().int().min(1).max(10000).optional(),
  options: z.array(inquiryFormOptionSchema).optional(),
});

const inquiryFormSchema = z.object({
  version: z.number().int().min(1).optional(),
  submitLabel: localizedString.optional(),
  fields: z.array(inquiryFormFieldSchema).min(1).max(40),
});

const mainNavLinkSchema = z.object({
  label: localizedString.optional(),
  title: localizedString.optional(),
  subtitle: localizedString.optional(),
  href: z.string().max(500).trim(),
});

const mainNavMenuSchema = z.object({
  featuredLabel: localizedString.optional(),
  featuredSubtitle: localizedString.optional(),
  featuredHref: z.string().max(500).trim().optional(),
  sectionLabel: localizedString.optional(),
  links: z.array(mainNavLinkSchema).max(40).optional(),
});

const mainNavItemSchema = z.object({
  id: z.string().min(1).max(80).trim(),
  label: localizedString,
  href: z.string().max(500).trim(),
  menuKind: z.enum(["none", "dropdown", "showcaseMega"]).optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().min(0).max(999).optional(),
  menu: mainNavMenuSchema.optional(),
});

const mainNavigationSchema = z.object({
  version: z.number().int().min(1).optional(),
  items: z.array(mainNavItemSchema).min(1).max(20),
});

const footerNavLinkSchema = z.object({
  label: localizedString,
  href: z.string().max(500).trim(),
  enabled: z.boolean().optional(),
  order: z.number().int().min(0).max(999).optional(),
});

const footerNavColumnSchema = z.object({
  id: z.string().min(1).max(80).trim(),
  order: z.number().int().min(0).max(999).optional(),
  enabled: z.boolean().optional(),
  links: z.array(footerNavLinkSchema).max(30).optional(),
});

const footerNavigationSchema = z.object({
  version: z.number().int().min(1).optional(),
  linkColumns: z.array(footerNavColumnSchema).min(1).max(6).optional(),
  legalLinks: z.array(footerNavLinkSchema).max(12).optional(),
  contactHeading: localizedString.optional(),
  contactLabels: z
    .object({
      email: localizedString.optional(),
      mobileWhatsapp: localizedString.optional(),
      contactNumber: localizedString.optional(),
    })
    .optional(),
  socialLabels: z
    .object({
      whatsapp: localizedString.optional(),
      facebook: localizedString.optional(),
    })
    .optional(),
  copyright: localizedString.optional(),
});

const siteUpdateSchema = z.object({
  heroEyebrow:            localizedString.optional(),
  heroHeadline:           localizedString.optional(),
  heroSubtitle:           localizedString.optional(),
  heroPrimaryCtaLabel:    localizedString.optional(),
  heroSecondaryCtaLabel:  localizedString.optional(),
  heroImage:              z.string().max(500).trim().optional(),
  heroPrimaryCtaHref:     z.string().max(500).trim().optional(),
  heroSecondaryCtaHref:   z.string().max(500).trim().optional(),
  aboutTitle:             localizedString.optional(),
  aboutText:              localizedString.optional(),
  aboutIntro:             localizedString.optional(),
  aboutStory:             localizedString.optional(),
  aboutHeroSubtitle:      localizedString.optional(),
  aboutImages:            z.array(z.string().max(500)).optional(),
  aboutStoryImages:       z.array(z.string().max(500)).optional(),
  brandLogoMark:          z.string().max(500).trim().optional(),
  brandLogoMarkOnDark:    z.string().max(500).trim().optional(),
  brandLogoLockup:        z.string().max(500).trim().optional(),
  brandLogoLockupOnDark:  z.string().max(500).trim().optional(),
  brandWordmarkLine1:     localizedString.optional(),
  brandWordmarkLine2:     localizedString.optional(),
  stats:                  z.array(localizedStat).optional(),
  statsImage:             z.string().max(500).trim().optional(),
  vision:                 localizedBlock.optional(),
  mission:                localizedBlock.optional(),
  values:                 localizedBlock.optional(),
  processSteps:           z.array(localizedProcessStep).optional(),
  designTools:            z.array(designToolSchema).optional(),
  localeFlags:            localeFlagsSchema.optional(),
  contactImages:          z.array(z.string().max(500)).optional(),
  footerBio:              localizedString.optional(),
  phone:                  z.string().max(30).trim().optional(),
  email:                  z.string().email().max(200).trim().optional(),
  address:                localizedString.optional(),
  mobileWhatsapp:         z.string().max(30).trim().optional(),
  contactPhone:           z.string().max(30).trim().optional(),
  facebookUrl:            z.string().max(500).trim().optional(),
  whatsappUrl:            z.string().max(500).trim().optional(),
  instagramUrl:           z.string().max(500).trim().optional(),
  xUrl:                   z.string().max(500).trim().optional(),
  footerOffices:          z.array(footerOfficeSchema).optional(),
  sectionCopy:            z.record(z.string(), z.object({
    title: localizedString.optional(),
    subtitle: localizedString.optional(),
  })).optional(),
  searchPages:            z.array(searchPageSchema).optional(),
  navMenus:               z.array(z.record(z.string(), z.unknown())).optional(),
  qualitySale:            z.record(z.string(), z.unknown()).optional(),
  interiorCatalogMode:    z.enum(["hybrid", "api"]).optional(),
  inquiryForm:            inquiryFormSchema.optional(),
  mainNavigation:         mainNavigationSchema.optional(),
  footerNavigation:       footerNavigationSchema.optional(),
});
const showcaseSchema = z.object({
  title:      localizedRequired,
  category:   localizedString.optional(),
  image:      z.string().max(500).trim().optional(),
  location:   localizedString.optional(),
  typeLabel:  localizedString.optional(),
  typeValue:  localizedString.optional(),
  supplyArea: localizedString.optional(),
  gallery:    z.array(z.string().max(500)).optional(),
  order:      z.number().int().min(0).optional(),
});

const showcaseUpdateSchema = showcaseSchema.partial();
const productUpdateSchema  = productSchema.partial();
const projectUpdateSchema  = projectSchema.partial();
const blogUpdateSchema     = blogSchema.partial();
const testimonialUpdateSchema = testimonialSchema.partial();
const teamMemberUpdateSchema  = teamMemberSchema.partial();
const faqUpdateSchema      = faqSchema.partial();
const catalogueUpdateSchema  = catalogueSchema.partial();
const partnerUpdateSchema  = partnerSchema.partial();
const showroomUpdateSchema = showroomSchema.partial();

module.exports = {
  validate,
  schemas: {
    contact:            contactSchema,
    siteUpdate:         siteUpdateSchema,
    product:            productSchema,
    productUpdate:      productUpdateSchema,
    project:            projectSchema,
    projectUpdate:      projectUpdateSchema,
    blog:               blogSchema,
    blogUpdate:         blogUpdateSchema,
    testimonial:        testimonialSchema,
    testimonialUpdate:  testimonialUpdateSchema,
    teamMember:         teamMemberSchema,
    teamMemberUpdate:   teamMemberUpdateSchema,
    faq:                faqSchema,
    faqUpdate:          faqUpdateSchema,
    catalogue:          catalogueSchema,
    catalogueUpdate:    catalogueUpdateSchema,
    partner:            partnerSchema,
    partnerUpdate:      partnerUpdateSchema,
    showroom:           showroomSchema,
    showroomUpdate:     showroomUpdateSchema,
    showcase:           showcaseSchema,
    showcaseUpdate:     showcaseUpdateSchema,
    coreStrength:         coreStrengthSchema,
    coreStrengthUpdate:   coreStrengthSchema.partial(),
  },
};
