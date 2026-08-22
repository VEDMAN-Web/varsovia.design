const {
  getRequestLocale,
  isAdminRequest,
  localizeSiteContent,
  localizeModelDoc,
  localizeModelDocs,
} = require("../utils/locale");
const { getInteriorCatalogFieldSpec } = require("../validation/projectInteriorCatalog");
const {
  DEFAULT_INQUIRY_FORM,
  getInquiryFormFieldSpec,
  localizeInquiryForm,
} = require("../validation/inquiryForm");
const {
  DEFAULT_MAIN_NAVIGATION,
  getMainNavigationSpec,
  localizeMainNavigation,
} = require("../validation/mainNavigation");
const {
  DEFAULT_FOOTER_NAVIGATION,
  getFooterNavigationSpec,
  localizeFooterNavigation,
} = require("../validation/footerNavigation");
const { invalidateInquiryFormCache } = require("../middleware/validateContactSubmission");
const { parsePagination, sendSuccess, sendList, sendError } = require("../utils/apiResponse");

const Product = require("../models/Product");
const Project = require("../models/Project");
const Testimonial = require("../models/Testimonial");
const Catalogue = require("../models/Catalogue");
const Partner = require("../models/Partner");
const Showroom = require("../models/Showroom");
const Showcase = require("../models/Showcase");
const Contact = require("../models/Contact");
const SiteContent = require("../models/SiteContent");
const Blog = require("../models/Blog");
const TeamMember = require("../models/TeamMember");
const FAQ = require("../models/FAQ");
const CoreStrength = require("../models/CoreStrength");

/** Existing docs without `visible` stay public; only explicit false is hidden. */
function visibilityFilter(req) {
  return isAdminRequest(req) ? {} : { visible: { $ne: false } };
}

function isHiddenFromPublic(req, doc) {
  if (isAdminRequest(req) || !doc) return false;
  return doc.visible === false;
}

