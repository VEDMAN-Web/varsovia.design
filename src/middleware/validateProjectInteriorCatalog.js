const Project = require("../models/Project");
const { getInteriorCatalogValidationErrors } = require("../validation/projectInteriorCatalog");

/**
 * After Zod parse: ensure admin create/update includes filter metadata for /interior.
 * Merges with existing document on PUT so partial updates still must leave a valid catalog row.
 */
async function validateProjectInteriorCatalog(req, res, next) {
  try {
    let merged = { interiorCatalog: true, ...req.body };

    if (req.method === "PUT") {
      const existing = await Project.findById(req.params.id).lean();
      if (!existing) return next();
      merged = { ...existing, ...req.body };
    }

    const errors = getInteriorCatalogValidationErrors(merged);
    if (errors.length > 0) {
      return res.status(422).json({
        message: "Interior catalog validation failed. Include all filter fields for this category.",
        errors,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateProjectInteriorCatalog;
