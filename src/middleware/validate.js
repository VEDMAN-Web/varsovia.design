const { z } = require("zod");

/**
 * validate(schema) — returns Express middleware that validates req.body
 * against a Zod schema. Returns 422 with structured errors on failure.
 */
function validate(schema) {
  return (req, res, next) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const result = schema.safeParse(body);
    if (!result.success) {
      // Zod v4: issues are on result.error directly (iterable), not result.error.errors
      const issues = result.error.issues || result.error.errors || [];
      const errors = issues.map((e) => ({
        field: (e.path || []).join("."),
        message: e.message,
      }));
      return res.status(422).json({ message: "Validation failed.", errors });
    }
    req.body = result.data;
    next();
  };
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name:        z.string().min(1, "Name is required.").max(100).trim(),
  email:       z.string().email("Invalid email address.").max(200).trim(),
  phone:       z.string().min(6, "Phone is required.").max(30).trim(),
  whatsapp:    z.string().max(30).trim().optional(),
  city:        z.string().max(100).trim().optional(),
  country:     z.string().max(100).trim().optional(),
  projectType: z.string().max(100).trim().optional(),
  budget:      z.string().max(100).trim().optional(),
  message:     z.string().max(2000).trim().optional(),
});

const productSchema = z.object({
  title:       z.string().min(1).max(200).trim(),
  slug:        z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).trim().optional(),
  image:       z.string().max(500).trim().optional(),
  category:    z.string().max(100).trim().optional(),
  featured:    z.boolean().optional(),
  order:       z.number().int().min(0).optional(),
});

const projectSchema = z.object({
  title:           z.string().min(1).max(200).trim(),
  slug:            z.string().max(200).trim().optional(),
  description:     z.string().max(2000).trim().optional(),
  location:        z.string().max(200).trim().optional(),
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
});

const blogSchema = z.object({
  title:    z.string().min(1).max(300).trim(),
  excerpt:  z.string().max(500).trim().optional(),
  content:  z.string().max(50000).trim().optional(),
  date:     z.string().optional(),
  readTime: z.string().max(50).optional(),
  author:   z.object({
    name:   z.string().max(100).trim().optional(),
    avatar: z.string().max(500).trim().optional(),
  }).optional(),
  image:    z.string().max(500).trim().optional(),
  views:    z.number().int().min(0).optional(),
  order:    z.number().int().min(0).optional(),
});

const testimonialSchema = z.object({
  name:   z.string().min(1).max(100).trim(),
  role:   z.string().max(100).trim().optional(),
  quote:  z.string().min(1).max(1000).trim(),
  rating: z.number().int().min(1).max(5).optional(),
  image:  z.string().max(500).trim().optional(),
  order:  z.number().int().min(0).optional(),
});

const teamMemberSchema = z.object({
  name:     z.string().min(1).max(100).trim(),
  role:     z.string().max(100).trim().optional(),
  image:    z.string().max(500).trim().optional(),
  teamType: z.enum(["Italian", "Headquarter"]).optional(),
  order:    z.number().int().min(0).optional(),
});

const faqSchema = z.object({
  question: z.string().min(1).max(500).trim(),
  answer:   z.string().min(1).max(2000).trim(),
  category: z.string().max(100).trim().optional(),
  order:    z.number().int().min(0).optional(),
});

const catalogueSchema = z.object({
  title:       z.string().min(1).max(200).trim(),
  coverImage:  z.string().max(500).trim().optional(),
  downloadUrl: z.string().max(500).trim().optional(),
  order:       z.number().int().min(0).optional(),
});

const partnerSchema = z.object({
  name:    z.string().min(1).max(100).trim(),
  logo:    z.string().max(500).trim().optional(),
  website: z.string().max(500).trim().optional(),
  order:   z.number().int().min(0).optional(),
});

const showroomSchema = z.object({
  name:     z.string().min(1).max(200).trim(),
  location: z.string().max(200).trim().optional(),
  image:    z.string().max(500).trim().optional(),
  address:  z.string().max(500).trim().optional(),
  order:    z.number().int().min(0).optional(),
});

const siteUpdateSchema = z.object({
  heroHeadline:   z.string().max(300).trim().optional(),
  heroImage:      z.string().max(500).trim().optional(),
  aboutTitle:     z.string().max(200).trim().optional(),
  aboutText:      z.string().max(5000).trim().optional(),
  aboutImages:    z.array(z.string().max(500)).optional(),
  stats:          z.array(z.object({
    value: z.string().max(50).trim(),
    label: z.string().max(100).trim(),
  })).optional(),
  contactImages:  z.array(z.string().max(500)).optional(),
  footerBio:      z.string().max(500).trim().optional(),
  phone:          z.string().max(30).trim().optional(),
  email:          z.string().email().max(200).trim().optional(),
  address:        z.string().max(300).trim().optional(),
});
const showcaseSchema = z.object({
  title:      z.string().min(1).max(300).trim(),
  category:   z.string().max(100).trim().optional(),
  image:      z.string().max(500).trim().optional(),
  location:   z.string().max(200).trim().optional(),
  typeLabel:  z.string().max(100).trim().optional(),
  typeValue:  z.string().max(200).trim().optional(),
  supplyArea: z.string().max(300).trim().optional(),
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
  },
};
