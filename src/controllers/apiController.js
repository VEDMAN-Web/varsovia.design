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

async function getHomeData(req, res) {
  try {
    const [products, projects, testimonials, catalogues, partners, showrooms, coreStrengths, site] =
      await Promise.all([
        Product.find().sort({ order: 1 }),
        Project.find({ featured: true }).sort({ order: 1 }),
        Testimonial.find().sort({ order: 1 }),
        Catalogue.find().sort({ order: 1 }),
        Partner.find().sort({ order: 1 }),
        Showroom.find().sort({ order: 1 }),
        CoreStrength.find().sort({ order: 1 }),
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

async function listContacts(req, res) {
  try {
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
        const [items, total] = await Promise.all([
          Model.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
          Model.countDocuments(),
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
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return sendError(res, 404, { message: "Not found" });
        return sendSuccess(res, item, { req });
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
    const site = await SiteContent.findOne({ key: "main" });
    if (isAdminRequest(req)) {
      const payload = site ? (site.toObject ? site.toObject() : site) : { key: "main" };
      if (!payload.inquiryForm) payload.inquiryForm = DEFAULT_INQUIRY_FORM;
      if (!payload.mainNavigation) payload.mainNavigation = DEFAULT_MAIN_NAVIGATION;
      if (!payload.footerNavigation) payload.footerNavigation = DEFAULT_FOOTER_NAVIGATION;
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
    const { key: _key, _id: _id2, __v, ...update } = req.body;
    const site = await SiteContent.findOneAndUpdate({ key: "main" }, update, {
      new: true,
      upsert: true,
    });
    invalidateInquiryFormCache();
    return sendSuccess(res, site, { req });
  } catch (error) {
    return sendError(res, 400, { message: error.message });
  }
}

async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).catch(() => null);
    if (blog) {
      const payload = isAdminRequest(req)
        ? blog
        : localizeModelDoc("Blog", blog, getRequestLocale(req));
      return sendSuccess(res, payload, { req });
    }

    const parsed = parseInt(req.params.id, 10);
    if (!isNaN(parsed)) {
      const blogByOrder = await Blog.findOne({ order: parsed });
      if (blogByOrder) {
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
  getSite,
  updateSite,
  getBlogById,
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
