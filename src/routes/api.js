const express = require("express");
const { contactLimiter, adminLimiter, searchLimiter } = require("../middleware/rateLimiter");
const { validate, schemas } = require("../middleware/validate");
const { validateContactSubmission } = require("../middleware/validateContactSubmission");
const validateProjectInteriorCatalog = require("../middleware/validateProjectInteriorCatalog");
const { adminAuth, requireAdminIfCms } = require("../middleware/adminAuth");
const ctrl = require("../controllers/apiController");
const { searchSite } = require("../controllers/searchController");

const router = express.Router();

// ─── Public routes (localized). ?cms=1 requires x-admin-key for full CMS payloads. ───
router.get("/home", requireAdminIfCms, ctrl.getHomeData);
router.get("/site", requireAdminIfCms, ctrl.getSite);
router.post("/contact", contactLimiter, validateContactSubmission, ctrl.submitContact);

router.get("/products", requireAdminIfCms, ctrl.products.list);
router.get("/products/:slug", requireAdminIfCms, ctrl.getProductBySlug);
router.get("/projects", requireAdminIfCms, ctrl.projects.list);
router.get("/projects/:id", requireAdminIfCms, ctrl.getProjectById);
router.get("/testimonials", requireAdminIfCms, ctrl.testimonials.list);
router.get("/catalogues", requireAdminIfCms, ctrl.catalogues.list);
router.get("/partners", requireAdminIfCms, ctrl.partners.list);
router.get("/showrooms", requireAdminIfCms, ctrl.showrooms.list);
router.get("/showcases", requireAdminIfCms, ctrl.showcases.list);
router.get("/showcases/:id", requireAdminIfCms, ctrl.getShowcaseById);
router.get("/blogs", requireAdminIfCms, ctrl.blogs.list);
router.get("/blogs/:id", requireAdminIfCms, ctrl.getBlogById);
router.get("/team", requireAdminIfCms, ctrl.teamMembers.list);
router.get("/faqs", requireAdminIfCms, ctrl.faqs.list);

router.get("/core-strengths", requireAdminIfCms, ctrl.coreStrengths.list);

router.get("/search", searchLimiter, searchSite);

// ─── CMS / admin routes — require x-admin-key (Thailand admin proxies this) ───
router.use(adminLimiter);
router.use(adminAuth);

router.put("/site", validate(schemas.siteUpdate), ctrl.updateSite);
router.get("/contacts", ctrl.listContacts);
router.patch("/contacts/:id", ctrl.updateContactStatus);

router.get("/projects/interior-catalog/spec", ctrl.getInteriorCatalogFieldSpec);
router.get("/inquiry-form/spec", ctrl.getInquiryFormSpec);
router.get("/navigation/spec", ctrl.getMainNavigationSpec);
router.get("/footer/spec", ctrl.getFooterNavigationSpec);

function mountCrud(path, handlers, createSchema, updateSchema) {
  router.post(`/${path}`, validate(createSchema), handlers.create);
  router.put(`/${path}/:id`, validate(updateSchema), handlers.update);
  router.delete(`/${path}/:id`, handlers.remove);
}

mountCrud("products", ctrl.products, schemas.product, schemas.productUpdate);
router.post(
  "/projects",
  validate(schemas.project),
  validateProjectInteriorCatalog,
  ctrl.projects.create,
);
router.put(
  "/projects/:id",
  validate(schemas.projectUpdate),
  validateProjectInteriorCatalog,
  ctrl.projects.update,
);
router.delete("/projects/:id", ctrl.projects.remove);
mountCrud("testimonials", ctrl.testimonials, schemas.testimonial, schemas.testimonialUpdate);
mountCrud("catalogues", ctrl.catalogues, schemas.catalogue, schemas.catalogueUpdate);
mountCrud("partners", ctrl.partners, schemas.partner, schemas.partnerUpdate);
mountCrud("showrooms", ctrl.showrooms, schemas.showroom, schemas.showroomUpdate);
mountCrud("showcases", ctrl.showcases, schemas.showcase, schemas.showcaseUpdate);
mountCrud("blogs", ctrl.blogs, schemas.blog, schemas.blogUpdate);
mountCrud("team-members", ctrl.teamMembers, schemas.teamMember, schemas.teamMemberUpdate);
mountCrud("faqs", ctrl.faqs, schemas.faq, schemas.faqUpdate);
mountCrud("core-strengths", ctrl.coreStrengths, schemas.coreStrength, schemas.coreStrengthUpdate);

module.exports = router;
