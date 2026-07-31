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
const {
  getRequestLocale,
  isAdminRequest,
  localizeSiteContent,
  localizeModelDoc,
  localizeModelDocs,
} = require("../utils/locale");

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
      return res.json({
        site,
        products,
        projects,
        testimonials,
        catalogues,
        partners,
        showrooms,
        coreStrengths,
      });
    }

    const locale = getRequestLocale(req);
    res.json({
      site: localizeSiteContent(site, locale),
      products: localizeModelDocs("Product", products, locale),
      projects: localizeModelDocs("Project", projects, locale),
      testimonials: localizeModelDocs("Testimonial", testimonials, locale),
      catalogues: localizeModelDocs("Catalogue", catalogues, locale),
      partners: localizeModelDocs("Partner", partners, locale),
      showrooms: localizeModelDocs("Showroom", showrooms, locale),
      coreStrengths: localizeModelDocs("CoreStrength", coreStrengths, locale),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function submitContact(req, res) {
  try {
    const { name, email, phone, whatsapp, city, country, projectType, budget, message } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required." });
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      whatsapp,
      city,
      country,
      projectType,
      budget,
      message,
    });
    res.status(201).json({ message: "Thank you! We will get back to you soon.", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function listContacts(req, res) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateContactStatus(req, res) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!contact) return res.status(404).json({ message: "Not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function crud(Model, modelName) {
  return {
    list: async (req, res) => {
      try {
        const page = Math.max(1, parseInt(req.query.page) || 0);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 0));
        const paginate = page > 0 && limit > 0 && (req.query.page || req.query.limit);

        if (paginate) {
          const skip = (page - 1) * limit;
          const [items, total] = await Promise.all([
            Model.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
            Model.countDocuments(),
          ]);
          const payload = isAdminRequest(req)
            ? items
            : localizeModelDocs(modelName, items, getRequestLocale(req));
          return res.json({
            data: payload,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
              hasNext: page * limit < total,
              hasPrev: page > 1,
            },
          });
        }

        const items = await Model.find().sort({ order: 1, createdAt: -1 });
        if (isAdminRequest(req)) return res.json(items);
        res.json(localizeModelDocs(modelName, items, getRequestLocale(req)));
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
    update: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
      } catch (error) {
        if (error.name === "CastError") return res.status(404).json({ message: "Not found" });
        res.status(400).json({ message: error.message });
      }
    },
    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted" });
      } catch (error) {
        if (error.name === "CastError") return res.status(404).json({ message: "Not found" });
        res.status(500).json({ message: error.message });
      }
    },
  };
}

async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project =
      (await Project.findById(id).catch(() => null)) || (await Project.findOne({ slug: id }));
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (isAdminRequest(req)) return res.json(project);
    res.json(localizeModelDoc("Project", project, getRequestLocale(req)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const product =
      (await Product.findOne({ slug }).catch(() => null)) ||
      (await Product.findById(slug).catch(() => null));
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (isAdminRequest(req)) return res.json(product);
    res.json(localizeModelDoc("Product", product, getRequestLocale(req)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSite(req, res) {
  try {
    const site = await SiteContent.findOne({ key: "main" });
    if (isAdminRequest(req)) return res.json(site);
    res.json(localizeSiteContent(site, getRequestLocale(req)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSite(req, res) {
  try {
    const { key: _key, _id: _id2, __v, ...update } = req.body;
    const site = await SiteContent.findOneAndUpdate({ key: "main" }, update, {
      new: true,
      upsert: true,
    });
    res.json(site);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).catch(() => null);
    if (blog) {
      if (isAdminRequest(req)) return res.json(blog);
      return res.json(localizeModelDoc("Blog", blog, getRequestLocale(req)));
    }

    const parsed = parseInt(req.params.id, 10);
    if (!isNaN(parsed)) {
      const blogByOrder = await Blog.findOne({ order: parsed });
      if (blogByOrder) {
        if (isAdminRequest(req)) return res.json(blogByOrder);
        return res.json(localizeModelDoc("Blog", blogByOrder, getRequestLocale(req)));
      }
    }

    return res.status(404).json({ message: "Blog not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
