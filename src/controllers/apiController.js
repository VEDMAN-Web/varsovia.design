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

async function getHomeData(req, res) {
  try {
    const [products, projects, testimonials, catalogues, partners, showrooms, site] =
      await Promise.all([
        Product.find().sort({ order: 1 }),
        Project.find({ featured: true }).sort({ order: 1 }),
        Testimonial.find().sort({ order: 1 }),
        Catalogue.find().sort({ order: 1 }),
        Partner.find().sort({ order: 1 }),
        Showroom.find().sort({ order: 1 }),
        SiteContent.findOne({ key: "main" }),
      ]);

    res.json({
      site,
      products,
      projects,
      testimonials,
      catalogues,
      partners,
      showrooms,
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
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function crud(Model) {
  return {
    list: async (req, res) => {
      try {
        const page  = Math.max(1, parseInt(req.query.page)  || 0);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 0));
        const paginate = page > 0 && limit > 0 && (req.query.page || req.query.limit);

        if (paginate) {
          const skip  = (page - 1) * limit;
          const [items, total] = await Promise.all([
            Model.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
            Model.countDocuments(),
          ]);
          return res.json({
            data: items,
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

        // No pagination params — return flat array (backward compatible)
        const items = await Model.find().sort({ order: 1, createdAt: -1 });
        res.json(items);
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
    // Try by ObjectId first, then by slug
    const project = await Project.findById(id).catch(() => null)
      || await Project.findOne({ slug: id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    // Try by slug first, then by ObjectId
    const product = await Product.findOne({ slug }).catch(() => null)
      || await Product.findById(slug).catch(() => null);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getSite(req, res) {
  try {
    const site = await SiteContent.findOne({ key: "main" });
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSite(req, res) {
  try {
    // Strip key field — must never be overwritten via API
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
    // Try MongoDB ObjectId lookup first
    const blog = await Blog.findById(req.params.id).catch(() => null);
    if (blog) return res.json(blog);

    // Fallback: numeric order lookup
    const parsed = parseInt(req.params.id, 10);
    if (!isNaN(parsed)) {
      const blogByOrder = await Blog.findOne({ order: parsed });
      if (blogByOrder) return res.json(blogByOrder);
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
  products: crud(Product),
  projects: crud(Project),
  testimonials: crud(Testimonial),
  catalogues: crud(Catalogue),
  partners: crud(Partner),
  showrooms: crud(Showroom),
  showcases: crud(Showcase),
  blogs: crud(Blog),
  teamMembers: crud(TeamMember),
  faqs: crud(FAQ),
};
