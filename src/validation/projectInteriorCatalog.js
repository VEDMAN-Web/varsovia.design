const { PROJECT_CATEGORIES } = require("../models/Project");

const SUBCATEGORY_CATEGORIES = new Set(["Bedroom", "Bathroom", "Door & Windows"]);

/** Allowed filter vocabulary (admin should use these; new values still work on the site). */
const INTERIOR_FILTER_VOCABULARY = {
  shapes: ["Island", "Irregular", "U Shape", "Galley", "L Shape", "Straight", "T Shape"],
  styles: ["Modern", "Traditional"],
  colors: [
    "Beige",
    "Black",
    "Blue",
    "Brown",
    "Gray",
    "Green",
    "Metallic",
    "Red",
    "Stone Tone",
    "White",
    "Wood Tone",
    "Dark",
    "Champagne",
    "Copper",
  ],
  materials: ["Thermofoil", "Glass", "Lacquer", "Melamine"],
  finishes: ["Matte"],
  subcategories: {
    Bedroom: [
      "Wardrobe Closets",
      "Custom Wardrobes",
      "Built In Wardrobes",
      "Walk In Closet",
      "Hinged Door Wardrobe",
      "Sliding Door Wardrobe",
    ],
    Bathroom: ["Wall Mounted & Floating", "Free Standing"],
    "Door & Windows": ["Interior Doors", "WPC Doors", "Aluminum Doors and Windows"],
  },
};

function isInteriorCatalogEntry(doc) {
  return doc && doc.interiorCatalog !== false;
}

function requireString(doc, field, label, errors) {
  const value = doc[field];
  if (typeof value !== "string" || !value.trim()) {
    errors.push({
      field,
      message: `${label} is required when interior catalog is enabled.`,
    });
  }
}

/**
 * Validates merged project document (create body or existing + PATCH).
 * @returns {{ field: string, message: string }[]}
 */
function getInteriorCatalogValidationErrors(doc) {
  if (!isInteriorCatalogEntry(doc)) return [];

  const errors = [];
  const category = doc.category;

  if (!category || !PROJECT_CATEGORIES.includes(category)) {
    errors.push({
      field: "category",
      message: `Category must be one of: ${PROJECT_CATEGORIES.join(", ")}.`,
    });
  }

  requireString(doc, "coverImage", "Cover image", errors);
  requireString(doc, "color", "Color", errors);
  requireString(doc, "material", "Material", errors);
  requireString(doc, "finish", "Finish", errors);

  if (
    doc.price === undefined ||
    doc.price === null ||
    typeof doc.price !== "number" ||
    Number.isNaN(doc.price) ||
    doc.price < 0
  ) {
    errors.push({
      field: "price",
      message: "Price (number ≥ 0) is required when interior catalog is enabled.",
    });
  }

  if (category === "Kitchen") {
    requireString(doc, "shape", "Shape", errors);
    requireString(doc, "style", "Style", errors);
  } else if (category && SUBCATEGORY_CATEGORIES.has(category)) {
    requireString(doc, "subcategory", "Subcategory (type)", errors);
  } else if (category === "Whole House Solutions" || category === "Furniture") {
    requireString(doc, "style", "Style", errors);
  }

  return errors;
}

/** Admin UI: required fields per category + allowed filter values */
function getInteriorCatalogFieldSpec() {
  return {
    categories: PROJECT_CATEGORIES,
    interiorCatalogDefault: true,
    commonRequired: ["title", "category", "coverImage", "color", "material", "finish", "price"],
    requiredByCategory: {
      Kitchen: ["shape", "style"],
      Bedroom: ["subcategory"],
      Bathroom: ["subcategory"],
      "Door & Windows": ["subcategory"],
      "Whole House Solutions": ["style"],
      Furniture: ["style"],
    },
    optional: [
      "slug",
      "description",
      "location",
      "gallery",
      "featured",
      "isNew",
      "order",
      "detailTitle",
      "detailDescription",
      "narrativeOne",
      "narrativeTwo",
    ],
    filterVocabulary: INTERIOR_FILTER_VOCABULARY,
    notes: [
      "Set interiorCatalog to false only for homepage featured projects that should not appear on /interior.",
      "Filter values must match listing filters exactly (case-sensitive), e.g. Modern, Island, Thermofoil, Matte.",
    ],
  };
}

module.exports = {
  getInteriorCatalogValidationErrors,
  getInteriorCatalogFieldSpec,
  isInteriorCatalogEntry,
  INTERIOR_FILTER_VOCABULARY,
};