async function getHomeData(req, res) {
  try {
    const vis = visibilityFilter(req);
    const [products, projects, testimonials, catalogues, partners, showrooms, coreStrengths, site] =
      await Promise.all([
        Product.find(vis).sort({ order: 1 }),
        Project.find({ featured: true, ...vis }).sort({ order: 1 }),
        Testimonial.find(vis).sort({ order: 1 }),
        Catalogue.find(vis).sort({ order: 1 }),
        Partner.find(vis).sort({ order: 1 }),
        Showroom.find(vis).sort({ order: 1 }),
        CoreStrength.find(vis).sort({ order: 1 }),
        SiteContent.findOne({ key: "main" }),
      ]);

    if (isAdminRequest(req)) {
      return sendSuccess(res, {
        site,
        products,
        projects,
        testimonials,
        catalogues,
        partners,
        showrooms,
        coreStrengths,
      }, { req });
    }

    const locale = getRequestLocale(req);
    return sendSuccess(res, {
      site: localizeSiteContent(site, locale),
      products: localizeModelDocs("Product", products, locale),
      projects: localizeModelDocs("Project", projects, locale),
      testimonials: localizeModelDocs("Testimonial", testimonials, locale),
      catalogues: localizeModelDocs("Catalogue", catalogues, locale),
      partners: localizeModelDocs("Partner", partners, locale),
      showrooms: localizeModelDocs("Showroom", showrooms, locale),
      coreStrengths: localizeModelDocs("CoreStrength", coreStrengths, locale),
    }, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function submitContact(req, res) {
  try {
    const payload = req.contactPayload;
    const contact = await Contact.create(payload);
    return sendSuccess(
      res,
      { contact },
      {
        status: 201,
        req,
        meta: { message: "Thank you! We will get back to you soon." },
      },
    );
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function deleteContact(req, res) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return sendError(res, 404, { message: "Not found" });
    return sendSuccess(res, { deleted: true }, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function listContacts(req, res) {
  try {
    // Route is behind adminAuth; isAdminRequest also true via req.varsoviaAdmin
    const { page, limit, skip } = parsePagination(req.query);
    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);
    return sendList(res, req, contacts, { page, limit, total });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function updateContactStatus(req, res) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!contact) return sendError(res, 404, { message: "Not found" });
    return sendSuccess(res, contact, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

function crud(Model, modelName) {
  return {
    list: async (req, res) => {
      try {
        const { page, limit, skip } = parsePagination(req.query);
        const filter = visibilityFilter(req);
        const [items, total] = await Promise.all([
          Model.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
          Model.countDocuments(filter),
        ]);
        const payload = isAdminRequest(req)
          ? items
          : localizeModelDocs(modelName, items, getRequestLocale(req));
        return sendList(res, req, payload, { page, limit, total });
      } catch (error) {
        return sendError(res, 500, { message: error.message });
      }
    },
    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        return sendSuccess(res, item, { status: 201, req });
      } catch (error) {
        return sendError(res, 400, { message: error.message });
      }
    },
    update: async (req, res) => {
      try {
        // Explicit $set so boolean false (e.g. visible:false) always persists
        const item = await Model.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          {
            new: true,
            runValidators: true,
            // Ensure we bypass any Mongoose cache
            rawResult: false,
          },
        );
        if (!item) return sendError(res, 404, { message: "Not found" });
        
        // Force a fresh read from database to ensure consistency
        const freshItem = await Model.findById(req.params.id).lean();
        
        return sendSuccess(res, freshItem || item, { req });
      } catch (error) {
        if (error.name === "CastError") return sendError(res, 404, { message: "Not found" });
        return sendError(res, 400, { message: error.message });
      }
    },
    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return sendError(res, 404, { message: "Not found" });
        return sendSuccess(res, null, { req, meta: { message: "Deleted" } });
      } catch (error) {
        if (error.name === "CastError") return sendError(res, 404, { message: "Not found" });
        return sendError(res, 500, { message: error.message });
      }
    },
  };
}

async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project =
      (await Project.findById(id).catch(() => null)) || (await Project.findOne({ slug: id }));
    if (!project) return sendError(res, 404, { message: "Project not found" });
    if (isHiddenFromPublic(req, project)) {
      return sendError(res, 404, { message: "Project not found" });
    }
    const payload = isAdminRequest(req)
      ? project
      : localizeModelDoc("Project", project, getRequestLocale(req));
    return sendSuccess(res, payload, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

function getInteriorCatalogFieldSpecHandler(req, res) {
  return sendSuccess(res, getInteriorCatalogFieldSpec(), { req });
}

async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const product =
      (await Product.findOne({ slug }).catch(() => null)) ||
      (await Product.findById(slug).catch(() => null));
    if (!product) return sendError(res, 404, { message: "Product not found" });
    if (isHiddenFromPublic(req, product)) {
      return sendError(res, 404, { message: "Product not found" });
    }
    const payload = isAdminRequest(req)
      ? product
      : localizeModelDoc("Product", product, getRequestLocale(req));
    return sendSuccess(res, payload, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function getSite(req, res) {
  try {
    const { PAGE_CMS_DEFAULTS } = require("../data/pageCmsDefaults");
    const site = await SiteContent.findOne({ key: "main" });
    if (isAdminRequest(req)) {
      const payload = site ? (site.toObject ? site.toObject() : site) : { key: "main" };
      if (!payload.inquiryForm) payload.inquiryForm = DEFAULT_INQUIRY_FORM;
      if (!payload.mainNavigation) payload.mainNavigation = DEFAULT_MAIN_NAVIGATION;
      if (!payload.footerNavigation) payload.footerNavigation = DEFAULT_FOOTER_NAVIGATION;
      for (const [key, value] of Object.entries(PAGE_CMS_DEFAULTS)) {
        if (!payload[key]) payload[key] = value;
      }
      // Return Mongo pages as stored. Filling from seed here made admin Save
      // write a seed snapshot and Refresh look like a wipe.
      return sendSuccess(res, payload, { req });
    }

    const locale = getRequestLocale(req);
    const payload = site ? localizeSiteContent(site, locale) : { key: "main" };
    if (!payload.inquiryForm) {
      payload.inquiryForm = localizeInquiryForm(DEFAULT_INQUIRY_FORM, locale);
    }
    if (!payload.mainNavigation) {
      payload.mainNavigation = localizeMainNavigation(DEFAULT_MAIN_NAVIGATION, locale);
    }
    if (!payload.footerNavigation) {
      payload.footerNavigation = localizeFooterNavigation(DEFAULT_FOOTER_NAVIGATION, locale);
    }
    return sendSuccess(res, payload, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function getInquiryFormSpec(req, res) {
  return sendSuccess(res, getInquiryFormFieldSpec(), { req });
}

async function getMainNavigationSpecHandler(req, res) {
  return sendSuccess(res, getMainNavigationSpec(), { req });
}

async function getFooterNavigationSpecHandler(req, res) {
  return sendSuccess(res, getFooterNavigationSpec(), { req });
}

async function updateSite(req, res) {
  try {
    const { mergeIaPages, mergeSavedIaPages } = require("../data/iaPagesDefaults");
    const { key: _key, _id: _id2, __v, pages: pagesPatch, ...rest } = req.body;
    
    console.log("[updateSite] ===== START =====");
    console.log("[updateSite] Received request body keys:", Object.keys(req.body));
    console.log("[updateSite] Has pagesPatch:", !!pagesPatch);
    if (pagesPatch) {
      console.log("[updateSite] PagesPatch keys:", Object.keys(pagesPatch));
      if (pagesPatch.furniture) {
        console.log("[updateSite] Furniture hub received");
        console.log("[updateSite] Furniture children count:", Array.isArray(pagesPatch.furniture.children) ? pagesPatch.furniture.children.length : 0);
        if (Array.isArray(pagesPatch.furniture.children) && pagesPatch.furniture.children[0]) {
          console.log("[updateSite] First child slug:", pagesPatch.furniture.children[0].slug);
          console.log("[updateSite] First child hero.image:", pagesPatch.furniture.children[0].hero?.image);
        }
      }
    }
    
    let site = await SiteContent.findOne({ key: "main" });
    if (!site) site = new SiteContent({ key: "main" });

    for (const [field, value] of Object.entries(rest)) {
      site.set(field, value);
    }

    if (pagesPatch && typeof pagesPatch === "object" && !Array.isArray(pagesPatch)) {
      console.log("[updateSite] Merging pages with mergeSavedIaPages...");
      const merged = mergeSavedIaPages(site.pages, pagesPatch);
      console.log("[updateSite] After merge, furniture children count:", Array.isArray(merged.furniture?.children) ? merged.furniture.children.length : 0);
      if (Array.isArray(merged.furniture?.children) && merged.furniture.children[0]) {
        console.log("[updateSite] After merge, first child hero.image:", merged.furniture.children[0].hero?.image);
      }
      site.set("pages", merged);
      site.markModified("pages");
    }

    console.log("[updateSite] Saving to MongoDB...");
    console.log("[updateSite] About to save - furniture hero:", 
      site.pages?.furniture?.hero?.image);
    await site.save();
    console.log("[updateSite] ✅ Saved to MongoDB successfully");
    
    // Verify what was actually written
    const verification = await SiteContent.findOne({ key: "main" }).lean();
    console.log("[updateSite] Verification read - furniture hero:",
      verification?.pages?.furniture?.hero?.image);
    
    invalidateInquiryFormCache();

    // Force a fresh read from database to ensure consistency
    const freshSite = await SiteContent.findOne({ key: "main" }).lean();
    const payload = freshSite || (site.toObject ? site.toObject() : site);
    
    console.log("[updateSite] Fresh from DB, furniture children count:", Array.isArray(payload.pages?.furniture?.children) ? payload.pages.furniture.children.length : 0);
    if (Array.isArray(payload.pages?.furniture?.children) && payload.pages.furniture.children[0]) {
      console.log("[updateSite] Fresh from DB, first child hero.image:", payload.pages.furniture.children[0].hero?.image);
    }
    
    if (!isAdminRequest(req)) {
      console.log("[updateSite] Not admin request, merging with defaults");
      payload.pages = mergeIaPages(payload.pages);
    } else {
      console.log("[updateSite] Admin request, returning raw MongoDB data");
    }
    
    console.log("[updateSite] ===== FINAL PAYLOAD CHECK =====");
    console.log("[updateSite] payload has pages:", !!payload.pages);
    console.log("[updateSite] payload.pages has furniture:", !!payload.pages?.furniture);
    console.log("[updateSite] Payload keys:", Object.keys(payload));
    console.log("[updateSite] Pages keys:", payload.pages ? Object.keys(payload.pages) : "NO PAGES");
    console.log("[updateSite] ===== END =====");
    return sendSuccess(res, payload, { req });
  } catch (error) {
    console.error("[updateSite] ❌ ERROR:", error.message);
    console.error("[updateSite] Stack:", error.stack);
    return sendError(res, 400, { message: error.message });
  }
}

async function getShowcaseById(req, res) {
  try {
    const { id } = req.params;
    const showcase = await Showcase.findById(id).catch(() => null);
    if (!showcase) return sendError(res, 404, { message: "Showcase not found" });
    if (isHiddenFromPublic(req, showcase)) {
      return sendError(res, 404, { message: "Showcase not found" });
    }
    const payload = isAdminRequest(req)
      ? showcase
      : localizeModelDoc("Showcase", showcase, getRequestLocale(req));
    return sendSuccess(res, payload, { req });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).catch(() => null);
    if (blog) {
      if (isHiddenFromPublic(req, blog)) {
        return sendError(res, 404, { message: "Blog not found" });
      }
      const payload = isAdminRequest(req)
        ? blog
        : localizeModelDoc("Blog", blog, getRequestLocale(req));
      return sendSuccess(res, payload, { req });
    }

    const parsed = parseInt(req.params.id, 10);
    if (!isNaN(parsed)) {
      const blogByOrder = await Blog.findOne({ order: parsed });
      if (blogByOrder) {
        if (isHiddenFromPublic(req, blogByOrder)) {
          return sendError(res, 404, { message: "Blog not found" });
        }
        const payload = isAdminRequest(req)
          ? blogByOrder
          : localizeModelDoc("Blog", blogByOrder, getRequestLocale(req));
        return sendSuccess(res, payload, { req });
      }
    }

    return sendError(res, 404, { message: "Blog not found" });
  } catch (error) {
    return sendError(res, 500, { message: error.message });
  }
}

module.exports = {
  getHomeData,
  submitContact,
  listContacts,
  updateContactStatus,
  deleteContact,
  getSite,
  updateSite,
  getBlogById,
  getShowcaseById,
  getProjectById,
  getInteriorCatalogFieldSpec: getInteriorCatalogFieldSpecHandler,
  getInquiryFormSpec,
  getMainNavigationSpec: getMainNavigationSpecHandler,
  getFooterNavigationSpec: getFooterNavigationSpecHandler,
  getProductBySlug,
  products: crud(Product, "Product"),
  projects: crud(Project, "Project"),
  testimonials: crud(Testimonial, "Testimonial"),
  catalogues: crud(Catalogue, "Catalogue"),
  partners: crud(Partner, "Partner"),
  showrooms: crud(Showroom, "Showroom"),
  showcases: crud(Showcase, "Showcase"),
  blogs: crud(Blog, "Blog"),
  teamMembers: crud(TeamMember, "TeamMember"),
  faqs: crud(FAQ, "FAQ"),
  coreStrengths: crud(CoreStrength, "CoreStrength"),
};
