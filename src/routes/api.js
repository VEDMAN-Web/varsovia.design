const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const { contactLimiter, adminLimiter, searchLimiter } = require("../middleware/rateLimiter");const { validate, schemas } = require("../middleware/validate");
const ctrl = require("../controllers/apiController");
const { searchSite } = require("../controllers/searchController");

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/home", ctrl.getHomeData);
router.get("/site", ctrl.getSite);
router.post("/contact", contactLimiter, validate(schemas.contact), ctrl.submitContact);

router.get("/products",        ctrl.products.list);
router.get("/products/:slug",  ctrl.getProductBySlug);
router.get("/projects",        ctrl.projects.list);
router.get("/projects/:id",    ctrl.getProjectById);
router.get("/testimonials", ctrl.testimonials.list);
router.get("/catalogues",   ctrl.catalogues.list);
router.get("/partners",     ctrl.partners.list);
router.get("/showrooms",    ctrl.showrooms.list);
router.get("/showcases",   ctrl.showcases.list);
router.get("/blogs",        ctrl.blogs.list);
router.get("/blogs/:id",    ctrl.getBlogById);
router.get("/team",         ctrl.teamMembers.list);
router.get("/faqs",         ctrl.faqs.list);

router.get("/search", searchLimiter, searchSite);

// ─── Admin routes (x-admin-key required) ──────────────────────────────────────
router.use(adminAuth);
router.use(adminLimiter);

router.put("/site", validate(schemas.siteUpdate), ctrl.updateSite);
router.get("/contacts", ctrl.listContacts);
router.patch("/contacts/:id", ctrl.updateContactStatus);

function mountCrud(path, handlers, createSchema, updateSchema) {
  router.post(`/${path}`,    validate(createSchema), handlers.create);
  router.put(`/${path}/:id`, validate(updateSchema), handlers.update);
  router.delete(`/${path}/:id`,                      handlers.remove);
}

mountCrud("products",     ctrl.products,     schemas.product,     schemas.productUpdate);
mountCrud("projects",     ctrl.projects,     schemas.project,     schemas.projectUpdate);
mountCrud("testimonials", ctrl.testimonials, schemas.testimonial, schemas.testimonialUpdate);
mountCrud("catalogues",   ctrl.catalogues,   schemas.catalogue,   schemas.catalogueUpdate);
mountCrud("partners",     ctrl.partners,     schemas.partner,     schemas.partnerUpdate);
mountCrud("showrooms",    ctrl.showrooms,    schemas.showroom,    schemas.showroomUpdate);
mountCrud("showcases",   ctrl.showcases,    schemas.showcase,    schemas.showcaseUpdate);
mountCrud("blogs",        ctrl.blogs,        schemas.blog,        schemas.blogUpdate);
mountCrud("team-members", ctrl.teamMembers,  schemas.teamMember,  schemas.teamMemberUpdate);
mountCrud("faqs",         ctrl.faqs,         schemas.faq,         schemas.faqUpdate);

module.exports = router;
